
import React, { useState, useEffect } from "react";

interface CarouselBackgroundProps {
  images: string[];
  interval?: number;
}

export const CarouselBackground = ({ 
  images, 
  interval = 5000 
}: CarouselBackgroundProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, interval);
    
    return () => clearInterval(slideInterval);
  }, [images.length, interval]);

  return (
    <div className="absolute inset-0 z-0">
      {images.map((image, index) => (
        <div 
          key={index} 
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-10" : "opacity-0"
          }`}
          style={{backgroundImage: `url(${image})`}}
        />
      ))}
    </div>
  );
};
