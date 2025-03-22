
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./ThemeProvider"; 
import { useAuth } from "@/contexts/AuthContext";
import { NotificationsProvider } from "@/components/notifications/NotificationsProvider";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";
import PageLoader from "@/components/PageLoader";
import { HelmetProvider } from "react-helmet-async";
import { SearchProvider } from "@/contexts/SearchContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
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
  );
}

// Create a simple AuthContext provider that uses the existing useAuth hook
const AuthContext = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};
