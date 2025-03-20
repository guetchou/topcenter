
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";

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
      await api.post('/training/enroll', { sessionId });
      
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
