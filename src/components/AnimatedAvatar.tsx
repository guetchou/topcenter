
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AnimatedAvatarProps {
  imageSrc: string;
  name: string;
  role: string;
  status?: "online" | "busy" | "away" | "offline";
}

export const AnimatedAvatar = ({ 
  imageSrc, 
  name, 
  role, 
  status = "offline" 
}: AnimatedAvatarProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animation aléatoire périodique
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isHovered) {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 2000);
      }
    }, Math.random() * 10000 + 5000);
    
    return () => clearInterval(timer);
  }, [isHovered]);

  const statusColors = {
    online: "bg-green-500",
    busy: "bg-red-500",
    away: "bg-amber-500",
    offline: "bg-gray-400"
  };

  return (
    <Card 
      className="overflow-hidden transition-all duration-300 hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-6 flex flex-col items-center">
        <div
          className={`relative mb-4 transition-transform duration-300 ${isAnimating ? 'scale-110' : ''}`}
        >
          <Avatar className="w-20 h-20 border-2 border-primary/20">
            <AvatarImage src={imageSrc} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-background ${statusColors[status]}`} />
        </div>
        
        <div className="text-center">
          <h3 className="font-medium">{name}</h3>
          <Badge variant="outline" className="mt-1">{role}</Badge>
        </div>

        {isHovered && (
          <div className="mt-4 text-center">
            <div className="text-xs text-muted-foreground">
              Cliquez pour contacter directement
            </div>
            <div className="flex justify-center space-x-2 mt-2">
              {["call", "email", "message"].map((action, i) => (
                <div
                  key={action}
                  className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center cursor-pointer hover:bg-primary/20"
                >
                  <span className="text-xs">{action.charAt(0).toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
