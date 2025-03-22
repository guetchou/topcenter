
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "react-router-dom";
import { useSupabaseError } from "@/hooks/useSupabaseError";

interface PerformanceMetrics {
  loadTime: number;
  requestCount: number;
  timestamp?: string;
}

export const PerformanceMonitor = () => {
  const location = useLocation();
  const { handleError } = useSupabaseError();
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    requestCount: 0,
  });

  // Skip pages that shouldn't be tracked
  const shouldSkipTracking = useCallback(() => {
    const skipPaths = ['/auth', '/login', '/register'];
    return skipPaths.includes(location.pathname);
  }, [location.pathname]);

  // Get authenticated user
  const getAuthenticatedUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session?.user;
    } catch (error) {
      console.error("Error getting authenticated user:", error);
      handleError(error as Error);
      return null;
    }
  };

  // Log performance metrics to Supabase
  const logPerformanceMetrics = useCallback(async (loadTime: number) => {
    try {
      const user = await getAuthenticatedUser();
      
      if (!user) {
        console.log("User not authenticated, skipping performance tracking");
        return;
      }

      console.log("Logging performance metrics:", {
        metric_name: "page_load_time",
        metric_value: loadTime,
        model_version: "1.0",
        user_id: user.id,
      });

      const { error } = await supabase
        .from("ai_analytics")
        .insert([{
          metric_name: "page_load_time",
          metric_value: loadTime,
          model_version: "1.0",
          user_id: user.id,
        }])
        .execute();

      if (error) {
        console.error("Error inserting performance metrics:", error);
        handleError(error);
        return;
      }

      setMetrics((prev) => ({
        ...prev,
        loadTime,
        requestCount: prev.requestCount + 1,
        timestamp: new Date().toISOString(),
      }));

      console.log("Performance metrics logged successfully:", {
        loadTime,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error in logPerformanceMetrics:", error);
      handleError(error as Error);
    }
  }, [handleError]);

  // Track page load performance
  useEffect(() => {
    if (shouldSkipTracking()) {
      console.log(`Skipping performance tracking on ${location.pathname}`);
      return;
    }

    const startTime = performance.now();
    
    // Wait for page to fully load before measuring
    const trackOnPageLoad = () => {
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      logPerformanceMetrics(loadTime);
    };

    // Check if page is already loaded
    if (document.readyState === 'complete') {
      trackOnPageLoad();
    } else {
      window.addEventListener('load', trackOnPageLoad);
      return () => window.removeEventListener('load', trackOnPageLoad);
    }
  }, [location.pathname, logPerformanceMetrics, shouldSkipTracking]);

  // Component doesn't render anything
  return null;
};
