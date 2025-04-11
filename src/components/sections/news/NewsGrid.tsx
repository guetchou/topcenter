
import React, { memo } from "react";
import { NewsCard } from "@/components/NewsCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: "company" | "industry";
  imageUrl?: string;
}

interface NewsGridProps {
  news?: NewsItem[];
  isLoading?: boolean;
  error?: Error | null;
  showViewAll?: boolean;
  limit?: number;
}

// Squelette de chargement optimisé
const NewsGridSkeleton = memo(({ count = 3 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="bg-card rounded-lg shadow overflow-hidden">
        <Skeleton className="h-48 w-full" />
        <div className="p-4 space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-10 w-1/3 mt-4" />
        </div>
      </div>
    ))}
  </div>
));
NewsGridSkeleton.displayName = 'NewsGridSkeleton';

// Message d'erreur optimisé
const ErrorMessage = memo(({ message }: { message: string }) => (
  <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 text-center">
    <p>{message}</p>
  </div>
));
ErrorMessage.displayName = 'ErrorMessage';

// Composant principal optimisé
export const NewsGrid: React.FC<NewsGridProps> = memo(({
  news = [],
  isLoading = false,
  error = null,
  showViewAll = false,
  limit = 6
}) => {
  const limitedNews = news.slice(0, limit);
  
  if (isLoading) {
    return <NewsGridSkeleton count={limit} />;
  }
  
  if (error) {
    return <ErrorMessage message="Une erreur est survenue lors du chargement des actualités." />;
  }
  
  if (!news || news.length === 0) {
    return <ErrorMessage message="Aucune actualité n'est disponible pour le moment." />;
  }
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {limitedNews.map((item) => (
          <NewsCard
            key={item.id}
            id={item.id}
            title={item.title}
            description={item.excerpt}
            date={item.date}
            category={item.category}
            imageUrl={item.imageUrl}
          />
        ))}
      </div>
      
      {showViewAll && news.length > limit && (
        <div className="text-center">
          <Button variant="outline" asChild>
            <Link to="/actualites" className="flex items-center gap-1">
              Voir toutes les actualités
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
});
NewsGrid.displayName = 'NewsGrid';

export default NewsGrid;
