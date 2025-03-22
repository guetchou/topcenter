
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { ApiContentWrapper } from "@/components/ApiContentWrapper";
import { useTestimonials } from "@/hooks/useTestimonials";
import { AnimationWrapper } from "./AnimationWrapper";

export const TestimonialSection = () => {
  const { data: testimonials, isLoading, error, refetch } = useTestimonials();

  return (
    <section className="py-20 bg-secondary/5">
      <div className="container">
        <AnimationWrapper type="fade-in-bottom" duration={600}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Ce que disent nos clients</h2>
            <p className="text-muted-foreground">
              Découvrez les témoignages de nos clients satisfaits
            </p>
          </div>
        </AnimationWrapper>

        <ApiContentWrapper
          data={testimonials}
          isLoading={isLoading}
          error={error}
          refetch={refetch}
          emptyMessage="Aucun témoignage n'est disponible pour le moment."
          loadingFallback={
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6 animate-pulse">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-muted" />
                    ))}
                  </div>
                  <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-muted rounded w-full mb-2"></div>
                  <div className="h-4 bg-muted rounded w-full mb-2"></div>
                  <div className="h-4 bg-muted rounded w-2/3 mb-6"></div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-muted mr-3"></div>
                    <div>
                      <div className="h-4 bg-muted rounded w-24 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-32"></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          }
          fallback={<div className="text-center text-muted-foreground">Aucun témoignage disponible.</div>}
        >
          {(testimonials) => (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <AnimationWrapper
                  key={testimonial.id}
                  type="fade-in" 
                  delay={index * 100}
                  duration={500}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow h-full flex flex-col">
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-5 h-5 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`} 
                        />
                      ))}
                    </div>
                    
                    <p className="mb-6 text-muted-foreground flex-grow">{testimonial.content}</p>
                    
                    <div className="flex items-center">
                      {testimonial.avatar_url ? (
                        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                          <img 
                            src={testimonial.avatar_url} 
                            alt={testimonial.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder.svg';
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                          <span className="text-primary font-medium">
                            {testimonial.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role} {testimonial.company ? `- ${testimonial.company}` : ''}
                        </p>
                      </div>
                    </div>
                  </Card>
                </AnimationWrapper>
              ))}
            </div>
          )}
        </ApiContentWrapper>
      </div>
    </section>
  );
};
