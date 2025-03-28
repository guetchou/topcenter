
import { render } from '@testing-library/react';
import { Button } from '../button';
import { expect, describe, it } from 'vitest';

describe('Button', () => {
  it('renders button with default variant', () => {
    const { getByRole } = render(<Button>Click me</Button>);
    const button = getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary');
  });

  it('renders button with custom variant', () => {
    const { getByRole } = render(<Button variant="destructive">Delete</Button>);
    const button = getByRole('button');
    expect(button).toHaveClass('bg-destructive');
  });

  it('renders button with custom size', () => {
    const { getByRole } = render(<Button size="sm">Small</Button>);
    const button = getByRole('button');
    expect(button).toHaveClass('h-9');
  });

  it('renders as child component when asChild is true', () => {
    const { getByRole } = render(
      <Button asChild>
        <a href="/">Link</a>
      </Button>
    );
    const link = getByRole('link');
    expect(link).toBeInTheDocument();
  });
});
