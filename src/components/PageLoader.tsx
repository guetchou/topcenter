
import React from 'react';
import { Spinner } from './ui/spinner';

interface PageLoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export const PageLoader: React.FC<PageLoaderProps> = ({
  message = "Chargement en cours...",
  size = "md",
  fullScreen = false,
}) => {
  return (
    <div 
      className={`flex flex-col items-center justify-center gap-4 ${
        fullScreen ? 'fixed inset-0 bg-background/80 backdrop-blur-sm z-50' : 'min-h-[50vh]'
      }`}
    >
      <div className="animate-pulse-subtle">
        <Spinner className="text-primary" size={size} />
      </div>
      {message && (
        <p className="text-muted-foreground text-sm animate-fade-in">
          {message}
        </p>
      )}
    </div>
  );
};

// Loader pour les sections
export const SectionLoader: React.FC<{ title?: string }> = ({ title }) => {
  return (
    <div className="py-8 animate-pulse">
      {title && (
        <div className="w-1/3 h-8 bg-muted rounded mb-8 mx-auto"></div>
      )}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 bg-muted rounded-lg"></div>
        ))}
      </div>
    </div>
  );
};

// Skeleton pour les cards de contenu
export const CardSkeleton: React.FC = () => {
  return (
    <div className="rounded-lg border p-4 animate-pulse">
      <div className="h-40 bg-muted rounded-md mb-4"></div>
      <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
      <div className="h-20 bg-muted rounded w-full"></div>
    </div>
  );
};

export default PageLoader;
