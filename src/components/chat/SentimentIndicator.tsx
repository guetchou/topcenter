
import React from 'react';
import { Smile, Meh, Frown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SentimentResult } from '@/utils/sentimentAnalyzer';

interface SentimentIndicatorProps {
  sentiment: SentimentResult;
  className?: string;
}

export const SentimentIndicator = ({ sentiment, className }: SentimentIndicatorProps) => {
  // Déterminer l'icône à afficher en fonction du sentiment
  const getIcon = () => {
    switch (sentiment.sentiment) {
      case 'positive':
        return (
          <Smile 
            className="text-green-500" 
            size={16} 
          />
        );
      case 'neutral':
        return (
          <Meh 
            className="text-amber-500" 
            size={16} 
          />
        );
      case 'negative':
        return (
          <Frown 
            className="text-red-500" 
            size={16} 
          />
        );
      default:
        return (
          <Meh 
            className="text-gray-400" 
            size={16} 
          />
        );
    }
  };

  // Calculer la largeur de la barre de confiance
  const confidenceWidth = `${Math.round(sentiment.confidence * 100)}%`;

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {getIcon()}
      <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={cn(
            "h-full rounded-full",
            sentiment.sentiment === 'positive' && "bg-green-500",
            sentiment.sentiment === 'neutral' && "bg-amber-500",
            sentiment.sentiment === 'negative' && "bg-red-500"
          )}
          style={{ width: confidenceWidth }}
        />
      </div>
    </div>
  );
};
