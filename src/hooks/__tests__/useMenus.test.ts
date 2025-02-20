
import { renderHook } from '@testing-library/react';
import { useMenus } from '../useMenus';
import { describe, it, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { FC, ReactNode } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper: FC<{ children: ReactNode }> = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useMenus hook', () => {
  it('should handle loading state', () => {
    const { result } = renderHook(() => useMenus('header'), {
      wrapper,
    });
    expect(result.current.isLoading).toBeDefined();
  });
});
