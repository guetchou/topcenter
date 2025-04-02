
import { useState, useEffect } from "react";
import { Smile, Meh, Frown, ArrowUp, ArrowDown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { SentimentResult } from "@/utils/sentimentAnalyzer";

interface SentimentIndicatorProps {
  sentiment: SentimentResult | null;
  className?: string;
}

export const SentimentIndicator = ({ sentiment, className }: SentimentIndicatorProps) => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (sentiment) {
      setShowAnimation(true);
      const timer = setTimeout(() => setShowAnimation(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [sentiment]);

  if (!sentiment) return null;

  const { score, confidence, keywords } = sentiment;

  // Déterminer l'icône en fonction du score de sentiment
  const getIcon = () => {
    if (score > 0.2) return <Smile className="text-green-500" />;
    if (score < -0.2) return <Frown className="text-red-500" />;
    return <Meh className="text-amber-500" />;
  };

  // Déterminer le texte de sentiment
  const getSentimentText = () => {
    if (score > 0.5) return "Très positif";
    if (score > 0.2) return "Positif";
    if (score < -0.5) return "Très négatif";
    if (score < -0.2) return "Négatif";
    return "Neutre";
  };

  // Déterminer la couleur de fond
  const getBackgroundColor = () => {
    if (score > 0.2) return "bg-green-50";
    if (score < -0.2) return "bg-red-50";
    return "bg-amber-50";
  };

  // Formater le score pour l'affichage
  const formattedScore = Math.abs(Math.round(score * 100));

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-1 text-xs",
              getBackgroundColor(),
              showAnimation && "animate-bounce-subtle",
              className
            )}
          >
            {getIcon()}
            <span className="font-medium">{formattedScore}%</span>
            {score > 0 ? (
              <ArrowUp className="w-3 h-3 text-green-500" />
            ) : score < 0 ? (
              <ArrowDown className="w-3 h-3 text-red-500" />
            ) : null}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-2">
            <p className="font-semibold">{getSentimentText()}</p>
            <p className="text-xs">Confiance: {Math.round(confidence * 100)}%</p>
            {keywords.length > 0 && (
              <div>
                <p className="text-xs font-medium">Mots-clés détectés:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-1.5 py-0.5 text-xs rounded-full bg-muted"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
