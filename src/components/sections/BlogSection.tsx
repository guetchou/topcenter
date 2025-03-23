
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BlogPost } from "@/types/blog";
import { BlogCarousel } from "./blog/BlogCarousel";

export const BlogSection = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('blog_posts')
          .select('id, title, excerpt, content, created_at, featured_image_url, category, status, author_id, published_at, updated_at, slug')
          .eq('status', 'published')
          .order('created_at', { ascending: false })
          .limit(6);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          setArticles(data as BlogPost[]);
        } else {
          // Sample data as fallback when no database entries exist
          setArticles([
            {
              id: '1',
              title: 'Innovation dans les centres d\'appels: L\'IA au service du client',
              excerpt: 'Découvrez comment l\'intelligence artificielle transforme l\'expérience client dans les centres d\'appels modernes.',
              content: 'Les centres d\'appels évoluent rapidement avec l\'adoption de technologies d\'intelligence artificielle...',
              status: 'published',
              category: 'Technologie',
              featured_image_url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
              author_id: '1',
              created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              updated_at: new Date().toISOString(),
              published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              slug: 'innovation-centres-appels-ia',
            },
            {
              id: '2',
              title: 'Améliorer la satisfaction client: 5 stratégies efficaces',
              excerpt: 'Apprenez à augmenter la satisfaction de vos clients grâce à des approches innovantes et éprouvées.',
              content: 'La satisfaction client est au cœur de toute entreprise prospère. Dans cet article...',
              status: 'published',
              category: 'Service Client',
              featured_image_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d',
              author_id: '2',
              created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
              updated_at: new Date().toISOString(),
              published_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
              slug: 'ameliorer-satisfaction-client-strategies',
            },
            {
              id: '3',
              title: 'TopCenter ouvre un nouveau centre à Pointe-Noire',
              excerpt: 'Notre entreprise continue de s\'étendre avec l\'ouverture d\'un nouveau centre à Pointe-Noire.',
              content: 'Nous sommes heureux d\'annoncer l\'ouverture de notre nouveau centre d\'appels à Pointe-Noire...',
              status: 'published',
              category: 'Entreprise',
              featured_image_url: '/lovable-uploads/staff-tce.jpg',
              author_id: '1',
              created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
              updated_at: new Date().toISOString(),
              published_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
              slug: 'topcenter-nouveau-centre-pointe-noire',
            }
          ]);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des articles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Format date helper function
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <section className="py-16 bg-accent/5">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-4">Blog & Actualités</h2>
            <p className="text-muted-foreground">
              Restez informé des dernières tendances et innovations
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/blog")}>
            Voir tous les articles
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        <BlogCarousel 
          articles={articles}
          isLoading={isLoading}
          formatDate={formatDate}
        />
      </div>
    </section>
  );
};
