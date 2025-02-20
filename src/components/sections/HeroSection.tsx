
import { Button } from "@/components/ui/button";
import { MoveRight, Phone, FileText, Star, ShieldCheck, Globe2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar3DCreator } from "@/components/Avatar3D";

export const HeroSection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCallNow = () => {
    window.location.href = "tel:+24223456789";
    toast({
      title: "Appel en cours",
      description: "Vous allez être mis en relation avec notre équipe.",
    });
  };

  const handleQuoteRequest = () => {
    navigate("/devis");
    toast({
      title: "Demande de devis",
      description: "Remplissez le formulaire pour obtenir un devis personnalisé.",
    });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-r from-[#1A1F2C] to-[#2C3345]">
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1519389950473-47ba0277781c)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      <div className="container relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white space-y-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 animate-fade-in">
              <Star className="w-4 h-4 mr-2" />
              Leader du marché au Congo
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight animate-slide-up">
              Centre d'Appels <br />
              <span className="text-primary">Nouvelle Génération</span>
            </h1>
            
            <p className="text-xl opacity-90 max-w-xl animate-fade-in">
              Optimisez votre relation client grâce à notre technologie omnicanale alimentée par l'IA. Performance, innovation et excellence au service de votre entreprise.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                variant="default"
                className="animate-fade-in hover-lift group"
                onClick={handleCallNow}
              >
                Démarrer maintenant
                <MoveRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="animate-fade-in text-white hover:text-primary hover-lift"
                onClick={handleQuoteRequest}
              >
                Demander un devis
                <FileText className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-8 border-t border-white/10">
              <div className="flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-primary" />
                <span>Couverture nationale</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span>ISO 27001 Certifié</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-secondary/20 rounded-full blur-3xl"></div>
            <Avatar3DCreator />
          </div>
        </div>
      </div>
    </section>
  );
};
