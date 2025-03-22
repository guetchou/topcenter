
import React from "react";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import { StatsRow } from "./StatsRow";

interface HeroContentProps {
  onCallNow: () => void;
  onQuoteRequest: () => void;
}

export const HeroContent = ({ onCallNow, onQuoteRequest }: HeroContentProps) => {
  return (
    <div>
      <h1 className="text-4xl md:text-5xl font-bold mb-6">
        Solutions de Centre d'Appels Professionnelles au Congo
      </h1>
      <p className="text-lg md:text-xl mb-8 text-white/90">
        Améliorez votre relation client avec TopCenter, votre partenaire en solutions innovantes
        et services personnalisés
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          size="lg"
          variant="secondary"
          className="font-medium group"
          onClick={onCallNow}
        >
          Démarrer maintenant
          <MoveRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="bg-transparent text-white border-white hover:bg-white/10"
          onClick={onQuoteRequest}
        >
          Demander un devis
        </Button>
      </div>
      
      <StatsRow />
    </div>
  );
};
