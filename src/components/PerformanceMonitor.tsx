import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "react-router-dom";

export const PerformanceMonitor = () => {
  const location = useLocation();
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
      return;
    }

    const startTime = performance.now();

    const trackPerformance = async () => {
      const endTime = performance.now();
      const loadTime = endTime - startTime;

      try {
        await supabase.from("ai_analytics").insert([
          {
            metric_name: "page_load_time",
            metric_value: loadTime,
            model_version: "1.0",
          },
        ]);

        setMetrics((prev) => ({
          ...prev,
          loadTime,
          requestCount: prev.requestCount + 1,
        }));

        console.log("Performance metrics logged:", {
          loadTime,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Error logging performance metrics:", error);
      }
    };

    trackPerformance();
  }, [location.pathname]); // Add location.pathname as dependency

  return null;
};