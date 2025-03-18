
import { MoveRight, ShieldCheck, Globe2, Star, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { LazyImage } from "@/components/ui/lazy-image";

export const HeroSection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isScrolled, setIsScrolled] = useState(false);

  // Effet de défilement pour les animations basées sur le scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  // Fonction pour appliquer des animations en fonction du défilement
  const getScrollAnimation = (delay = 0) => {
    return {
      opacity: isScrolled ? 1 : 0.8,
      transform: isScrolled ? "translateY(0)" : "translateY(20px)",
      transition: `all 0.5s ease-out ${delay}s`,
    };
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
            <div className="relative p-6 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg shadow-2xl border border-primary/30 backdrop-blur-sm transform transition-transform duration-500 hover:scale-105">
              <LazyImage
                src="/lovable-uploads/staff-tce.jpg"
                alt="TopCenter Team"
                className="w-full h-auto rounded-md shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-xl font-semibold mb-2">Notre équipe d'experts</h3>
                  <p className="text-sm text-white/80">Des professionnels formés pour répondre à tous vos besoins</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nouveaux indicateurs interactifs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          {[
            { label: "Agents Formés", value: "120+", icon: "👨‍💼" },
            { label: "Clients Satisfaits", value: "350+", icon: "🏆" },
            { label: "Appels par Jour", value: "2500+", icon: "📞" },
            { label: "Solutions IA", value: "15+", icon: "🤖" }
          ].map((stat, index) => (
            <div 
              key={index}
              className="bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:transform hover:scale-105"
              style={{
                animationDelay: `${index * 0.1}s`,
                animation: 'fadeInUp 0.5s ease-out forwards',
              }}
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-white/70">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bannière technologie flottante */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-primary/80 to-primary/50 py-2 transform translate-y-0 hover:translate-y-1 transition-transform duration-300 backdrop-blur-sm">
        <div className="container flex items-center justify-center gap-4 text-white text-sm overflow-x-auto whitespace-nowrap">
          <span>Powered by:</span>
          <span className="font-semibold">AI Voice Analytics</span>
          <span>|</span>
          <span className="font-semibold">Omnichannel Solution</span>
          <span>|</span>
          <span className="font-semibold">Cloud Infrastructure</span>
          <span>|</span>
          <span className="font-semibold">Real-time Monitoring</span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
