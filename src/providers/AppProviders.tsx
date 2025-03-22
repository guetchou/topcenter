
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./ThemeProvider";
import { HelmetProvider } from "react-helmet-async";
import { Suspense } from "react";
import PageLoader from "@/components/PageLoader";
import { SearchProvider } from "@/contexts/SearchContext";
import { IntlProviderWrapper } from "@/components/IntlProvider";
import { Toaster } from "sonner";

export function AppProviders({ children }) {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <ThemeProvider defaultTheme="light" storageKey="color-theme">
        <IntlProviderWrapper>
          <SearchProvider>
            <Suspense fallback={<PageLoader />}>
              <HelmetProvider>
                {children}
                <Toaster position="top-right" richColors closeButton />
              </HelmetProvider>
            </Suspense>
          </SearchProvider>
        </IntlProviderWrapper>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
