import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

describe('Card Components', () => {
  describe('Card', () => {
    it('renders with default classes', () => {
      render(<Card data-testid="card">Card content</Card>);

      const card = screen.getByTestId('card');
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass(
        'rounded-xl',
        'border',
        'bg-card',
        'text-card-foreground',
        'shadow'
      );
    });

    it('applies custom className', () => {
      render(
        <Card className="custom-class" data-testid="card">
          Content
        </Card>
      );

      const card = screen.getByTestId('card');
      expect(card).toHaveClass('custom-class', 'rounded-xl', 'border');
    });

    it('forwards other HTML attributes', () => {
      render(
        <Card id="test-card" role="article">
          Content
        </Card>
      );

      const card = screen.getByRole('article');
      expect(card).toHaveAttribute('id', 'test-card');
    });
  });

  describe('CardHeader', () => {
    it('renders with default classes', () => {
      render(<CardHeader data-testid="card-header">Header content</CardHeader>);

      const header = screen.getByTestId('card-header');
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'p-6');
    });

    it('applies custom className', () => {
      render(
        <CardHeader className="custom-header" data-testid="card-header">
          Content
        </CardHeader>
      );

      const header = screen.getByTestId('card-header');
      expect(header).toHaveClass('custom-header', 'flex', 'flex-col');
    });
  });

  describe('CardTitle', () => {
    it('renders with default classes', () => {
      render(<CardTitle data-testid="card-title">Title text</CardTitle>);

      const title = screen.getByTestId('card-title');
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass(
        'font-semibold',
        'leading-none',
        'tracking-tight'
      );
      expect(title).toHaveTextContent('Title text');
    });

    it('applies custom className', () => {
      render(
        <CardTitle className="custom-title" data-testid="card-title">
          Title
        </CardTitle>
      );

      const title = screen.getByTestId('card-title');
      expect(title).toHaveClass('custom-title', 'font-semibold');
    });
  });

  describe('CardDescription', () => {
    it('renders with default classes', () => {
      render(
        <CardDescription data-testid="card-description">
          Description text
        </CardDescription>
      );

      const description = screen.getByTestId('card-description');
      expect(description).toBeInTheDocument();
      expect(description).toHaveClass('text-sm', 'text-muted-foreground');
      expect(description).toHaveTextContent('Description text');
    });

    it('applies custom className', () => {
      render(
        <CardDescription className="custom-desc" data-testid="card-description">
          Desc
        </CardDescription>
      );

      const description = screen.getByTestId('card-description');
      expect(description).toHaveClass('custom-desc', 'text-sm');
    });
  });

  describe('CardContent', () => {
    it('renders with default classes', () => {
      render(
        <CardContent data-testid="card-content">Content text</CardContent>
      );

      const content = screen.getByTestId('card-content');
      expect(content).toBeInTheDocument();
      expect(content).toHaveClass('p-6', 'pt-0');
      expect(content).toHaveTextContent('Content text');
    });

    it('applies custom className', () => {
      render(
        <CardContent className="custom-content" data-testid="card-content">
          Content
        </CardContent>
      );

      const content = screen.getByTestId('card-content');
      expect(content).toHaveClass('custom-content', 'p-6', 'pt-0');
    });
  });

  describe('CardFooter', () => {
    it('renders with default classes', () => {
      render(<CardFooter data-testid="card-footer">Footer content</CardFooter>);

      const footer = screen.getByTestId('card-footer');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass('flex', 'items-center', 'p-6', 'pt-0');
      expect(footer).toHaveTextContent('Footer content');
    });

    it('applies custom className', () => {
      render(
        <CardFooter className="custom-footer" data-testid="card-footer">
          Footer
        </CardFooter>
      );

      const footer = screen.getByTestId('card-footer');
      expect(footer).toHaveClass('custom-footer', 'flex', 'items-center');
    });
  });

  describe('Complete Card', () => {
    it('renders full card structure correctly', () => {
      render(
        <Card data-testid="full-card">
          <CardHeader>
            <CardTitle>Test Title</CardTitle>
            <CardDescription>Test description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Test content paragraph</p>
          </CardContent>
          <CardFooter>
            <button>Action Button</button>
          </CardFooter>
        </Card>
      );

      const card = screen.getByTestId('full-card');
      expect(card).toBeInTheDocument();

      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test description')).toBeInTheDocument();
      expect(screen.getByText('Test content paragraph')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Action Button' })
      ).toBeInTheDocument();
    });
  });
});
