
import React from "react";
import { NewsCard } from "@/components/NewsCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface NewsData {
  id: string;
  title: string;
  excerpt?: string;
  content?: string;
  date: string;
  category: "company" | "industry";
  imageUrl?: string;
}

interface NewsGridProps {
  news: NewsData[];
  isLoading: boolean;
  error?: Error | null;
  showViewAll?: boolean;
  limit?: number;
}

export const NewsGrid: React.FC<NewsGridProps> = ({ 
  news, 
  isLoading, 
  error, 
  showViewAll = false,
  limit = 6 
}) => {
  // Limit the number of news items if specified
  const limitedNews = limit ? news.slice(0, limit) : news;

  // Vérifier si on utilise la nouvelle route 'actualites' ou l'ancienne 'news'
  const getDetailRoute = (id: string) => {
    // Vérifier dans quelle route nous sommes en analysant l'URL actuelle
    const currentPath = window.location.pathname;
    if (currentPath.includes('/actualites') || currentPath.includes('/blog')) {
      return `/actualites/${id}`;
    }
    return `/news/${id}`;
  };

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array(limit).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-[400px] w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Une erreur est survenue lors du chargement des actualités.
        </AlertDescription>
      </Alert>
    );
  }

  if (!news?.length) {
    return (
      <Alert>
        <AlertDescription>
          Aucune actualité n'est disponible pour le moment.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {limitedNews.map((item) => (
          <NewsCard
            key={item.id}
            id={item.id}
            title={item.title}
            description={item.excerpt || item.content?.substring(0, 150) + "..." || ""}
            date={item.date}
            category={item.category}
            imageUrl={item.imageUrl}
          />
        ))}
      </div>
      
      {showViewAll && news.length > limit && (
        <div className="flex justify-center mt-8">
          <Button variant="outline" asChild>
            <Link to="/actualites">Voir toutes les actualités</Link>
          </Button>
        </div>
      )}
    </div>
  );
};
