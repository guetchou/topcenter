
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SessionCard } from "@/components/training/SessionCard";
import type { TrainingSession } from "@/types/training";

const Training = () => {
  const { toast } = useToast();
  const [userEnrollments, setUserEnrollments] = useState<Set<string>>(new Set());

  const { data: sessions, isLoading } = useQuery({
    queryKey: ['training-sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('training_sessions')
        .select(`
          id,
          title,
          description,
          start_date,
          end_date,
          max_participants,
          status,
          materials_url,
          trainer:agents(full_name, avatar_url),
          _count { enrollments:training_enrollments_count }
        `)
        .eq('status', 'scheduled')
        .order('start_date', { ascending: true });

      if (error) throw error;
      return data as TrainingSession[];
    }
  });

  useEffect(() => {
    const fetchUserEnrollments = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: agent } = await supabase
        .from('agents')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!agent) return;

      const { data: enrollments } = await supabase
        .from('training_enrollments')
        .select('session_id')
        .eq('agent_id', agent.id);

      if (enrollments) {
        setUserEnrollments(new Set(enrollments.map(e => e.session_id)));
      }
    };

    fetchUserEnrollments();
  }, []);

  const handleStartMaterial = async (materialId: string) => {
    toast({
      title: "Contenu en cours de chargement",
      description: "Vous allez être redirigé vers le contenu de formation",
    });
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Formation</h1>
      
      <div className="grid gap-6">
        {sessions?.map((session) => (
          <SessionCard
            key={session.id}
            session={session}
            isEnrolled={userEnrollments.has(session.id)}
            onEnrollmentSuccess={(sessionId) => {
              setUserEnrollments(prev => new Set([...prev, sessionId]));
            }}
            onStartMaterial={handleStartMaterial}
          />
        ))}
      </div>
    </div>
  );
};

export default Training;
