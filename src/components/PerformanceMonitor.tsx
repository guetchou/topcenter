import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "react-router-dom";
import { useSupabaseError } from "@/hooks/useSupabaseError";

export const PerformanceMonitor = () => {
  const location = useLocation();
  const { handleError } = useSupabaseError();
  const [metrics, setMetrics] = useState<{
    loadTime: number;
    requestCount: number;
  }>({
    loadTime: 0,
    requestCount: 0,
  });

  useEffect(() => {
    // Skip performance tracking on auth page
    if (location.pathname === "/auth") {
      console.log("Skipping performance tracking on auth page");
      return;
    }

    const startTime = performance.now();

    const trackPerformance = async () => {
      try {
        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.log("User not authenticated, skipping performance tracking");
          return;
        }

        const endTime = performance.now();
        const loadTime = endTime - startTime;

        console.log("Attempting to log performance metrics:", {
          metric_name: "page_load_time",
          metric_value: loadTime,
          model_version: "1.0",
          user_id: session.user.id,
        });

        const { error } = await supabase.from("ai_analytics").insert([
          {
            metric_name: "page_load_time",
            metric_value: loadTime,
            model_version: "1.0",
            user_id: session.user.id,
          },
        ]);

        if (error) {
          console.error("Error inserting performance metrics:", error);
          handleError(error);
          return;
        }

        setMetrics((prev) => ({
          ...prev,
          loadTime,
          requestCount: prev.requestCount + 1,
        }));

        console.log("Performance metrics logged successfully:", {
          loadTime,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Error in trackPerformance:", error);
        handleError(error as Error);
      }
    };

    trackPerformance();
  }, [location.pathname, handleError]);

  return null;
};