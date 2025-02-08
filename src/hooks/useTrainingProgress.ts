
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { TrainingProgress } from "@/types/training";

export const useTrainingProgress = (enrollmentId: string) => {
  return useQuery({
    queryKey: ['training-progress', enrollmentId],
    queryFn: async (): Promise<TrainingProgress[]> => {
      const { data, error } = await supabase
        .from('training_progress')
        .select('*')
        .eq('enrollment_id', enrollmentId);

      if (error) throw error;
      return data;
    },
    enabled: !!enrollmentId
  });
};
