
import { renderHook } from '@testing-library/react';
import { useMenus } from '../useMenus';
import { describe, it, expect } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

function Wrapper({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

describe('useMenus hook', () => {
  it('should handle loading state', () => {
    const { result } = renderHook(() => useMenus('header'), {
      wrapper: Wrapper
    });
    expect(result.current.isLoading).toBeDefined();
  });
});
