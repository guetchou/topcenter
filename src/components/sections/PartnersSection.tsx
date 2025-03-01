
import { useEffect, useRef, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import type { UseEmblaCarouselType } from "embla-carousel-react";

const partners = [
  {
    name: "Congo Télécom",
    logo: "/lovable-uploads/Logo_CongoTélécom-transformed (1).png",
    industry: "Télécommunications"
  },
  {
    name: "astTECS",
    logo: "/lovable-uploads/Logo-Asttect.gif",
    industry: "Technologie"
  },
  {
    name: "BL Technology",
    logo: "/lovable-uploads/Logo-BLT.gif",
    industry: "Services informatiques"
  },
  {
    name: "MTN Congo",
    logo: "/lovable-uploads/Logo-MTN.png",
    industry: "Télécommunications"
  },
  {
    name: "PSIPJ",
    logo: "/lovable-uploads/psipj-logo.jpg",
    industry: "Social"
  },
  {
    name: "Infomaniak",
    logo: "/lovable-uploads/logo-infomaniak.png",
    industry: "Technologie"
  },
  {
    name: "ACPCE",
    logo: "/lovable-uploads/acpce-logo.png",
    industry: "Agence Gouvernementale"
  },
  {
    name: "ACPE",
    logo: "/lovable-uploads/acpe-logo.png",
    industry: "Agence Gouvernementale"
  },
  {
    name: "Airtel Congo",
    logo: "/lovable-uploads/logo-airtel.jpg",
    industry: "Télécom"
  }
];

export const PartnersSection = () => {
  const [api, setApi] = useState<UseEmblaCarouselType[1] | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const autoPlayInterval = useRef<number | null>(null);

  // Mise à jour de l'index actif lorsque le carrousel change
  useEffect(() => {
    if (!api) return;
    
    // Fixed: Added the second argument to api.on with proper callback
    api.on('select', () => {
      setActiveIndex(api.selectedScrollSnap());
    });
    
    return () => {
      api.off('select');
    };
  }, [api]);

  // Fonction pour démarrer l'autoplay
  const startAutoplay = () => {
    if (autoPlayInterval.current !== null) return;
    
    autoPlayInterval.current = window.setInterval(() => {
      if (api && !isPaused) {
        api.scrollNext();
      }
    }, 3000);
  };

  // Fonction pour arrêter l'autoplay
  const stopAutoplay = () => {
    if (autoPlayInterval.current !== null) {
      window.clearInterval(autoPlayInterval.current);
      autoPlayInterval.current = null;
    }
  };

  // Démarrer l'autoplay quand l'API est prête
  useEffect(() => {
    if (!api) return;
    startAutoplay();
    
    return () => {
      stopAutoplay();
    };
  }, [api, isPaused]);

  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Nos Partenaires</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Des entreprises de confiance qui font confiance à notre expertise
          </p>
        </div>

        <div 
          className="relative group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <Carousel
            setApi={setApi}
            opts={{ 
              align: "start", 
              loop: true,
            }}
            className="w-full max-w-5xl mx-auto overflow-hidden"
          >
            <CarouselContent>
              {partners.map((partner, index) => (
                <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/4 pl-4">
                  <div 
                    className={`p-6 text-center transition-all duration-300 transform hover:scale-105 bg-white shadow-lg rounded-lg h-full flex flex-col items-center justify-center ${activeIndex === index ? 'ring-2 ring-primary/50' : ''}`}
                  >
                    <div className="h-24 w-full flex items-center justify-center mb-4">
                      <img src={partner.logo} alt={`${partner.name} logo`} className="max-h-24 max-w-full object-contain" />
                    </div>
                    <h3 className="font-medium text-lg">{partner.name}</h3>
                    <p className="text-sm text-muted-foreground">{partner.industry}</p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <CarouselPrevious onClick={() => setIsPaused(true)} />
            </div>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <CarouselNext onClick={() => setIsPaused(true)} />
            </div>
          </Carousel>
          
          {/* Indicateurs de slides */}
          <div className="flex justify-center mt-4 gap-2">
            {partners.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (api) {
                    api.scrollTo(index);
                    setIsPaused(true);
                    setTimeout(() => setIsPaused(false), 5000);
                  }
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  activeIndex === index ? 'bg-primary w-4' : 'bg-gray-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
