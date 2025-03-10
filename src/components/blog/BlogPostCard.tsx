
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";
import type { BlogPost } from "@/types/blog";

interface BlogPostCardProps {
  article: BlogPost;
  formatDate: (date: string) => string;
}

export const BlogPostCard: React.FC<BlogPostCardProps> = ({ article, formatDate }) => {
  const navigate = useNavigate();

  return (
    <Card 
      className="hover-lift overflow-hidden cursor-pointer flex flex-col h-full group"
      onClick={() => navigate(`/blog/${article.id}`)}
    >
      <div className="flex flex-col h-full">
        {article.featured_image_url && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={article.featured_image_url}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        )}
        <CardContent className="p-6 flex-1 flex flex-col">
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <Calendar className="w-4 h-4 mr-2" />
            {formatDate(article.created_at)}
          </div>
          <h3 className="font-semibold text-xl mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>
          <p className="text-muted-foreground mb-4 flex-1 line-clamp-3">
            {article.excerpt || ''}
          </p>
          <div className="flex items-center justify-between mt-auto">
            <Badge variant="outline">{article.category}</Badge>
            <Button variant="ghost" size="sm" className="group/btn">
              Lire plus <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};
