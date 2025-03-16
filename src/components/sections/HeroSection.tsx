import { MoveRight, ShieldCheck, Globe2, Star, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import VideoPlayer from "./VideoPlayer"; // Import du nouveau composant VideoPlayer

export const HeroSection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [videoLoaded, setVideoLoaded] = useState(false);

  const handleCallNow = () => {
    window.location.href = "tel:+242064495353";
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
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 animate-pulse-subtle">
              <Star className="w-4 h-4 mr-2" />
              Leader du marché au Congo
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-white">
              Centre d'Appels <br />
              <span className="text-primary">Nouvelle Génération</span>
            </h1>
            
            <p className="text-xl text-white/90 mt-6 mb-8 max-w-xl">
              Optimisez votre relation client grâce à notre technologie omnicanale alimentée par l'IA. Performance, innovation et excellence au service de votre entreprise.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                variant="default"
                className="group relative overflow-hidden"
                onClick={handleCallNow}
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                Démarrer maintenant
                <MoveRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="relative overflow-hidden group border-2 border-white bg-transparent text-white hover:bg-white/10 transition-all duration-300 shadow-lg"
                onClick={handleQuoteRequest}
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                Demander un devis
                <FileText className="w-5 h-5 ml-2 text-primary group-hover:rotate-12 transition-transform" />
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-8 mt-8 border-t border-white/10">
              <div className="flex items-center gap-2 text-white group hover:text-primary transition-colors duration-300">
                <Globe2 className="w-5 h-5 text-primary group-hover:animate-bounce-subtle" />
                <span>Couverture nationale</span>
              </div>
              <div className="flex items-center gap-2 text-white group hover:text-primary transition-colors duration-300">
                <ShieldCheck className="w-5 h-5 text-primary group-hover:animate-bounce-subtle" />
                <span>ISO 27001 Certifié</span>
              </div>
            </div>
          </div>
          
          <div className="hidden md:block relative">
            <div className="rounded-lg overflow-hidden shadow-2xl transform transition-transform duration-500 hover:scale-105 border-2 border-primary/20">
              {!videoLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-gray-800 to-gray-900">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <VideoPlayer />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
