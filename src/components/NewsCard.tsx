
import React, { useState, memo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NewsCardProps {
  id: string;
  title: string;
  description: string;
  date: string;
  category: "company" | "industry";
  imageUrl?: string;
}

export const NewsCard = memo(({ id, title, description, date, category, imageUrl }: NewsCardProps) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  
  // Gérer les erreurs d'image
  const handleImageError = () => {
    setImageError(true);
  };
  
  // Déterminer dynamiquement la bonne route pour la navigation
  const handleClick = () => {
    // Vérifier la route actuelle pour décider de la destination
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('/actualites') || currentPath.includes('/blog')) {
      navigate(`/actualites/${id}`);
    } else if (currentPath.includes('/news')) {
      navigate(`/news/${id}`);
    } else {
      // Par défaut, utiliser /actualites/
      navigate(`/actualites/${id}`);
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md cursor-pointer" onClick={handleClick}>
      {imageUrl && !imageError && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title} 
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
            loading="lazy"
            onError={handleImageError}
          />
        </div>
      )}
      {(imageError || !imageUrl) && (
        <div className="relative h-48 overflow-hidden bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
          <span className="text-gray-500">Image non disponible</span>
        </div>
      )}
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge 
            variant={category === "company" ? "default" : "secondary"}
          >
            {category === "company" ? "Top Center" : "Industrie"}
          </Badge>
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarIcon className="w-4 h-4 mr-1" />
            {date}
          </div>
        </div>
        <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </CardTitle>
        <CardDescription className="line-clamp-3">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <button className="text-primary hover:underline group">
          Lire la suite 
          <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
        </button>
      </CardContent>
    </Card>
  );
});

NewsCard.displayName = 'NewsCard';

export default NewsCard;
