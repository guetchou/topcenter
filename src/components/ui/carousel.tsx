
"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";

import { 
  CarouselContext, 
  CarouselContextProps, 
  CarouselProps, 
  useCarousel 
} from "./carousel/CarouselContext";

import {
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from "./carousel/CarouselComponents";

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins
    );
    
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    const onSelect = React.useCallback((api: ReturnType<typeof useEmblaCarousel>[1]) => {
      if (!api) return;

      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    }, []);

    React.useEffect(() => {
      if (!api) return;

      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
      
      api.on("select", onSelect);
      
      if (setApi) {
        setApi(api);
      }

      return () => {
        api.off("select", onSelect);
      };
    }, [api, setApi, onSelect]);

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev();
    }, [api]);

    const scrollNext = React.useCallback(() => {
      api?.scrollNext();
    }, [api]);

    const carouselContext: CarouselContextProps = React.useMemo(() => ({
      carouselRef,
      api,
      opts,
      orientation,
      scrollPrev,
      scrollNext,
      canScrollPrev,
      canScrollNext,
    }), [
      carouselRef,
      api,
      opts,
      orientation,
      scrollPrev, 
      scrollNext,
      canScrollPrev,
      canScrollNext,
    ]);

    return (
      <CarouselContext.Provider value={carouselContext}>
        <div
          ref={ref}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  }
);
Carousel.displayName = "Carousel";

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
};
