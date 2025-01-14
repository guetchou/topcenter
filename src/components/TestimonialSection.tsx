import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export const TestimonialSection = () => {
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching testimonials:", error);
        throw error;
      }

      return data;
    }
  });

  if (isLoading) {
    return (
      <section className="py-20 bg-secondary/5">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Ce que disent nos clients</h2>
            <p className="text-muted-foreground">
              Découvrez les témoignages de nos clients satisfaits
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[250px] w-full" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-secondary/5">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Ce que disent nos clients</h2>
          <p className="text-muted-foreground">
            Découvrez les témoignages de nos clients satisfaits
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials?.map((testimonial) => (
            <Card key={testimonial.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="mb-4 text-muted-foreground">{testimonial.content}</p>
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.role} {testimonial.company ? `- ${testimonial.company}` : ''}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};