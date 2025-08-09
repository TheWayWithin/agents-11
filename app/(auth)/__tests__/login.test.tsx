import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import LoginPage from '../login/page';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/toast';

// Get mocked functions that are already set up in jest.setup.js
const mockUseRouter = jest.mocked(useRouter);
const mockCreateClient = jest.mocked(createClient);
const mockUseToast = jest.mocked(useToast);

describe('LoginPage', () => {
  const mockPush = jest.fn();
  const mockRefresh = jest.fn();
  const mockAddToast = jest.fn();
  const mockSignInWithPassword = jest.fn();

  beforeEach(() => {
    // Reset mocks
    mockPush.mockReset();
    mockRefresh.mockReset();
    mockAddToast.mockReset();
    mockSignInWithPassword.mockReset();

    // Set up mock return values
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: mockRefresh,
    });

    mockUseToast.mockReturnValue({
      addToast: mockAddToast,
    });

    mockCreateClient.mockReturnValue({
      auth: {
        signInWithPassword: mockSignInWithPassword,
        signUp: jest.fn(),
        signOut: jest.fn(),
        getUser: jest.fn(),
      },
      from: jest.fn(),
    } as any);
  });

  it('renders login form correctly', () => {
    render(<LoginPage />);

    expect(
      screen.getByRole('heading', { name: /sign in to your account/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign in/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /create a new account/i })
    ).toBeInTheDocument();
  });

  it('shows validation error when submitting empty form', async () => {
    render(<LoginPage />);

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);

    // HTML5 validation should prevent submission with empty required fields
    expect(mockSignInWithPassword).not.toHaveBeenCalled();
  });

  it('handles successful login', async () => {
    const user = userEvent.setup();
    mockSignInWithPassword.mockResolvedValue({ error: null });

    render(<LoginPage />);

    await user.type(
      screen.getByLabelText(/email address/i),
      'test@example.com'
    );
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    expect(mockAddToast).toHaveBeenCalledWith(
      'success',
      'Successfully signed in!'
    );
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
    expect(mockRefresh).toHaveBeenCalled();
  });

  it('handles login error', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Invalid login credentials';
    mockSignInWithPassword.mockResolvedValue({
      error: { message: errorMessage },
    });

    render(<LoginPage />);

    await user.type(
      screen.getByLabelText(/email address/i),
      'test@example.com'
    );
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    expect(mockAddToast).toHaveBeenCalledWith('error', errorMessage);
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('shows loading state during login', async () => {
    const user = userEvent.setup();
    mockSignInWithPassword.mockImplementation(
      () =>
        new Promise(resolve => setTimeout(() => resolve({ error: null }), 100))
    );

    render(<LoginPage />);

    await user.type(
      screen.getByLabelText(/email address/i),
      'test@example.com'
    );
    await user.type(screen.getByLabelText(/password/i), 'password123');

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    expect(
      screen.getByRole('button', { name: /signing in\.\.\./i })
    ).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    // Wait for loading to complete
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /sign in/i })
      ).not.toBeDisabled();
    });
  });

  it('handles unexpected error', async () => {
    const user = userEvent.setup();
    mockSignInWithPassword.mockRejectedValue(new Error('Network error'));

    render(<LoginPage />);

    await user.type(
      screen.getByLabelText(/email address/i),
      'test@example.com'
    );
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

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

  it('navigates to signup page when clicking create account link', () => {
    render(<LoginPage />);

    const signupLink = screen.getByRole('link', {
      name: /create a new account/i,
    });
    expect(signupLink).toHaveAttribute('href', '/signup');
  });

  it('navigates to home when clicking back to home link', () => {
    render(<LoginPage />);

    const homeLink = screen.getByRole('link', { name: /back to home/i });
    expect(homeLink).toHaveAttribute('href', '/');
  });
});
