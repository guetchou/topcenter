
import React from "react";
import { Button } from "@/components/ui/button";
import { MoveRight, PhoneCall, Award, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const NewHeroSection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCallNow = () => {
    // Simuler un appel ou demande de contact
    toast({
      title: "Demande de contact",
      description: "Un membre de notre équipe vous contactera bientôt.",
    });
    navigate("/contact");
  };

  const handleQuoteRequest = () => {
    navigate("/devis");
    toast({
      title: "Demande de devis",
      description: "Remplissez le formulaire pour obtenir un devis personnalisé.",
    });
  };

  return (
    <section className="relative bg-gradient-to-r from-primary/90 to-primary py-20 text-white overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
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
                onClick={handleCallNow}
              >
                Démarrer maintenant
                <MoveRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent text-white border-white hover:bg-white/10"
                onClick={handleQuoteRequest}
              >
                Demander un devis
              </Button>
            </div>
            
            {/* Stats row */}
            <div className="grid grid-cols-2 gap-4 mt-10 pt-6 border-t border-white/20">
              <div className="flex items-start gap-3">
                <PhoneCall className="w-8 h-8 text-secondary p-1.5 bg-white/10 rounded-lg" />
                <div>
                  <div className="text-2xl font-bold">2500+</div>
                  <div className="text-sm text-white/70">Appels par jour</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Award className="w-8 h-8 text-secondary p-1.5 bg-white/10 rounded-lg" />
                <div>
                  <div className="text-2xl font-bold">350+</div>
                  <div className="text-sm text-white/70">Clients satisfaits</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-secondary/20 to-secondary/40 blur-2xl"></div>
              <img 
                src="/lovable-uploads/agent-topcenter1.png" 
                alt="Agent TopCenter" 
                className="relative rounded-xl shadow-lg object-cover w-full max-w-lg mx-auto"
              />
            </div>
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
