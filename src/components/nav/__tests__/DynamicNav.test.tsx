
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { DynamicNav } from '../DynamicNav';
import { expect, describe, it, beforeEach, vi } from 'vitest';

// Mock the useAuth hook
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: null,
    impersonatedUser: null,
    logout: vi.fn(),
    stopImpersonation: vi.fn(),
    checkUser: vi.fn(),
  }),
}));

// Mock the useMenus hook
vi.mock('@/hooks/useMenus', () => ({
  useMenus: () => ({
    primaryMenuItems: [],
    footerMenuItems: [],
    isLoading: false,
  }),
}));

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

  it('renders navigation', () => {
    render(<DynamicNav />, { wrapper: Wrapper });
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('toggles mobile menu when burger button is clicked', () => {
    render(<DynamicNav />, { wrapper: Wrapper });
    const burgerButton = screen.getByLabelText('Menu');
    fireEvent.click(burgerButton);
    // Test that the menu is opened
    expect(document.querySelector('[role="dialog"]')).toBeInTheDocument();
  });
});
