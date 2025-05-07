
import React, { useState, useEffect } from "react";

interface CarouselBackgroundProps {
  images: string[];
  interval?: number;
  overlayOpacity?: number;
  animationDuration?: number;
  blur?: number;
  effect?: "fade" | "slide" | "zoom" | "kenBurns";
  overlayGradient?: boolean;
}

export const CarouselBackground = ({ 
  images, 
  interval = 5000,
  overlayOpacity = 0.5,
  animationDuration = 1000,
  blur = 0,
  effect = "fade",
  overlayGradient = true
}: CarouselBackgroundProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [previousSlide, setPreviousSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setPreviousSlide(currentSlide);
      setIsTransitioning(true);
      setCurrentSlide((prev) => (prev + 1) % images.length);
      
      // Reset transition state after animation completes
      const transitionTimeout = setTimeout(() => {
        setIsTransitioning(false);
      }, animationDuration);
      
      return () => clearTimeout(transitionTimeout);
    }, interval);
    
    return () => clearInterval(slideInterval);
  }, [images.length, interval, currentSlide, animationDuration]);

  // Determine animation class based on effect
  const getAnimationClass = () => {
    switch(effect) {
      case "slide":
        return "animate-fade-slide";
      case "zoom":
        return "animate-zoom-fade";
      case "kenBurns":
        return "animate-ken-burns";
      case "fade":
      default:
        return "transition-opacity duration-1000";
    }
  };

  const animationClass = getAnimationClass();

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {images.map((image, index) => (
        <div 
          key={index} 
          className={`absolute inset-0 bg-cover bg-center ${
            index === currentSlide 
              ? `opacity-100 ${animationClass}` 
              : index === previousSlide && isTransitioning
                ? `opacity-0 transition-opacity duration-${animationDuration}`
                : "opacity-0"
          }`}
          style={{
            backgroundImage: `url(${image})`,
            filter: blur > 0 ? `blur(${blur}px)` : 'none',
            transform: blur > 0 ? 'scale(1.05)' : undefined, // Slightly larger to prevent white edges during blur
            transition: `opacity ${animationDuration}ms ease-in-out`,
          }}
          aria-hidden={index !== currentSlide ? "true" : "false"}
        />
      ))}
      
      {/* Optional overlay gradient */}
      {overlayGradient && (
        <div 
          className="absolute inset-0 bg-gradient-to-b from-primary/30 to-primary/10 mix-blend-overlay"
          aria-hidden="true"
        ></div>
      )}
      
      {/* Dark overlay for better text readability */}
      <div 
        className="absolute inset-0 bg-black transition-opacity duration-500"
        style={{ opacity: overlayOpacity }}
        aria-hidden="true"
      ></div>
    </div>
  );
};
