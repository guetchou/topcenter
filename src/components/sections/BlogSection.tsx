
import { useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { UseEmblaCarouselType } from "embla-carousel-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { BlogPost } from "@/types/blog";

export const BlogSection = () => {
  const navigate = useNavigate();
  const [api, setApi] = useState<UseEmblaCarouselType[1] | null>(null);
  const [isPaused, setIsPaused] = useState(false);
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
          .limit(4);
          
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

  useEffect(() => {
    if (!api || isPaused) return;
    
    const intervalId = setInterval(() => {
      api.scrollNext();
    }, 4000);
    
    return () => clearInterval(intervalId);
  }, [api, isPaused]);

  // Format date helper function
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <section className="py-16">
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

        <div 
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-5xl mx-auto"
          >
            <CarouselContent>
              {isLoading ? (
                // Skeletons pendant le chargement
                Array(3).fill(0).map((_, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 pl-4">
                    <Card className="h-full">
                      <div className="h-48 bg-muted rounded-t-lg"></div>
                      <CardHeader>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-6 w-full" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-2/3" />
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))
              ) : (
                articles.map((article) => (
                  <CarouselItem key={article.id} className="md:basis-1/2 lg:basis-1/3 pl-4">
                    <Card className="hover-lift cursor-pointer h-full group" onClick={() => navigate(`/blog/${article.id}`)}>
                      <div className="relative h-48 overflow-hidden rounded-t-lg">
                        <img
                          src={article.featured_image_url || "/placeholder.svg"}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <CardHeader>
                        <div className="flex items-center text-sm text-muted-foreground mb-2">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatDate(article.created_at)}
                        </div>
                        <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">{article.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground line-clamp-3">{article.excerpt || ''}</p>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))
              )}
            </CarouselContent>
            <div className="absolute -left-4 top-1/2 transform -translate-y-1/2">
              <CarouselPrevious />
            </div>
            <div className="absolute -right-4 top-1/2 transform -translate-y-1/2">
              <CarouselNext />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};
