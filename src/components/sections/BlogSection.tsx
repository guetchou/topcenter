
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
          .select('id, title, excerpt, created_at, featured_image_url, category')
          .eq('status', 'published')
          .order('created_at', { ascending: false })
          .limit(6);
          
        if (error) throw error;
        
        if (data) {
          setArticles(data as BlogPost[]);
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
        <div className="flex justify-between items-center mb-12">
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
