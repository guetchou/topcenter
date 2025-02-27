
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { EmblaCarouselType } from "embla-carousel-react";

const agents = [
  {
    name: "Gess NGUIE",
    role: "Manager Général",
    expertise: "Gestion de projet, CRM, Business Développement",
    image: "/lovable-uploads/gess.jpg",
    specialties: ["Gestion d'entreprise", "CRM & VOIP", "Business Développement"],
  },
  {
    name: "Myna BAYI",
    role: "Manager IT",
    expertise: "Manager Technique",
    image: "/lovable-uploads/bayimina.jpg",
    specialties: ["Réseaux & Télécom", "VOIP"],
  },
  {
    name: "Nidda KIKAME",
    role: "Chargée de Projet",
    expertise: "Service Client Premium",
    image: "/lovable-uploads/nidda_photo.jpeg",
    specialties: ["Gestion d'équipe", "Formation", "Support VIP"],
  },
  {
    name: "Caley BAYI",
    role: "Superviseur",
    expertise: "Support Technique",
    image: "/lovable-uploads/caley.png",
    specialties: ["Résolution de problèmes", "Coaching", "Analyse de données"],
  },
  {
    name: "Jeancia NANTI",
    role: "Responsable Formation",
    expertise: "Développement des compétences",
    image: "/lovable-uploads/jeancia.jpeg",
    specialties: ["Formation initiale", "Amélioration continue", "E-learning"],
  },
];

export const TeamSection = () => {
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
    <section
      className="py-16 bg-muted/30"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Notre Équipe d'Experts</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Des professionnels passionnés au service de votre satisfaction
          </p>
        </div>

        <Carousel
          setApi={setApi}
          opts={{ align: "start", loop: true }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent>
            {agents.map((agent, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Card className="shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="aspect-square mb-4 overflow-hidden rounded-full">
                        <img
                          src={agent.image}
                          alt={agent.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{agent.name}</h3>
                      <p className="text-primary font-medium mb-2">{agent.role}</p>
                      <p className="text-sm text-muted-foreground mb-4">{agent.expertise}</p>
                      <div className="flex flex-wrap gap-2">
                        {agent.specialties.map((specialty, i) => (
                          <Badge key={i} variant="secondary">
                            {specialty}
                          </Badge>
                        ))}
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
    </section>
  );
};
