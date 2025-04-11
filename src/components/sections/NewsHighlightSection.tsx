
import React, { memo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import NewsGrid from "./news/NewsGrid";
import type { NewsItem } from "./news/NewsGrid";

// Données statiques pour réduire les problèmes de chargement
const newsItems: NewsItem[] = [
  {
    id: "1",
    title: "TopCenter ouvre un nouveau centre à Pointe-Noire",
    excerpt: "Notre entreprise continue de s'étendre avec l'ouverture d'un nouveau centre à Pointe-Noire pour mieux servir nos clients.",
    date: format(new Date("2023-11-15"), "d MMMM yyyy", { locale: fr }),
    category: "company",
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c"
  },
  {
    id: "2",
    title: "Certification ISO 9001 obtenue",
    excerpt: "TopCenter vient d'obtenir la certification ISO 9001, garantissant la qualité de nos services à tous nos clients.",
    date: format(new Date("2023-10-22"), "d MMMM yyyy", { locale: fr }),
    category: "company",
    imageUrl: "https://images.unsplash.com/photo-1592482545852-92a07513b8d4"
  },
  {
    id: "3",
    title: "Formation des agents sur la nouvelle plateforme CRM",
    excerpt: "Une formation intensive sur notre nouvelle plateforme CRM a été organisée pour améliorer la qualité de service.",
    date: format(new Date("2023-09-30"), "d MMMM yyyy", { locale: fr }),
    category: "company",
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c"
  }
];

export const NewsHighlightSection = memo(() => {
  return (
    <section className="py-12 bg-accent/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Actualités récentes</h2>
            <p className="text-muted-foreground mt-1">Restez informé des dernières nouvelles de TopCenter</p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/actualites" className="flex items-center gap-1">
              Toutes les actualités
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <NewsGrid 
          news={newsItems} 
          isLoading={false} 
          showViewAll={true}
          limit={3}
        />
      </div>
    </section>
  );
});

NewsHighlightSection.displayName = 'NewsHighlightSection';

export default NewsHighlightSection;
