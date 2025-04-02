
import { render, screen } from '@testing-library/react';
import { Button } from '../button';
import { expect, describe, it } from 'vitest';

describe('Button', () => {
  it('renders button with default variant', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary');
  });

  it('renders button with custom variant', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-destructive');
  });

  it('renders button with custom size', () => {
    render(<Button size="sm">Small</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-9');
  });

  it('renders as child component when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/">Link</a>
      </Button>
    );
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
  });
});
