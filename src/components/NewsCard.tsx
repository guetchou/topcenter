
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

export const NewsCard = ({ id, title, description, date, category, imageUrl }: NewsCardProps) => {
  const navigate = useNavigate();
  
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
    <Card className="overflow-hidden transition-all hover-lift cursor-pointer" onClick={handleClick}>
      {imageUrl && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title} 
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
            onError={(e) => {
              // Fallback pour les images qui ne chargent pas
              e.currentTarget.src = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c';
            }}
          />
        </div>
      )}
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge 
            variant={category === "company" ? "default" : "secondary"}
            className="animate-fade-in"
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
};
