
import { QueryClient } from "@tanstack/react-query";

// Configuration simplifiée pour éviter les conflits
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false
    },
  },
});
