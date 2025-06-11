
import { render } from '@testing-library/react';
import { Button } from '../button';
import { expect, describe, it } from 'vitest';

describe('Button', () => {
  it('renders correctly', () => {
    const { container } = render(<Button>Test Button</Button>);
    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
    expect(button?.textContent).toBe('Test Button');
  });

  it('applies correct variant styles', () => {
    const { container } = render(<Button variant="destructive">Delete</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('bg-destructive');
  });

  it('applies correct size styles', () => {
    const { container } = render(<Button size="sm">Small</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('h-9');
  });
});
