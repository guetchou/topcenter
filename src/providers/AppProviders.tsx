
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./ThemeProvider";
import { Suspense } from "react";
import PageLoader from "@/components/PageLoader";
import { SearchProvider } from "@/contexts/SearchContext";
import { IntlProviderWrapper } from "@/components/IntlProvider";
import { Toaster } from "sonner";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ChatPalInitializer } from "@/components/chat/ChatPalInitializer";

// Configuration simplifiée de QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    },
  },
});

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="color-theme">
          <IntlProviderWrapper>
            <SearchProvider>
              <Suspense fallback={<PageLoader />}>
                {children}
                <Toaster position="top-right" richColors closeButton />
                <ChatPalInitializer />
              </Suspense>
            </SearchProvider>
          </IntlProviderWrapper>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
