
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  placeholderColor?: string;
  fallbackSrc?: string;
  loading?: "lazy" | "eager";
}

export const LazyImage = ({ 
  src, 
  alt, 
  className, 
  width, 
  height, 
  placeholderColor = "#f3f4f6",
  fallbackSrc = "/placeholder.svg",
  loading = "lazy"
}: LazyImageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    // Reset states when src changes
    setImageLoaded(false);
    setHasError(false);
    
    const img = new Image();
    img.src = src;
    
    const onLoad = () => {
      setImageSrc(src);
      setImageLoaded(true);
    };
    
    const onError = () => {
      console.warn(`Failed to load image: ${src}`);
      setHasError(true);
      if (fallbackSrc) {
        setImageSrc(fallbackSrc);
        setImageLoaded(true);
      }
    };
    
    img.addEventListener("load", onLoad);
    img.addEventListener("error", onError);
    
    return () => {
      img.removeEventListener("load", onLoad);
      img.removeEventListener("error", onError);
    };
  }, [src, fallbackSrc]);
  
  return (
    <div 
      className={cn(
        "overflow-hidden relative",
        className
      )}
      style={{ width, height }}
      role="img"
      aria-label={alt}
    >
      {!imageLoaded && (
        <div 
          className="absolute inset-0 animate-pulse"
          style={{ backgroundColor: placeholderColor }}
          aria-hidden="true"
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
          loading={loading}
          onError={() => setHasError(true)}
        />
      )}

      {hasError && !imageSrc && (
        <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground p-4">
          <span className="text-sm">Image non disponible</span>
        </div>
      )}
    </div>
  );
};
