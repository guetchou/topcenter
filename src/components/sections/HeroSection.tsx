import { Button } from "@/components/ui/button";
import { MoveRight, Phone, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

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
    <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-r from-[#403E43] to-[#1A1F2C]">
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h1 className="mb-6 text-5xl font-bold animate-slide-up">
            Centre d'Appels Omnicanal au Congo
          </h1>
          <p className="mb-8 text-xl opacity-90 animate-fade-in">
            Une expertise complète en gestion de la relation client
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              size="lg" 
              variant="secondary" 
              className="animate-fade-in hover-lift group"
              onClick={handleCallNow}
            >
              Appelez maintenant
              <Phone className="w-4 h-4 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="animate-fade-in text-white hover:text-primary hover-lift"
              onClick={handleQuoteRequest}
            >
              Demandez un devis
              <FileText className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1469474968028-56623f02e42e)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
    </section>
  );
};