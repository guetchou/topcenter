
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  details?: string;
  className?: string;
}

export const FeatureCard = ({
  icon,
  title,
  description,
  details,
  className,
}: FeatureCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className={cn(
        "transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 overflow-hidden group cursor-pointer",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-6">
        <div className="relative">
          <div className="flex items-start gap-4">
            <div className={`p-2 rounded-lg transition-all duration-300 ${
              isHovered ? "bg-primary/30 scale-110" : "bg-primary/10"
            }`}>
              {icon}
            </div>
            <div>
              <h3 className={`text-xl font-semibold mb-2 transition-colors ${
                isHovered ? "text-primary" : ""
              }`}>{title}</h3>
              <p className="text-muted-foreground">{description}</p>
            </div>
          </div>
          
          {details && (
            <div className="mt-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-0 h-auto flex items-center text-primary hover:text-primary/80 hover:bg-transparent group"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded(!expanded);
                }}
              >
                <span>En savoir plus</span>
                {expanded ? (
                  <ChevronUp className="ml-1 w-4 h-4 transition-transform group-hover:translate-y-[-2px]" />
                ) : (
                  <ChevronDown className="ml-1 w-4 h-4 transition-transform group-hover:translate-y-[2px]" />
                )}
              </Button>
              
              <div 
                className={cn(
                  "mt-2 overflow-hidden transition-all duration-300 text-muted-foreground",
                  expanded ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                )}
              >
                {details}
              </div>
            </div>
          )}

          {/* Indicateur visuel pour montrer que la carte est interactive */}
          <div className={cn(
            "absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 origin-left transition-transform duration-300",
            isHovered && "scale-x-100"
          )} />
        </div>
      </CardContent>
    </Card>
  );
};
