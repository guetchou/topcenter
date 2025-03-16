
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Milestone, 
  HelpCircle, 
  Target, 
  Zap, 
  Trophy, 
  BarChart2,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NotificationButton } from "@/components/nav/NotificationButton";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LoyaltySection } from "@/components/sections/LoyaltySection";
import { EventsCalendarSection } from "@/components/sections/EventsCalendarSection";
import { TimelineSection } from "@/components/sections/TimelineSection";

// Sample data for events calendar with properly typed literals
const sampleEvents = [
  {
    id: 1,
    title: "Formation des agents",
    date: new Date(),
    type: "formation" as const
  },
  {
    id: 2,
    title: "Séminaire sur l'IA",
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
    type: "seminaire" as const
  },
  {
    id: 3,
    title: "Atelier Service Client",
    date: new Date(new Date().setDate(new Date().getDate() + 5)),
    type: "atelier" as const
  }
];

// Component content options
type ContentOption = {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  link?: string;
  component?: JSX.Element;
};

export function FuturisticNotificationBubble() {
  const [contentOptions, setContentOptions] = useState<ContentOption[]>([
    {
      id: "loyalty",
      title: "Programme de fidélité",
      description: "Découvrez comment gagner des points et obtenir des avantages exclusifs",
      icon: <Trophy className="h-5 w-5 text-amber-400" />,
      component: <div className="max-h-64 overflow-y-auto"><LoyaltySection /></div>
    },
    {
      id: "events",
      title: "Calendrier des Événements",
      description: "Consultez nos prochaines formations et ateliers",
      icon: <Calendar className="h-5 w-5 text-blue-500" />,
      component: <div className="max-h-96 overflow-y-auto"><EventsCalendarSection events={sampleEvents} /></div>
    },
    {
      id: "history",
      title: "Notre Histoire",
      description: "Découvrez l'évolution de TopCenter depuis sa création",
      icon: <Milestone className="h-5 w-5 text-green-500" />,
      component: <div className="max-h-64 overflow-y-auto"><TimelineSection /></div>
    },
    {
      id: "why",
      title: "Pourquoi Choisir TopCenter ?",
      description: "Excellence, expertise et innovation à votre service",
      icon: <HelpCircle className="h-5 w-5 text-purple-500" />
    },
    {
      id: "targets",
      title: "Secteurs Cibles",
      description: "Explorez les industries que nous servons",
      icon: <Target className="h-5 w-5 text-red-500" />
    },
    {
      id: "solutions",
      title: "Solutions Digitales Avancées",
      description: "Découvrez nos outils innovants propulsés par l'IA",
      icon: <Zap className="h-5 w-5 text-orange-500" />
    },
    {
      id: "stats",
      title: "Statistiques en Temps Réel",
      description: "Visualisez nos performances actuelles",
      icon: <BarChart2 className="h-5 w-5 text-indigo-500" />
    }
  ]);
  
  const [activeContent, setActiveContent] = useState<string | null>(null);
  const [pulseIndex, setPulseIndex] = useState(0);
  const { toast } = useToast();
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    'Notification' in window && Notification.permission === 'granted'
  );

  // Rotate through content options to draw attention
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseIndex((prev) => (prev + 1) % contentOptions.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [contentOptions.length]);

  // Show a content preview when user clicks on a content option
  const handleContentSelect = (contentId: string) => {
    if (activeContent === contentId) {
      setActiveContent(null);
    } else {
      setActiveContent(contentId);
      
      // Show toast for options without full components
      const selectedContent = contentOptions.find(option => option.id === contentId);
      if (selectedContent && !selectedContent.component) {
        toast({
          title: selectedContent.title,
          description: "Contenu complet bientôt disponible. Consultez notre site web pour plus d'informations.",
        });
      }
    }
  };

  return (
    <div className="relative">
      {/* Original NotificationButton component */}
      <NotificationButton 
        notificationsEnabled={notificationsEnabled}
        setNotificationsEnabled={setNotificationsEnabled}
      />
      
      {/* Futuristic pulse ring animation */}
      <AnimatePresence>
        <motion.div
          className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary/30 to-primary/10 blur-sm z-0"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: [0.2, 0.5, 0.2], 
            scale: [0.8, 1.2, 0.8],
            rotate: 360 
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        />
      </AnimatePresence>
      
      {/* Floating content bubbles - Redesigned for better desktop and mobile experience */}
      <div className="fixed bottom-20 right-4 z-40 md:absolute md:right-0 md:top-10 md:z-50">
        <AnimatePresence>
          {contentOptions.map((option, index) => (
            <motion.div
              key={option.id}
              className="relative mb-2 md:mb-0"
              initial={{ opacity: 0, x: 40, scale: 0.8 }}
              animate={{ 
                opacity: pulseIndex === index ? 1 : 0.6,
                x: pulseIndex === index ? 0 : 20,
                scale: pulseIndex === index ? 1 : 0.8,
                y: index * 42 // Reduced spacing for better layout
              }}
              transition={{ 
                duration: 0.5,
                type: "spring",
                stiffness: 200,
              }}
              style={{ 
                position: "absolute",
                right: 0
              }}
            >
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "rounded-full px-3 gap-2 shadow-lg backdrop-blur-sm",
                  "border border-primary/20",
                  "bg-gradient-to-r from-background/90 to-background/95",
                  "hover:bg-primary/10 hover:border-primary/40 transition-all",
                  pulseIndex === index && "ring-2 ring-primary/30 ring-offset-2 ring-offset-background/20"
                )}
                onClick={() => handleContentSelect(option.id)}
              >
                {option.icon}
                <span className={cn(
                  "text-xs truncate max-w-[100px] md:max-w-[150px]",
                  pulseIndex === index ? "block" : "hidden md:block"
                )}>
                  {option.title}
                </span>
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {/* Active content display - Redesigned for better placement */}
      <AnimatePresence>
        {activeContent && (
          <motion.div 
            className="fixed bottom-24 right-4 z-40 w-screen max-w-md md:absolute md:right-0 md:top-20 md:z-40"
            initial={{ opacity: 0, y: 10, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 10, x: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card className="shadow-lg border-primary/10 overflow-hidden backdrop-blur-sm bg-background/95 mr-4 md:mr-0">
              <CardContent className="p-0">
                {contentOptions.find(option => option.id === activeContent)?.component || (
                  <div className="p-6 text-center">
                    <div className="mb-4">
                      {contentOptions.find(option => option.id === activeContent)?.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {contentOptions.find(option => option.id === activeContent)?.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {contentOptions.find(option => option.id === activeContent)?.description}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2 gap-1"
                      onClick={() => setActiveContent(null)}
                    >
                      En savoir plus
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
