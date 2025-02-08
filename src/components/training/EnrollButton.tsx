
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface EnrollButtonProps {
  sessionId: string;
  isEnrolled: boolean;
  onEnrollmentSuccess: (sessionId: string) => void;
}

export const EnrollButton = ({ sessionId, isEnrolled, onEnrollmentSuccess }: EnrollButtonProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleEnroll = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    const { data: agent } = await supabase
      .from('agents')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!agent) {
      toast({
        title: "Erreur",
        description: "Agent non trouvé",
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase
      .from('training_enrollments')
      .insert({
        session_id: sessionId,
        agent_id: agent.id
      });

    if (!error) {
      onEnrollmentSuccess(sessionId);
      toast({
        title: "Succès",
        description: "Inscription à la formation réussie",
      });
    } else {
      toast({
        title: "Erreur",
        description: "Impossible de s'inscrire à la formation",
        variant: "destructive"
      });
    }
  };

  return (
    <Button 
      className="w-full"
      variant={isEnrolled ? "secondary" : "default"}
      disabled={isEnrolled}
      onClick={handleEnroll}
    >
      {isEnrolled ? 'Déjà inscrit' : "S'inscrire"}
    </Button>
  );
};
