
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
    name: "Nidda KIKAME",
    role: "Chargée de Projet",
    expertise: "Service Client Premium",
    image: "public/lovable-uploads/nidda_photo.jpeg",
    specialties: ["Gestion d'équipe", "Formation", "Support VIP"]
  },
  {
    name: "Caley BAYI",
    role: "Superviseur",
    expertise: "Support Technique",
    image: "public/lovable-uploads/avatar-femme.jpg",
    specialties: ["Résolution de problèmes", "Coaching", "Analyse de données"]
  },
  {
    name: "Jeancia NANTI",
    role: "Responsable Formation",
    expertise: "Développement des compétences",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956",
    specialties: ["Formation initiale", "Amélioration continue", "E-learning"]
  },
  {
    name: "Julien ELENGA",
    role: "Expert Qualité",
    expertise: "Contrôle qualité",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7",
    specialties: ["Audit qualité", "Processus qualité", "Satisfaction client"]
  }
];

export const TeamSection = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Notre Équipe d'Experts</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Des professionnels passionnés au service de votre satisfaction
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent>
            {agents.map((agent, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <Card className="hover-lift">
                  <CardContent className="p-6">
                    <div className="aspect-square mb-4 overflow-hidden rounded-full">
                      <img
                        src={agent.image}
                        alt={agent.name}
                        className="w-full h-full object-cover"
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
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};
