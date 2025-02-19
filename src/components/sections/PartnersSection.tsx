
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

const partners = [
  {
    name: "TechCorp Solutions",
    logo: "https://images.unsplash.com/photo-1487958449943-2429e8be8625",
    description: "Leader en solutions technologiques",
    type: "Technologie"
  },
  {
    name: "InnovGroup",
    logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab",
    description: "Innovation et développement digital",
    type: "Digital"
  },
  {
    name: "GlobalTech",
    logo: "https://images.unsplash.com/photo-1554469384-e58fac16e23a",
    description: "Services IT internationaux",
    type: "IT"
  },
  {
    name: "SmartSolutions",
    logo: "https://images.unsplash.com/photo-1497366216548-37526070297c",
    description: "Solutions intelligentes pour entreprises",
    type: "Solutions"
  },
  {
    name: "DataPro",
    logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab",
    description: "Expert en analyse de données",
    type: "Data"
  }
];

export const PartnersSection = () => {
  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Nos Partenaires</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Collaborons avec les meilleurs pour vous offrir un service d'excellence
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
            {partners.map((partner, index) => (
              <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/4">
                <Card className="hover-lift h-full">
                  <CardContent className="p-6">
                    <div className="aspect-video mb-4 overflow-hidden rounded-lg bg-muted/30">
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{partner.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {partner.description}
                    </p>
                    <span className="text-xs text-primary font-medium">
                      {partner.type}
                    </span>
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
