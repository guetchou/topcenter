
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./ThemeProvider";
import { Suspense } from "react";
import PageLoader from "@/components/PageLoader";
import { SearchProvider } from "@/contexts/SearchContext";
import { IntlProviderWrapper } from "@/components/IntlProvider";
import { Toaster } from "sonner";

// Création d'une instance de QueryClient simple pour éviter les conflits
const queryClient = new QueryClient();

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
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
  );
}
