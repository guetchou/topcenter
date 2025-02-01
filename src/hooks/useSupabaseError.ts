import { useToast } from "@/hooks/use-toast";

export const useSupabaseError = () => {
  const { toast } = useToast();

  const handleError = (error: Error) => {
    console.error("Supabase Error:", error);
    
    toast({
      title: "Erreur",
      description: "Une erreur est survenue. Veuillez réessayer.",
      variant: "destructive",
    });
  };

  return { handleError };
};