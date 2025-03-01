
import { useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { UseEmblaCarouselType } from "embla-carousel-react";

const articles = [
  {
    id: 1,
    title: "Comment l'IA transforme les centres d'appels en 2024",
    excerpt: "Découvrez les technologies d'IA qui révolutionnent l'expérience client et améliorent l'efficacité des centres d'appels modernes.",
    date: "2024-06-15",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7"
  },
  {
    id: 2,
    title: "Les 5 meilleures pratiques pour une satisfaction client exceptionnelle",
    excerpt: "Quelles sont les stratégies qui font vraiment la différence? Découvrez comment les meilleurs centres d'appels atteignent 98% de satisfaction.",
    date: "2024-06-10",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c"
  },
  {
    id: 3,
    title: "Omnicanalité: Pourquoi c'est essentiel pour votre entreprise",
    excerpt: "L'approche omnicanale n'est plus optionnelle. Apprenez comment l'intégrer efficacement dans votre stratégie de relation client.",
    date: "2024-06-05",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978"
  },
  {
    id: 4,
    title: "Management à distance: Guide complet pour les centres d'appels",
    excerpt: "La gestion d'équipes délocalisées présente des défis uniques. Voici les solutions que Top Center a développées avec succès.",
    date: "2024-06-01",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf"
  }
];

export const BlogSection = () => {
  const navigate = useNavigate();
  const [api, setApi] = useState<UseEmblaCarouselType[1] | null>(null);
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
                  <Card className="hover-lift cursor-pointer h-full group" onClick={() => navigate(`/blog/${article.id}`)}>
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
                      <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">{article.title}</CardTitle>
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
