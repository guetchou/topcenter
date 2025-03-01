
import { useState, useEffect, useCallback } from "react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import type { UseEmblaCarouselType } from "embla-carousel-react";

const partners = [
  {
    id: 1,
    name: "Congo Télécom",
    logo: "/lovable-uploads/Logo_Congotelecom.png",
    website: "https://www.congotelecom.cg"
  },
  {
    id: 2,
    name: "MTN",
    logo: "/lovable-uploads/Logo-MTN.png",
    website: "https://www.mtn.cg"
  },
  {
    id: 3,
    name: "Airtel",
    logo: "/lovable-uploads/logo-airtel.jpg",
    website: "https://www.airtel.cg"
  },
  {
    id: 4,
    name: "ACPCE",
    logo: "/lovable-uploads/acpce-logo.png",
    website: "https://www.acpce.cg"
  },
  {
    id: 5,
    name: "PSIPJ",
    logo: "/lovable-uploads/psipj-logo.jpg",
    website: "https://www.psipj.org"
  },
  {
    id: 6,
    name: "BLT",
    logo: "/lovable-uploads/Logo-BLT.gif",
    website: "https://www.blt.cg"
  },
  {
    id: 7,
    name: "Infomaniak",
    logo: "/lovable-uploads/logo-infomaniak.png",
    website: "https://www.infomaniak.com"
  }
];

export const PartnersSection = () => {
  const [api, setApi] = useState<UseEmblaCarouselType[1] | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const onSelect = useCallback(() => {
    if (!api) return;
    setActiveIndex(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    
    // Fixed: Added the second argument to api.on with proper callback
    api.on('select', onSelect);
    
    return () => {
      api.off('select', onSelect);
    };
  }, [api, onSelect]);

  useEffect(() => {
    if (!api || isPaused) return;
    
    const intervalId = setInterval(() => {
      api.scrollNext();
    }, 3000);
    
    return () => clearInterval(intervalId);
  }, [api, isPaused]);

  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">Ils nous font confiance</h2>
        
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
              {partners.map((partner) => (
                <CarouselItem key={partner.id} className="md:basis-1/3 lg:basis-1/4 pl-4">
                  <a 
                    href={partner.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block h-full"
                  >
                    <Card className="hover-lift h-full cursor-pointer transition-shadow hover:shadow-md">
                      <CardContent className="flex items-center justify-center p-6 h-full">
                        <img 
                          src={partner.logo} 
                          alt={partner.name} 
                          className="max-h-16 md:max-h-20 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300" 
                        />
                      </CardContent>
                    </Card>
                  </a>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <div className="hidden md:block absolute -left-4 top-1/2 transform -translate-y-1/2">
              <CarouselPrevious />
            </div>
            <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2">
              <CarouselNext />
            </div>
          </Carousel>
          
          <div className="flex justify-center mt-6 space-x-2">
            {partners.map((_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all ${
                  activeIndex === index ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"
                }`}
                onClick={() => api?.scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
