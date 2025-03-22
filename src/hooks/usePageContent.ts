
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import api from "@/services/api";
import { useApiError } from "./useApiError";

interface PageContent {
  id: string;
  page_key: string;
  title: string;
  description: string | null;
  content: Record<string, any>;
  meta_tags: {
    title: string;
    description: string;
  } | null;
  is_active: boolean;
}

export const usePageContent = (pageKey: string) => {
  const { handleError } = useApiError();

  return useQuery({
    queryKey: ['page-content', pageKey],
    queryFn: async (): Promise<PageContent | null> => {
      try {
        // Tentative de récupération des données depuis l'API
        const { data, error } = await supabase
          .from('page_contents')
          .select('*')
          .eq('page_key', pageKey)
          .single();

        if (error) {
          console.error(`Erreur lors de la récupération du contenu pour ${pageKey}:`, error);
          throw error;
        }
        
        // Cast the Json type to Record<string, any>
        return data ? {
          ...data,
          content: data.content as Record<string, any>,
          meta_tags: data.meta_tags as PageContent['meta_tags']
        } : null;
      } catch (error) {
        console.error(`Erreur dans usePageContent pour ${pageKey}:`, error);
        // Utiliser handleError pour standardiser la gestion des erreurs
        handleError(error as Error);
        throw error;
      }
    },
    retry: 1, // Limiter les tentatives de réessai
    retryDelay: 1000, // Délai entre les tentatives
  });
};
