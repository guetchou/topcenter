
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
        <motion.div
          className="relative mb-4"
          whileHover={{ scale: 1.1 }}
          animate={isAnimating ? { 
            rotate: [0, -10, 10, -5, 0],
            scale: [1, 1.1, 1.1, 1] 
          } : {}}
          transition={{ duration: 0.5 }}
        >
          <Avatar className="w-20 h-20 border-2 border-primary/20">
            <AvatarImage src={imageSrc} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-background ${statusColors[status]}`} />
        </motion.div>
        
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="font-medium">{name}</h3>
          <Badge variant="outline" className="mt-1">{role}</Badge>
        </motion.div>

        {isHovered && (
          <motion.div
            className="mt-4 text-center"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-xs text-muted-foreground">
              Cliquez pour contacter directement
            </div>
            <div className="flex justify-center space-x-2 mt-2">
              {["call", "email", "message"].map((action, i) => (
                <motion.div
                  key={action}
                  className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center cursor-pointer hover:bg-primary/20"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 * i }}
                >
                  <span className="text-xs">{action.charAt(0).toUpperCase()}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};
