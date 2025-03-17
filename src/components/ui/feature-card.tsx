
import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element
    const y = e.clientY - rect.top; // y position within the element
    
    setMousePosition({ x, y });
  };

  // Calcule l'angle de rotation selon la position de la souris
  const calculateRotation = () => {
    if (!cardRef.current || !isHovered) return { x: 0, y: 0 };
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Normaliser entre -10 et 10 degrés
    const rotateY = ((mousePosition.x - centerX) / centerX) * 5;
    const rotateX = ((centerY - mousePosition.y) / centerY) * 5;
    
    return { x: rotateX, y: rotateY };
  };
  
  const rotation = calculateRotation();

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "relative overflow-hidden cursor-pointer transform-gpu",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        perspective: "1000px"
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
    >
      <Card 
        className={cn(
          "h-full transition-all duration-300 overflow-hidden border border-border/50 bg-card",
          isHovered ? "shadow-lg border-primary/20" : "shadow-sm"
        )}
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: isHovered ? "transform 0.2s ease" : "transform 0.5s ease",
        }}
      >
        <CardContent className="p-6 relative z-10">
          <div className="relative">
            <div className="flex items-start gap-4">
              <motion.div
                className={`p-2 rounded-lg ${
                  isHovered ? "bg-primary/30" : "bg-primary/10"
                }`}
                animate={{ scale: isHovered ? 1.1 : 1 }}
                transition={{ duration: 0.3 }}
              >
                {icon}
              </motion.div>
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
                
                <motion.div 
                  className="mt-2 overflow-hidden text-muted-foreground"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ 
                    height: expanded ? "auto" : 0,
                    opacity: expanded ? 1 : 0 
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {details}
                </motion.div>
              </div>
            )}

            {/* Indicateur visuel amélioré */}
            <div className={cn(
              "absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary/60 via-primary to-primary/60 transform scale-x-0 origin-left transition-transform duration-300",
              isHovered && "scale-x-100"
            )} />
            
            {/* Effet de glow au survol */}
            {isHovered && (
              <motion.div 
                className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-primary/20 filter blur-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ duration: 0.5 }}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
