import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignUpPage from '../signup/page';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/toast';

// Mock the modules
jest.mock('@/lib/supabase/client');
jest.mock('@/components/ui/toast');

const mockCreateClient = createClient as jest.MockedFunction<
  typeof createClient
>;
const mockUseToast = useToast as jest.MockedFunction<typeof useToast>;

describe('SignUpPage', () => {
  const mockAddToast = jest.fn();
  const mockSignUp = jest.fn();

  beforeEach(() => {
    mockUseToast.mockReturnValue({
      addToast: mockAddToast,
    });

    mockCreateClient.mockReturnValue({
      auth: {
        signInWithPassword: jest.fn(),
        signUp: mockSignUp,
        signOut: jest.fn(),
        getUser: jest.fn(),
      },
      from: jest.fn(),
    } as any);

    // Clear all mocks
    jest.clearAllMocks();
  });

  it('renders signup form correctly', () => {
    render(<SignUpPage />);

    expect(
      screen.getByRole('heading', { name: /create your account/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /create account/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /sign in to your existing account/i })
    ).toBeInTheDocument();
  });

  it('shows error when passwords do not match', async () => {
    const user = userEvent.setup();
    render(<SignUpPage />);

    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(
      screen.getByLabelText(/email address/i),
      'test@example.com'
    );
    await user.type(screen.getByLabelText(/^password$/i), 'password123');
    await user.type(screen.getByLabelText(/confirm password/i), 'password456');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });

    expect(mockAddToast).toHaveBeenCalledWith(
      'error',
      'Passwords do not match'
    );
    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it('shows error when password is too short', async () => {
    const user = userEvent.setup();
    render(<SignUpPage />);

    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(
      screen.getByLabelText(/email address/i),
      'test@example.com'
    );
    await user.type(screen.getByLabelText(/^password$/i), '123');
    await user.type(screen.getByLabelText(/confirm password/i), '123');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(
        screen.getByText('Password must be at least 6 characters')
      ).toBeInTheDocument();
    });

    expect(mockAddToast).toHaveBeenCalledWith(
      'error',
      'Password must be at least 6 characters'
    );
    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it('handles successful signup', async () => {
    const user = userEvent.setup();
    mockSignUp.mockResolvedValue({ error: null });

    render(<SignUpPage />);

    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(
      screen.getByLabelText(/email address/i),
      'test@example.com'
    );
    await user.type(screen.getByLabelText(/^password$/i), 'password123');
    await user.type(screen.getByLabelText(/confirm password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          data: {
            full_name: 'John Doe',
          },
        },
      });
    });

    expect(
      screen.getByText('Check your email for the confirmation link')
    ).toBeInTheDocument();
    expect(mockAddToast).toHaveBeenCalledWith(
      'success',
      'Check your email for the confirmation link'
    );
  });

  it('handles signup error', async () => {
    const user = userEvent.setup();
    const errorMessage = 'User already registered';
    mockSignUp.mockResolvedValue({
      error: { message: errorMessage },
    });

    render(<SignUpPage />);

    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(
      screen.getByLabelText(/email address/i),
      'test@example.com'
    );
    await user.type(screen.getByLabelText(/^password$/i), 'password123');
    await user.type(screen.getByLabelText(/confirm password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    expect(mockAddToast).toHaveBeenCalledWith('error', errorMessage);
  });

  it('shows loading state during signup', async () => {
    const user = userEvent.setup();
    mockSignUp.mockImplementation(
      () =>
        new Promise(resolve => setTimeout(() => resolve({ error: null }), 100))
    );

    render(<SignUpPage />);

    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(
      screen.getByLabelText(/email address/i),
      'test@example.com'
    );
    await user.type(screen.getByLabelText(/^password$/i), 'password123');
    await user.type(screen.getByLabelText(/confirm password/i), 'password123');

    const submitButton = screen.getByRole('button', {
      name: /create account/i,
    });
    await user.click(submitButton);

    expect(
      screen.getByRole('button', { name: /creating account\.\.\./i })
    ).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    // Wait for loading to complete
    await waitFor(() => {
      expect(
        screen.getByText('Check your email for the confirmation link')
      ).toBeInTheDocument();
    });
  });

  it('handles unexpected error', async () => {
    const user = userEvent.setup();
    mockSignUp.mockRejectedValue(new Error('Network error'));

    render(<SignUpPage />);

    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(
      screen.getByLabelText(/email address/i),
      'test@example.com'
    );
    await user.type(screen.getByLabelText(/^password$/i), 'password123');
    await user.type(screen.getByLabelText(/confirm password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(
        screen.getByText('An unexpected error occurred')
      ).toBeInTheDocument();
    });

    expect(mockAddToast).toHaveBeenCalledWith(
      'error',
      'An unexpected error occurred'
    );
  });

  it('navigates to login page when clicking sign in link', () => {
    render(<SignUpPage />);

    const loginLink = screen.getByRole('link', {
      name: /sign in to your existing account/i,
    });
    expect(loginLink).toHaveAttribute('href', '/login');
  });

  it('navigates to home when clicking back to home link', () => {
    render(<SignUpPage />);

    const homeLink = screen.getByRole('link', { name: /back to home/i });
    expect(homeLink).toHaveAttribute('href', '/');
  });
});
