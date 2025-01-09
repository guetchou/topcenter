import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon } from "lucide-react";

interface NewsCardProps {
  title: string;
  description: string;
  date: string;
  category: "company" | "industry";
  imageUrl?: string;
}

export const NewsCard = ({ title, description, date, category, imageUrl }: NewsCardProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      {imageUrl && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title} 
            className="object-cover w-full h-full transition-transform hover:scale-105"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge variant={category === "company" ? "default" : "secondary"}>
            {category === "company" ? "Top Center" : "Industrie"}
          </Badge>
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarIcon className="w-4 h-4 mr-1" />
            {date}
          </div>
        </div>
        <CardTitle className="line-clamp-2">{title}</CardTitle>
        <CardDescription className="line-clamp-3">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <button className="text-primary hover:underline">Lire la suite →</button>
      </CardContent>
    </Card>
  );
};