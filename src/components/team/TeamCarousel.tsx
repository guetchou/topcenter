
import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { UseEmblaCarouselType } from "embla-carousel-react";
import type { TeamMember } from "@/hooks/useTeamMembers";
import { TeamMemberCard } from "./TeamMemberCard";
import { CarouselIndicators } from "./CarouselIndicators";

interface TeamCarouselProps {
  members: TeamMember[];
}

export const TeamCarousel = ({ members }: TeamCarouselProps) => {
  const [api, setApi] = useState<UseEmblaCarouselType[1] | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Setup the auto-rotation
  useEffect(() => {
    if (!api || isPaused || !members?.length) return;
    
    const intervalId = setInterval(() => {
      api.scrollNext();
    }, 5000); // 5 seconds for better user experience
    
    // Update current index when the carousel scrolls
    const onSelect = () => {
      if (!api) return;
      setCurrentIndex(api.selectedScrollSnap());
    };
    
    api.on('select', onSelect);
    
    return () => {
      clearInterval(intervalId);
      if (api) {
        api.off('select', onSelect);
      }
    };
  }, [api, isPaused, members]);

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {members && members.length > 0 && (
        <>
          <Carousel
            setApi={setApi}
            opts={{ 
              align: "start", 
              loop: true,
              dragFree: false
            }}
            className="w-full max-w-5xl mx-auto"
          >
            <CarouselContent>
              {members.map((member, index) => (
                <CarouselItem key={member.id || index} className="md:basis-1/2 lg:basis-1/3 pl-4">
                  <TeamMemberCard 
                    member={member} 
                    isActive={currentIndex === index} 
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <div className="absolute -left-4 md:-left-8 top-1/2 -translate-y-1/2 z-10">
              <CarouselPrevious className="bg-background/80 backdrop-blur-sm shadow-md" />
            </div>
            <div className="absolute -right-4 md:-right-8 top-1/2 -translate-y-1/2 z-10">
              <CarouselNext className="bg-background/80 backdrop-blur-sm shadow-md" />
            </div>
          </Carousel>
          
          {api && members.length > 0 && (
            <CarouselIndicators 
              totalItems={members.length} 
              currentIndex={currentIndex} 
              onSelect={(index) => api?.scrollTo(index)} 
            />
          )}
        </>
      )}
    </div>
  );
};

export default TeamCarousel;
