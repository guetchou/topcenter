import { useEffect, useState } from "react";
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

const agents = [
  {
    name: "Gess NGUIE",
    role: "Manager Général",
    expertise: "Gestion de projet, CRM, Business Développement",
    image: "public/lovable-uploads/gess.jpg",
    specialties: ["Gestion d'entreprise", "CRM & VOIP", "Business Développement"],
  },
  {
    name: "Myna BAYI",
    role: "Manager IT",
    expertise: "Manager Technique",
    image: "public/lovable-uploads/bayimina.jpg",
    specialties: ["Réseaux & Télécom", "VOIP"],
  },
  {
    name: "Nidda KIKAME",
    role: "Chargée de Projet",
    expertise: "Service Client Premium",
    image: "public/lovable-uploads/nidda_photo.jpeg",
    specialties: ["Gestion d'équipe", "Formation", "Support VIP"],
  },
  {
    name: "Caley BAYI",
    role: "Superviseur",
    expertise: "Support Technique",
    image: "public/lovable-uploads/caley.png",
    specialties: ["Résolution de problèmes", "Coaching", "Analyse de données"],
  },
  {
    name: "Jeancia NANTI",
    role: "Responsable Formation",
    expertise: "Développement des compétences",
    image: "public/lovable-uploads/jeancia.jpeg",
    specialties: ["Formation initiale", "Amélioration continue", "E-learning"],
  },
];

export const TeamSection = () => {
  const [autoSlide, setAutoSlide] = useState(true);

  useEffect(() => {
    if (!autoSlide) return;
    const interval = setInterval(() => {
      document.querySelector("[data-carousel-next]")?.click();
    }, 4000);
    return () => clearInterval(interval);
  }, [autoSlide]);

  return (
    <section
      className="py-16 bg-muted/30"
      onMouseEnter={() => setAutoSlide(false)}
      onMouseLeave={() => setAutoSlide(true)}
    >
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Notre Équipe d'Experts</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Des professionnels passionnés au service de votre satisfaction
          </p>
        </div>

        <Carousel
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
          <CarouselPrevious data-carousel-prev />
          <CarouselNext data-carousel-next />
        </Carousel>
      </div>
    </section>
  );
};
