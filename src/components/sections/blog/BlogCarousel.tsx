
import React, { useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { Skeleton } from "@/components/ui/skeleton";
import { BlogPost } from "@/types/blog";
import type { UseEmblaCarouselType } from "embla-carousel-react";
import { cn } from "@/lib/utils";

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
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Update active index when slide changes
  useEffect(() => {
    if (!api) return;
    
    const onSelect = () => {
      setActiveIndex(api.selectedScrollSnap());
    };
    
    api.on('select', onSelect);
    return () => {
      api.off('select', onSelect);
    };
  }, [api]);
  
  // Setup auto-scroll effect
  useEffect(() => {
    if (!api || isPaused || isLoading) return;
    
    const intervalId = setInterval(() => {
      api.scrollNext();
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, [api, isPaused, isLoading]);

  // If no real articles, use placeholders
  const displayArticles = articles.length > 0 ? articles : Array(3).fill({
    id: '0',
    title: 'Chargement des articles...',
    excerpt: 'Contenu en cours de chargement',
    content: 'Contenu en cours de chargement',
    created_at: new Date().toISOString(),
    status: 'published' as const,
    category: 'Actualité',
    featured_image_url: '/lovable-uploads/staff-tce.jpg',
    author_id: '0',
    published_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    slug: 'loading'
  });

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
            // Skeletons during loading
            Array(3).fill(0).map((_, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 pl-4">
                <Skeleton className="h-[450px] w-full rounded-lg" />
              </CarouselItem>
            ))
          ) : (
            displayArticles.map((article, index) => (
              <CarouselItem 
                key={article.id || index} 
                className={cn(
                  "md:basis-1/2 lg:basis-1/3 pl-4 transition-opacity duration-300",
                  activeIndex === index ? "opacity-100" : "opacity-80"
                )}
              >
                <div className={cn(
                  "h-full transform transition-transform duration-500",
                  activeIndex === index && "animate-pop-in"
                )}>
                  <BlogPostCard 
                    article={article} 
                    formatDate={formatDate} 
                  />
                </div>
              </CarouselItem>
            ))
          )}
        </CarouselContent>
        <div className="absolute -left-4 top-1/2 transform -translate-y-1/2">
          <CarouselPrevious className="bg-background/80 backdrop-blur-sm hover:bg-background" />
        </div>
        <div className="absolute -right-4 top-1/2 transform -translate-y-1/2">
          <CarouselNext className="bg-background/80 backdrop-blur-sm hover:bg-background" />
        </div>
      </Carousel>

      {/* Indicators */}
      {!isLoading && displayArticles.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {displayArticles.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                index === activeIndex ? "bg-primary w-6" : "bg-primary/30"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
