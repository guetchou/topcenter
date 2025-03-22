
import React, { useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { Skeleton } from "@/components/ui/skeleton";
import { BlogPost } from "@/types/blog";
import type { UseEmblaCarouselType } from "embla-carousel-react";

interface BlogCarouselProps {
  articles: BlogPost[];
  isLoading: boolean;
  formatDate: (date: string) => string;
}

export const BlogCarousel: React.FC<BlogCarouselProps> = ({ 
  articles, 
  isLoading,
  formatDate 
}) => {
  const [api, setApi] = useState<UseEmblaCarouselType[1] | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  
  // Setup auto-scroll effect
  useEffect(() => {
    if (!api || isPaused || isLoading) return;
    
    const intervalId = setInterval(() => {
      api.scrollNext();
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, [api, isPaused, isLoading]);

  return (
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
          {isLoading ? (
            // Skeletons pendant le chargement
            Array(3).fill(0).map((_, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 pl-4">
                <Skeleton className="h-[450px] w-full" />
              </CarouselItem>
            ))
          ) : (
            articles.map((article) => (
              <CarouselItem key={article.id} className="md:basis-1/2 lg:basis-1/3 pl-4">
                <BlogPostCard 
                  article={article} 
                  formatDate={formatDate} 
                />
              </CarouselItem>
            ))
          )}
        </CarouselContent>
        <div className="absolute -left-4 top-1/2 transform -translate-y-1/2">
          <CarouselPrevious />
        </div>
        <div className="absolute -right-4 top-1/2 transform -translate-y-1/2">
          <CarouselNext />
        </div>
      </Carousel>
    </div>
  );
};
