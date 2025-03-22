
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
import { ApiContentWrapper } from "@/components/ApiContentWrapper";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import type { UseEmblaCarouselType } from "embla-carousel-react";

export const TeamSection = () => {
  const [api, setApi] = useState<UseEmblaCarouselType[1] | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Récupération des membres de l'équipe depuis Supabase
  const { data: teamMembers, isLoading, error, refetch } = useTeamMembers();

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

        <ApiContentWrapper
          data={teamMembers}
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
          {(teamMembers) => (
            <Carousel
              setApi={setApi}
              opts={{ align: "start", loop: true }}
              className="w-full max-w-5xl mx-auto"
            >
              <CarouselContent>
                {teamMembers.map((member) => (
                  <CarouselItem key={member.id} className="md:basis-1/2 lg:basis-1/3">
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <Card className="shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                          <div className="aspect-square mb-4 overflow-hidden rounded-full">
                            <img
                              src={member.image}
                              alt={member.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder.svg';
                              }}
                            />
                          </div>
                          <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                          <p className="text-primary font-medium mb-2">{member.role}</p>
                          <p className="text-sm text-muted-foreground mb-4">{member.expertise}</p>
                          <div className="flex flex-wrap gap-2">
                            {member.specialties.map((specialty, i) => (
                              <Badge key={i} variant="secondary">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                          
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
              <div className="absolute -left-4 top-1/2 transform -translate-y-1/2">
                <CarouselPrevious />
              </div>
              <div className="absolute -right-4 top-1/2 transform -translate-y-1/2">
                <CarouselNext />
              </div>
            </Carousel>
          )}
        </ApiContentWrapper>
      </div>
    </section>
  );
};
