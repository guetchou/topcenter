
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

// Liste des partenaires (préchargée pour éviter les problèmes de performance)
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
  const [isLoaded, setIsLoaded] = useState(false);

  const onSelect = useCallback(() => {
    if (!api) return;
    setActiveIndex(api.selectedScrollSnap());
  }, [api]);

  // Configuration optimisée du carousel
  useEffect(() => {
    if (!api) return;
    
    api.on('select', onSelect);
    
    // Marquer comme chargé après l'initialisation
    setIsLoaded(true);
    
    return () => {
      api.off('select', onSelect);
    };
  }, [api, onSelect]);

  // Gestion de l'autoplay avec moins de re-rendus
  useEffect(() => {
    if (!api || isPaused || !isLoaded) return;
    
    const intervalId = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 3000);
    
    return () => clearInterval(intervalId);
  }, [api, isPaused, isLoaded]);

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
              skipSnaps: false,
              dragFree: false
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
                          loading="lazy"
                          onError={(e) => {
                            // Fallback en cas d'erreur de chargement d'image
                            e.currentTarget.src = '/placeholder.svg';
                          }}
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
          
          {/* Indicateurs optimisés */}
          <div className="flex justify-center mt-6 space-x-2">
            {partners.slice(0, 7).map((_, index) => (
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
