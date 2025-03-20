
import { useToast } from "@/hooks/use-toast";

export const useApiError = () => {
  const { toast } = useToast();

  const handleError = (error: Error) => {
    console.error("API Error:", error);
    
    toast({
      title: "Erreur",
      description: "Une erreur est survenue. Veuillez réessayer.",
      variant: "destructive",
    });
  };

  return { handleError };
};
