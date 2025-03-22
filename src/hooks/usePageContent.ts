
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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

// Définition des contenus statiques de secours (fallback)
const fallbackContents: Record<string, Partial<PageContent>> = {
  'about': {
    title: "À propos de TopCenter",
    description: "Centre d'appels professionnel en République du Congo"
  },
  'services': {
    title: "Nos services",
    description: "Découvrez notre gamme complète de services de centre d'appels et de relation client"
  },
  'contact': {
    title: "Contactez-nous",
    description: "Notre équipe est à votre écoute pour répondre à vos besoins"
  }
};

export const usePageContent = (pageKey: string) => {
  const { handleError, isServerUnavailable } = useApiError();

  return useQuery({
    queryKey: ['page-content', pageKey],
    queryFn: async (): Promise<PageContent | null> => {
      try {
        // Si on sait déjà que le serveur est inaccessible, éviter la requête
        if (isServerUnavailable) {
          throw new Error('Le serveur est temporairement indisponible.');
        }

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
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    // Permet de récupérer les données depuis le cache en mode hors ligne
    structuralSharing: true,
  });
};
