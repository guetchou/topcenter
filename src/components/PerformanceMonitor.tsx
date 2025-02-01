import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<{
    loadTime: number;
    requestCount: number;
  }>({
    loadTime: 0,
    requestCount: 0,
  });

  useEffect(() => {
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
  }, []);

  return null; // Composant invisible qui ne fait que tracker les performances
};