
import { useOptimizedQuery } from "@/hooks/useOptimizedQuery";
import { supabase } from "@/integrations/supabase/client";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  expertise?: string;
  image: string;
  specialties: string[];
  email?: string;
  linkedin?: string;
  bio?: string;
  order?: number;
}

// Fallback data in case of server unavailability
const fallbackTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Gess NGUIE",
    role: "Manager Général",
    expertise: "Gestion de projet, CRM, Business Développement",
    image: "/lovable-uploads/gess.jpg",
    specialties: ["Gestion d'entreprise", "CRM & VOIP", "Business Développement"]
  },
  {
    id: "2",
    name: "Myna BAYI",
    role: "Manager IT",
    expertise: "Manager Technique",
    image: "/lovable-uploads/bayimina.jpg",
    specialties: ["Réseaux & Télécom", "VOIP"]
  },
  {
    id: "3",
    name: "Nidda KIKAME",
    role: "Chargée de Projet",
    expertise: "Service Client Premium",
    image: "/lovable-uploads/nidda_photo.jpeg",
    specialties: ["Gestion d'équipe", "Formation", "Support VIP"]
  },
  {
    id: "4",
    name: "Caley BAYI",
    role: "Superviseur",
    expertise: "Support Technique",
    image: "/lovable-uploads/caley.png",
    specialties: ["Résolution de problèmes", "Coaching", "Analyse de données"]
  },
  {
    id: "5",
    name: "Jeancia NANTI",
    role: "Responsable Formation",
    expertise: "Développement des compétences",
    image: "/lovable-uploads/jeancia.jpeg",
    specialties: ["Formation initiale", "Amélioration continue", "E-learning"]
  }
];

export const useTeamMembers = () => {
  return useOptimizedQuery({
    queryKey: ['team-members'],
    queryFn: async () => {
      try {
        // En cas d'erreur API, retourner immédiatement les données de secours
        if (!supabase) {
          console.log("Supabase client not available, using fallback data");
          return fallbackTeamMembers;
        }

        const { data, error } = await supabase
          .from('team_members')
          .select('*')
          .order('order', { ascending: true });
        
        if (error) {
          console.error("Erreur lors de la récupération des membres de l'équipe:", error);
          return fallbackTeamMembers;
        }
        
        // If no data is available, return fallback data
        return data && data.length > 0 ? data.map(member => ({
          ...member,
          specialties: member.specialties || []
        })) : fallbackTeamMembers;
      } catch (error) {
        console.error("Erreur useTeamMembers:", error);
        return fallbackTeamMembers;
      }
    },
    offlineData: fallbackTeamMembers,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    refetchOnWindowFocus: false
  });
};
