
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

  return (
    <Card 
      className={cn(
        "transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 overflow-hidden group",
        className
      )}
    >
      <CardContent className="p-6">
        <div className="relative">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary/10 rounded-lg transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
              {icon}
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{title}</h3>
              <p className="text-muted-foreground">{description}</p>
            </div>
          </div>
          
          {details && (
            <div className="mt-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-0 h-auto flex items-center text-primary hover:text-primary/80 hover:bg-transparent"
                onClick={() => setExpanded(!expanded)}
              >
                <span>En savoir plus</span>
                {expanded ? (
                  <ChevronUp className="ml-1 w-4 h-4 transition-transform" />
                ) : (
                  <ChevronDown className="ml-1 w-4 h-4 transition-transform" />
                )}
              </Button>
              
              <div 
                className={cn(
                  "mt-2 overflow-hidden transition-all duration-300 text-muted-foreground",
                  expanded ? "max-h-40" : "max-h-0"
                )}
              >
                {details}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
