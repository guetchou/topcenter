
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./ThemeProvider";
import { Suspense } from "react";
import PageLoader from "@/components/PageLoader";
import { SearchProvider } from "@/contexts/SearchContext";
import { IntlProviderWrapper } from "@/components/IntlProvider";
import { Toaster } from "sonner";
import { HelmetProvider } from "react-helmet-async";

// Création d'une instance de QueryClient en dehors du composant
// pour éviter sa recréation à chaque rendu
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="color-theme">
          <IntlProviderWrapper>
            <SearchProvider>
              <Suspense fallback={<PageLoader />}>
                {children}
                <Toaster position="top-right" richColors closeButton />
              </Suspense>
            </SearchProvider>
          </IntlProviderWrapper>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
