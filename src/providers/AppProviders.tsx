
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./ThemeProvider"; // Changed from @/components/theme-provider
import { BrowserRouter } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext"; // Use existing Auth context
import { NotificationsProvider } from "@/components/notifications/NotificationsProvider"; // Use existing NotificationsProvider
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
          <AuthContext>
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
          </AuthContext>
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </BrowserRouter>
  );
}

// Create a simple AuthContext provider that uses the existing useAuth hook
const AuthContext = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};
