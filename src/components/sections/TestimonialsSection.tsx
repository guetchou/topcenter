
import { useState, useEffect } from "react";
import { StarIcon } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import type { EmblaCarouselType } from "embla-carousel-react";

const testimonials = [
  {
    text: "TopCenter a révolutionné notre service client. Depuis que nous travaillons avec eux, nos taux de satisfaction ont augmenté de 35%. Une équipe vraiment professionnelle et efficace.",
    author: "Anne Mantsounga",
    position: "Directrice, Télécoms Congo",
    avatar: "/lovable-uploads/avatar-femme2.png",
    rating: 5
  },
  {
    text: "La réactivité et le professionnalisme des agents de TopCenter sont exceptionnels. Ils ont su s'adapter parfaitement à nos besoins spécifiques et ont dépassé nos attentes.",
    author: "Patrick Ndoki",
    position: "PDG, Mokabi Technologies",
    avatar: "/lovable-uploads/avatar_homme.png",
    rating: 5
  },
  {
    text: "Nous avons confié notre service client à TopCenter il y a 2 ans et c'est la meilleure décision que nous ayons prise. Leur approche personnalisée et leur utilisation de l'IA ont transformé notre relation client.",
    author: "Carine Maboulou",
    position: "Responsable Marketing, SoluxTech",
    avatar: "/lovable-uploads/avatar-femme5.jpg",
    rating: 4
  }
];

export const TestimonialsSection = () => {
  const [api, setApi] = useState<EmblaCarouselType | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!api || isPaused) return;
    
    const intervalId = setInterval(() => {
      api.scrollNext();
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, [api, isPaused]);

  return (
    <section className="py-16 bg-primary/5">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Ce que nos clients disent</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez l'impact de nos services sur la satisfaction client
          </p>
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
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 pl-4">
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Card className="h-full hover-lift border-primary/10 shadow-lg">
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="flex mb-4">
                          {Array(5).fill(0).map((_, i) => (
                            <StarIcon 
                              key={i} 
                              className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted'}`} 
                            />
                          ))}
                        </div>
                        <blockquote className="text-muted-foreground mb-6 flex-grow">
                          "{testimonial.text}"
                        </blockquote>
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                            <AvatarFallback>{testimonial.author.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-sm">{testimonial.author}</p>
                            <p className="text-xs text-muted-foreground">{testimonial.position}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
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
