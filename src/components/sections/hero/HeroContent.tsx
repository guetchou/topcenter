
import React from "react";
import { Button } from "@/components/ui/button";
import { MoveRight, PhoneCall, Mail, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { StatsRow } from "./StatsRow";

interface HeroContentProps {
  onCallNow: () => void;
  onQuoteRequest: () => void;
}

export const HeroContent = ({ 
  onCallNow, 
  onQuoteRequest
}: HeroContentProps) => {
  return (
    <div className="animate-fade-slide">
      <h1 className="text-4xl md:text-5xl font-bold mb-6">
        Solutions de Centre d'Appels Professionnelles au Congo
      </h1>
      <p className="text-lg md:text-xl mb-8 text-white/90" style={{ animationDelay: "0.2s" }}>
        Améliorez votre relation client avec TopCenter, votre partenaire en solutions innovantes
        et services personnalisés
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center" style={{ animationDelay: "0.4s" }}>
        <Button
          size="lg"
          variant="secondary"
          className="font-medium group animate-pop-in"
          onClick={onCallNow}
          style={{ animationDelay: "0.6s" }}
        >
          <PhoneCall className="w-4 h-4 mr-2" />
          Démarrer maintenant
          <MoveRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
        </Button>
        
        <Button
          size="lg"
          variant="outline"
          className="bg-transparent text-white border-white hover:bg-white/10 animate-pop-in"
          onClick={onQuoteRequest}
          style={{ animationDelay: "0.8s" }}
        >
          <Mail className="w-4 h-4 mr-2" />
          Demander un devis
        </Button>
        
        <Button
          size="lg"
          variant="outline"
          className="bg-primary/80 text-white border-primary hover:bg-primary animate-pop-in"
          asChild
          style={{ animationDelay: "1s" }}
        >
          <Link to="/admin">
            <Settings className="w-4 h-4 mr-2" />
            Accéder au CMS
          </Link>
        </Button>
      </div>
      
      <StatsRow />
    </div>
  );
};
