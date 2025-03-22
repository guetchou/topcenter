
import { useOptimizedQuery } from "@/hooks/useOptimizedQuery";
import { supabase } from "@/integrations/supabase/client";

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  content: string;
  rating: number;
  avatar_url?: string;
  date?: string;
}

// Fallback testimonials in case of server unavailability
const fallbackTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "Anne Mantsounga",
    role: "Directrice",
    company: "Télécoms Congo",
    content: "TopCenter a révolutionné notre service client. Depuis que nous travaillons avec eux, nos taux de satisfaction ont augmenté de 35%. Une équipe vraiment professionnelle et efficace.",
    rating: 5,
    avatar_url: "/lovable-uploads/avatar-femme2.png"
  },
  {
    id: "2",
    name: "Patrick Ndoki",
    role: "PDG",
    company: "Mokabi Technologies",
    content: "La réactivité et le professionnalisme des agents de TopCenter sont exceptionnels. Ils ont su s'adapter parfaitement à nos besoins spécifiques et ont dépassé nos attentes.",
    rating: 5,
    avatar_url: "/lovable-uploads/avatar_homme.png"
  },
  {
    id: "3",
    name: "Carine Maboulou",
    role: "Responsable Marketing",
    company: "SoluxTech",
    content: "Nous avons confié notre service client à TopCenter il y a 2 ans et c'est la meilleure décision que nous ayons prise. Leur approche personnalisée et leur utilisation de l'IA ont transformé notre relation client.",
    rating: 4,
    avatar_url: "/lovable-uploads/avatar-femme5.jpg"
  }
];

export const useTestimonials = () => {
  return useOptimizedQuery(
    ['testimonials'],
    async () => {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .order('rating', { ascending: false })
          .limit(10);
        
        if (error) {
          console.error("Erreur lors de la récupération des témoignages:", error);
          throw error;
        }
        
        return data.length > 0 ? data : fallbackTestimonials;
      } catch (error) {
        console.error("Erreur useTestimonials:", error);
        return fallbackTestimonials;
      }
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true
    }
  );
};
