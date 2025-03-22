
import React, { useState, useEffect } from "react";

interface CarouselBackgroundProps {
  images: string[];
  interval?: number;
  overlayOpacity?: number;
  animationDuration?: number;
  blur?: number;
}

export const CarouselBackground = ({ 
  images, 
  interval = 5000,
  overlayOpacity = 0.1,
  animationDuration = 1000,
  blur = 0
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

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {images.map((image, index) => (
        <div 
          key={index} 
          className={`absolute inset-0 bg-cover bg-center transition-opacity ease-in-out ${
            index === currentSlide 
              ? `opacity-${Math.round(overlayOpacity * 100)} duration-${animationDuration}` 
              : index === previousSlide && isTransitioning
                ? `opacity-0 duration-${animationDuration}`
                : "opacity-0"
          }`}
          style={{
            backgroundImage: `url(${image})`,
            filter: blur > 0 ? `blur(${blur}px)` : 'none',
            transform: 'scale(1.05)', // Slightly larger to prevent white edges during blur
          }}
        />
      ))}
      
      {/* Optional overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/30 to-primary/10 mix-blend-overlay"></div>
    </div>
  );
};
