
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMenus } from '../useMenus';
import { expect, describe, it, vi, beforeEach } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => ({
            data: [
              {
                id: '1',
                name: 'Main Menu',
                location: 'header',
                items: [
                  {
                    id: '1',
                    label: 'Home',
                    url: '/',
                  }
                ],
                created_at: '2024-01-01',
                updated_at: '2024-01-01',
              }
            ],
            error: null,
          })
        })
      })
    })
  }
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useMenus', () => {
  beforeEach(() => {
    queryClient.clear();
  });

  it('fetches and returns menus data', async () => {
    const { result } = renderHook(() => useMenus('header'), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.[0].location).toBe('header');
    expect(result.current.data?.[0].items).toHaveLength(1);
  });
});
