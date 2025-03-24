
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
  sizes?: string;
  lazyLoad?: boolean;
  aspectRatio?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  className?: string;
  containerClassName?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const ResponsiveImage = ({
  src,
  alt,
  fallback = '/placeholder.svg',
  sizes = '100vw',
  lazyLoad = true,
  aspectRatio = '16/9',
  objectFit = 'cover',
  className,
  containerClassName,
  onLoad,
  onError,
  ...props
}: ResponsiveImageProps) => {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    setImgSrc(src);
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setImgSrc(fallback);
    onError?.();
  };

  return (
    <div 
      className={cn(
        "relative overflow-hidden",
        containerClassName
      )}
      style={{ aspectRatio }}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse">
          <span className="sr-only">Chargement...</span>
        </div>
      )}
      
      <img
        src={imgSrc}
        alt={alt}
        loading={lazyLoad ? "lazy" : "eager"}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "w-full h-full transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        style={{ objectFit }}
        sizes={sizes}
        {...props}
      />
      
      {hasError && imgSrc === fallback && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 text-muted-foreground text-sm">
          Image indisponible
        </div>
      )}
    </div>
  );
};

export default ResponsiveImage;
