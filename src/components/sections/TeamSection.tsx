
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
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
import { Button } from "@/components/ui/button";
import { ApiContentWrapper } from "@/components/ApiContentWrapper";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import type { UseEmblaCarouselType } from "embla-carousel-react";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { ChevronRight } from "lucide-react";

export const TeamSection = () => {
  const [api, setApi] = useState<UseEmblaCarouselType[1] | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Récupération des membres de l'équipe depuis Supabase
  const { data: teamMembers, isLoading, error, refetch } = useTeamMembers();

  // Setup the auto-rotation
  useEffect(() => {
    if (!api || isPaused || !teamMembers?.length) return;
    
    const intervalId = setInterval(() => {
      api.scrollNext();
    }, 5000); // Increased time to 5 seconds for better user experience
    
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
  }, [api, isPaused, teamMembers]);

  // Make a memoized version of the team members to avoid unnecessary re-renders
  const processedTeamMembers = useMemo(() => {
    if (!teamMembers || teamMembers.length === 0) return [];
    
    return teamMembers.map(member => ({
      ...member,
      // Ensure specialties is always an array
      specialties: Array.isArray(member.specialties) ? member.specialties : [],
      // Ensure there's always an image
      image: member.image || '/placeholder.svg'
    }));
  }, [teamMembers]);

  return (
    <section
      id="equipe"
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

        <ApiContentWrapper
          data={processedTeamMembers}
          isLoading={isLoading}
          error={error}
          refetch={refetch}
          emptyMessage="Aucun membre d'équipe disponible pour le moment."
          loadingFallback={
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="shadow-lg animate-pulse">
                  <CardContent className="p-6">
                    <div className="aspect-square mb-4 rounded-full bg-muted"></div>
                    <div className="h-6 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-2/3 mb-4"></div>
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3].map((j) => (
                        <div key={j} className="h-6 bg-muted rounded w-20"></div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          }
          fallback={<div className="text-center text-muted-foreground">Aucune information sur l'équipe disponible.</div>}
        >
          {(members) => (
            <div className="relative">
              {members && members.length > 0 ? (
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
                          <motion.div 
                            whileHover={{ scale: 1.03 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ 
                              opacity: 1, 
                              y: 0,
                              transition: { delay: index * 0.1, duration: 0.3 } 
                            }}
                          >
                            <Card className={`shadow-lg hover:shadow-xl transition-all duration-300 h-full ${currentIndex === index ? 'ring-2 ring-primary/30' : ''}`}>
                              <CardContent className="p-6">
                                <div className="aspect-square mb-4 overflow-hidden rounded-full">
                                  <ResponsiveImage
                                    src={member.image || '/placeholder.svg'}
                                    alt={member.name || 'Team member'}
                                    aspectRatio="1/1"
                                    objectFit="cover"
                                    fallback="/placeholder.svg"
                                  />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{member.name || 'Team Member'}</h3>
                                {member.role && (
                                  <p className="text-primary font-medium mb-2">{member.role}</p>
                                )}
                                {member.expertise && (
                                  <p className="text-sm text-muted-foreground mb-4">{member.expertise}</p>
                                )}
                                
                                {member.specialties && member.specialties.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {member.specialties.map((specialty, i) => (
                                      <Badge key={i} variant="secondary">
                                        {specialty}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                                
                                {member.email && (
                                  <div className="mt-4 text-sm">
                                    <a 
                                      href={`mailto:${member.email}`}
                                      className="text-primary hover:underline"
                                    >
                                      {member.email}
                                    </a>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </motion.div>
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
                  
                  {/* Indicators - Only show if we have team members */}
                  {api && members.length > 0 && (
                    <div className="flex justify-center gap-2 mt-6">
                      {members.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => api?.scrollTo(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentIndex ? 'bg-primary w-6' : 'bg-primary/30'
                          }`}
                          aria-label={`Voir le membre d'équipe ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-8 text-center">
                    <Button asChild variant="outline" className="group">
                      <Link to="/equipe">
                        Découvrir toute l'équipe
                        <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun membre d'équipe disponible pour le moment.
                </div>
              )}
            </div>
          )}
        </ApiContentWrapper>
      </div>
    </section>
  );
};
