
import { useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { EmblaCarouselType } from "embla-carousel-react";

const articles = [
  {
    id: 1,
    title: "L'IA révolutionne les centres d'appels",
    excerpt: "Découvrez comment l'intelligence artificielle transforme l'expérience client dans les centres d'appels modernes.",
    date: "2024-03-15",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7"
  },
  {
    id: 2,
    title: "Optimiser la satisfaction client",
    excerpt: "Les meilleures pratiques pour améliorer la satisfaction client dans votre centre d'appels.",
    date: "2024-03-10",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c"
  },
  {
    id: 3,
    title: "Le futur de la relation client",
    excerpt: "Les tendances émergentes qui façonnent l'avenir du service client et des centres d'appels.",
    date: "2024-03-05",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978"
  },
  {
    id: 4,
    title: "Gérer efficacement une équipe à distance",
    excerpt: "Comment manager efficacement une équipe de téléconseillers travaillant à distance.",
    date: "2024-03-01",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf"
  }
];

export const BlogSection = () => {
  const navigate = useNavigate();
  const [api, setApi] = useState<EmblaCarouselType | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!api || isPaused) return;
    
    const intervalId = setInterval(() => {
      api.scrollNext();
    }, 4000);
    
    return () => clearInterval(intervalId);
  }, [api, isPaused]);

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
              {articles.map((article) => (
                <CarouselItem key={article.id} className="md:basis-1/2 lg:basis-1/3 pl-4">
                  <Card className="hover-lift cursor-pointer h-full" onClick={() => navigate(`/blog/${article.id}`)}>
                    <div className="relative h-48">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(article.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </div>
                      <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground line-clamp-3">{article.excerpt}</p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
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
