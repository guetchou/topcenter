import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./AuthProvider";
import { NotificationsProvider } from "./NotificationsProvider";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";
import PageLoader from "@/components/PageLoader";
import { HelmetProvider } from "react-helmet-async";

import { SearchProvider } from "@/contexts/SearchContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="color-theme">
          <AuthProvider>
            <NotificationsProvider>
              <SearchProvider>
                <Suspense fallback={<PageLoader />}>
                  <HelmetProvider>
                    {children}
                    <Toaster />
                  </HelmetProvider>
                </Suspense>
              </SearchProvider>
            </NotificationsProvider>
          </AuthProvider>
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </BrowserRouter>
  );
}
