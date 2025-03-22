
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useApiError } from "./useApiError";

export interface PageContent {
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
    description: "Centre d'appels professionnel en République du Congo",
    content: {
      sections: [
        {
          title: "Notre mission",
          content: "Fournir des services de centre d'appels de haute qualité qui optimisent l'expérience client."
        },
        {
          title: "Notre vision",
          content: "Devenir le leader des solutions de relation client en Afrique centrale."
        }
      ]
    }
  },
  'services': {
    title: "Nos services",
    description: "Découvrez notre gamme complète de services de centre d'appels et de relation client",
    content: {
      services: [
        {
          title: "Centre d'appels entrants",
          description: "Service client professionnel avec des agents formés",
          icon: "phone"
        },
        {
          title: "Télémarketing",
          description: "Ventes et prospection téléphonique efficaces",
          icon: "phone-outgoing"
        },
        {
          title: "Support technique",
          description: "Assistance technique multilingue",
          icon: "tool"
        },
        {
          title: "Service 24/7",
          description: "Support client disponible à tout moment",
          icon: "clock"
        }
      ]
    }
  },
  'contact': {
    title: "Contactez-nous",
    description: "Notre équipe est à votre écoute pour répondre à vos besoins",
    content: {
      office_address: "123 Avenue de la République, Brazzaville, Congo",
      phone: "+242 06 123 4567",
      email: "contact@topcenter.cg",
      hours: {
        weekdays: "9h - 18h",
        saturday: "10h - 15h",
        sunday: "Fermé"
      }
    }
  },
  'blog': {
    title: "Notre blog",
    description: "Articles et actualités sur les centres d'appels et la relation client",
    content: {
      featured: {
        title: "Les nouvelles technologies dans les centres d'appels",
        excerpt: "Découvrez comment l'IA transforme le service client moderne",
        image: "/lovable-uploads/staff-tce.jpg"
      },
      categories: ["Technologie", "Service client", "Formation", "Industrie"]
    }
  },
  'faq': {
    title: "Questions fréquemment posées",
    description: "Trouvez rapidement des réponses à vos questions sur nos services",
    content: {
      categories: ["Services", "Tarifs", "Support", "Technique"],
      questions: [
        {
          question: "Quels services proposez-vous ?",
          answer: "Nous proposons des services de centre d'appels, support client, télémarketing et solutions de téléphonie d'entreprise."
        },
        {
          question: "Comment demander un devis ?",
          answer: "Vous pouvez demander un devis en remplissant notre formulaire en ligne ou en nous contactant directement."
        },
        {
          question: "Proposez-vous des services en plusieurs langues ?",
          answer: "Oui, nos agents sont formés pour communiquer en français, anglais et langues locales selon vos besoins."
        }
      ]
    }
  }
};

export const usePageContent = (pageKey: string) => {
  const { handleError, isServerUnavailable } = useApiError();

  return useQuery({
    queryKey: ['page-content', pageKey],
    queryFn: async (): Promise<PageContent | null> => {
      try {
        // Si on sait déjà que le serveur est inaccessible, utiliser directement le fallback
        if (isServerUnavailable) {
          console.log(`Serveur indisponible, utilisation du contenu fallback pour ${pageKey}`);
          
          // Si un contenu fallback existe pour cette page, le convertir en objet PageContent
          if (fallbackContents[pageKey]) {
            return {
              id: `fallback-${pageKey}`,
              page_key: pageKey,
              title: fallbackContents[pageKey].title || `Page ${pageKey}`,
              description: fallbackContents[pageKey].description || null,
              content: fallbackContents[pageKey].content || {},
              meta_tags: fallbackContents[pageKey].meta_tags || {
                title: fallbackContents[pageKey].title || `Page ${pageKey}`,
                description: fallbackContents[pageKey].description || ""
              },
              is_active: true
            };
          }
          
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
        
        // Si un contenu fallback existe pour cette page, le retourner au lieu de propager l'erreur
        if (fallbackContents[pageKey]) {
          console.log(`Retour du contenu fallback pour ${pageKey} après erreur`);
          return {
            id: `fallback-${pageKey}`,
            page_key: pageKey,
            title: fallbackContents[pageKey].title || `Page ${pageKey}`,
            description: fallbackContents[pageKey].description || null,
            content: fallbackContents[pageKey].content || {},
            meta_tags: fallbackContents[pageKey].meta_tags || {
              title: fallbackContents[pageKey].title || `Page ${pageKey}`,
              description: fallbackContents[pageKey].description || ""
            },
            is_active: true
          };
        }
        
        // Si aucun fallback n'est disponible, propager l'erreur
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
