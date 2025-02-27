
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const partners = [
  {
    name: "Congo Télécom",
    logo: "/lovable-uploads/Logo_CongoTélécom-transformed (1).png",
    industry: "Télécommunications"
  },
  {
    name: "GESS Solutions",
    logo: "/lovable-uploads/gess.jpg",
    industry: "Technologie"
  },
  {
    name: "Matoko Solutions",
    logo: "/lovable-uploads/matoko.png",
    industry: "Services informatiques"
  },
  {
    name: "Télécom Solutions",
    logo: "/lovable-uploads/Learning-VoIP-Effecti.jpg",
    industry: "Communications"
  },
  {
    name: "Staff TCE",
    logo: "/lovable-uploads/staff-tce.jpg",
    industry: "Ressources humaines"
  }
];

export const PartnersSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Nos Partenaires</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Des entreprises de confiance qui font confiance à notre expertise
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
              <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/4 pl-4">
                <div className="p-6 text-center hover-lift bg-background border rounded-lg h-full flex flex-col items-center justify-center">
                  <div className="h-24 w-full flex items-center justify-center mb-4">
                    <img
                      src={partner.logo}
                      alt={`${partner.name} logo`}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <h3 className="font-medium text-lg">{partner.name}</h3>
                  <p className="text-sm text-muted-foreground">{partner.industry}</p>
                </div>
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
