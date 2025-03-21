
import React from "react";
import { Button } from "@/components/ui/button";

const NewHeroSection = () => {
  return (
    <section className="relative bg-gradient-to-r from-primary/90 to-primary py-20 text-white overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Solutions de Centre d'Appels Professionnelles au Congo
          </h1>
          <p className="text-lg md:text-xl mb-8 text-white/90">
            Améliorez votre relation client avec TopCenter, votre partenaire en solutions innovantes
            et services personnalisés
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="font-medium"
            >
              Découvrir nos services
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent text-white border-white hover:bg-white/10"
            >
              Demander un devis
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/lovable-uploads/staff-tce.jpg')] bg-cover bg-center"></div>
      </div>
    </section>
  );
};

export default NewHeroSection;
