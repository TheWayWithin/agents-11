import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders button with default props', () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant classes correctly', () => {
    render(
      <div>
        <Button variant="default">Default</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
    );

    expect(screen.getByRole('button', { name: /default/i })).toHaveClass(
      'bg-primary'
    );
    expect(screen.getByRole('button', { name: /destructive/i })).toHaveClass(
      'bg-destructive'
    );
    expect(screen.getByRole('button', { name: /outline/i })).toHaveClass(
      'border',
      'border-input'
    );
    expect(screen.getByRole('button', { name: /secondary/i })).toHaveClass(
      'bg-secondary'
    );
    expect(screen.getByRole('button', { name: /ghost/i })).toHaveClass(
      'hover:bg-accent'
    );
    expect(screen.getByRole('button', { name: /link/i })).toHaveClass(
      'text-primary',
      'underline-offset-4'
    );
  });

  it('applies size classes correctly', () => {
    render(
      <div>
        <Button size="default">Default Size</Button>
        <Button size="sm">Small</Button>
        <Button size="lg">Large</Button>
        <Button size="icon">Icon</Button>
      </div>
    );

    expect(screen.getByRole('button', { name: /default size/i })).toHaveClass(
      'h-9',
      'px-4'
    );
    expect(screen.getByRole('button', { name: /small/i })).toHaveClass(
      'h-8',
      'px-3'
    );
    expect(screen.getByRole('button', { name: /large/i })).toHaveClass(
      'h-10',
      'px-8'
    );
    expect(screen.getByRole('button', { name: /icon/i })).toHaveClass(
      'h-9',
      'w-9'
    );
  });

  it('disables button when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);

    const button = screen.getByRole('button', { name: /disabled button/i });
    expect(button).toBeDisabled();
    expect(button).toHaveClass(
      'disabled:pointer-events-none',
      'disabled:opacity-50'
    );
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>);

    const button = screen.getByRole('button', { name: /custom/i });
    expect(button).toHaveClass('custom-class');
  });

  it('forwards other HTML attributes', () => {
    render(
      <Button type="submit" data-testid="submit-btn">
        Submit
      </Button>
    );

    const button = screen.getByTestId('submit-btn');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('renders as child component when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    );

    const link = screen.getByRole('link', { name: /link button/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
    expect(link).toHaveClass('inline-flex', 'items-center', 'justify-center');
  });

  it('combines variant and size classes correctly', () => {
    render(
      <Button variant="outline" size="lg">
        Large Outline
      </Button>
    );

    const button = screen.getByRole('button', { name: /large outline/i });
    expect(button).toHaveClass('border', 'border-input', 'h-10', 'px-8');
  });
});
