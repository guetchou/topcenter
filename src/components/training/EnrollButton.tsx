
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EnrollButtonProps {
  sessionId: string;
  isEnrolled: boolean;
  onEnrollmentSuccess: (sessionId: string) => void;
}

export const EnrollButton = ({ 
  sessionId, 
  isEnrolled, 
  onEnrollmentSuccess 
}: EnrollButtonProps) => {
  const { toast } = useToast();

  const handleEnroll = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { data: agent } = await supabase
        .from('agents')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!agent) throw new Error("Agent non trouvé");

      const { error } = await supabase
        .from('training_enrollments')
        .insert({
          session_id: sessionId,
          agent_id: agent.id
        });

      if (error) throw error;

      toast({
        title: "Inscription réussie",
        description: "Vous êtes maintenant inscrit à cette session"
      });

      onEnrollmentSuccess(sessionId);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de s'inscrire à la session",
        variant: "destructive"
      });
    }
  }, [sessionId, toast, onEnrollmentSuccess]);

  return (
    <Button 
      variant={isEnrolled ? "outline" : "default"}
      className="w-full"
      onClick={handleEnroll}
      disabled={isEnrolled}
    >
      {isEnrolled ? "Déjà inscrit" : "S'inscrire"}
    </Button>
  );
};
