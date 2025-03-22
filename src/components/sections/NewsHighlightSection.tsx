
import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// Données fictives pour les actualités
const newsItems = [
  {
    id: "1",
    title: "TopCenter ouvre un nouveau centre à Pointe-Noire",
    excerpt: "Notre entreprise continue de s'étendre avec l'ouverture d'un nouveau centre à Pointe-Noire pour mieux servir nos clients.",
    date: new Date("2023-11-15"),
    category: "Expansion",
    readTime: "3 min"
  },
  {
    id: "2",
    title: "Certification ISO 9001 obtenue",
    excerpt: "TopCenter vient d'obtenir la certification ISO 9001, garantissant la qualité de nos services à tous nos clients.",
    date: new Date("2023-10-22"),
    category: "Certification",
    readTime: "4 min"
  },
  {
    id: "3",
    title: "Formation des agents sur la nouvelle plateforme CRM",
    excerpt: "Une formation intensive sur notre nouvelle plateforme CRM a été organisée pour améliorer la qualité de service.",
    date: new Date("2023-09-30"),
    category: "Formation",
    readTime: "2 min"
  }
];

export const NewsHighlightSection = () => {
  const topNews = newsItems.slice(0, 3);
  
  return (
    <section className="py-12 bg-accent/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Actualités récentes</h2>
            <p className="text-muted-foreground mt-1">Restez informé des dernières nouvelles de TopCenter</p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/news" className="flex items-center gap-1">
              Toutes les actualités
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3 sm:grid-cols-2">
          {topNews.map((news) => (
            <Card key={news.id} className="overflow-hidden group hover:shadow-md transition-shadow">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="outline" className="text-xs font-normal">
                    {news.category}
                  </Badge>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {news.readTime}
                  </div>
                </div>
                <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                  <Link to={`/news/${news.id}`}>{news.title}</Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <CardDescription className="line-clamp-3">
                  {news.excerpt}
                </CardDescription>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex items-center justify-between">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  {format(news.date, "d MMMM yyyy", { locale: fr })}
                </div>
                <Link 
                  to={`/news/${news.id}`} 
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Lire la suite
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
