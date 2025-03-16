
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  placeholderColor?: string;
}

export const LazyImage = ({ 
  src, 
  alt, 
  className, 
  width, 
  height, 
  placeholderColor = "#f3f4f6" 
}: LazyImageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  
  useEffect(() => {
    const img = new Image();
    img.src = src;
    
    const onLoad = () => {
      setImageSrc(src);
      setImageLoaded(true);
    };
    
    img.addEventListener("load", onLoad);
    
    return () => {
      img.removeEventListener("load", onLoad);
    };
  }, [src]);
  
  return (
    <div 
      className={cn(
        "overflow-hidden relative",
        className
      )}
      style={{ width, height }}
    >
      {!imageLoaded && (
        <div 
          className="absolute inset-0 animate-pulse"
          style={{ backgroundColor: placeholderColor }}
        />
      )}
      
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-500 ease-in-out",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          width={width}
          height={height}
          loading="lazy"
        />
      )}
    </div>
  );
};
