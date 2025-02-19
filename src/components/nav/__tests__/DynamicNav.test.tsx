
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { DynamicNav } from '../DynamicNav';
import { expect, describe, it, beforeEach } from 'vitest';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      {children}
    </BrowserRouter>
  </QueryClientProvider>
);

describe('DynamicNav', () => {
  beforeEach(() => {
    queryClient.clear();
  });

  it('renders loading state initially', () => {
    render(<DynamicNav />, { wrapper: Wrapper });
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('toggles mobile menu when burger button is clicked', () => {
    render(<DynamicNav />, { wrapper: Wrapper });
    const burgerButton = screen.getByRole('button');
    fireEvent.click(burgerButton);
    // Le menu mobile devrait être visible
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
