
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { TrainingMaterial, TrainingProgress } from "@/types/training";

export const useTrainingMaterials = (sessionId: string) => {
  return useQuery({
    queryKey: ['training-materials', sessionId],
    queryFn: async () => {
      if (!sessionId) return [];

      // Get current user and agent
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: agent } = await supabase
        .from('agents')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!agent) return [];

      // Get enrollment
      const { data: enrollment } = await supabase
        .from('training_enrollments')
        .select('id')
        .eq('session_id', sessionId)
        .eq('agent_id', agent.id)
        .single();

      // Get materials with progress
      const { data: materials, error } = await supabase
        .from('training_materials')
        .select(`
          *,
          progress:training_progress(
            completion_status,
            completed_at,
            last_accessed_at
          )
        `)
        .eq('session_id', sessionId)
        .order('order_index', { ascending: true });

      if (error) throw error;

      return materials.map(material => ({
        ...material,
        progress: material.progress?.[0] as TrainingProgress | undefined
      })) as (TrainingMaterial & { progress?: TrainingProgress })[];
    },
    enabled: !!sessionId
  });
};
