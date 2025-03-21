
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { TrainingProgress } from "@/types/training";

export const useTrainingProgress = (enrollmentId: string) => {
  return useQuery({
    queryKey: ['training-progress', enrollmentId],
    queryFn: async () => {
      if (!enrollmentId) return [];
      
      const response = await supabase
        .from('training_progress')
        .select('*')
        .eq('enrollment_id', enrollmentId)
        .order('last_accessed_at', { ascending: false })
        .execute();

      if (response.error) throw response.error;
      return response.data as TrainingProgress[];
    },
    enabled: !!enrollmentId
  });
};
