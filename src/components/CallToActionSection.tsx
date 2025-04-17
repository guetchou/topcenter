
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Phone } from "lucide-react";

export const CallToActionSection = () => {
  const [isContactHovered, setIsContactHovered] = useState(false);
  const [isQuoteHovered, setIsQuoteHovered] = useState(false);

  return (
    <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Animated background gradient with animation applied via Tailwind */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary to-primary-foreground/20 animate-gradient-x"
        style={{
          backgroundSize: "200% 200%"
        }}
      ></div>
      
      {/* Floating particles for visual interest */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random() * 0.5 + 0.2
            }}
          />
        ))}
      </div>
      
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">
            Prêt à améliorer votre service client ?
          </h2>
          <p className="mb-8 text-primary-foreground/90 text-lg animate-fade-in animation-delay-100">
            Rejoignez les entreprises qui font confiance à Top Center pour leur relation client
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in animation-delay-200">
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1"
              onMouseEnter={() => setIsContactHovered(true)}
              onMouseLeave={() => setIsContactHovered(false)}
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-secondary/0 via-secondary/30 to-secondary/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <span className="relative z-10 flex items-center">
                <Phone className={`mr-2 w-4 h-4 transition-transform duration-300 ${isContactHovered ? 'rotate-12' : ''}`} />
                Contactez-nous
                <ArrowRight className={`ml-2 w-4 h-4 transition-transform duration-300 ${isContactHovered ? 'translate-x-1' : ''}`} />
              </span>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => document.getElementById('devis')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white/10 backdrop-blur-sm text-primary-foreground hover:bg-white/20 border-2 border-white/30 shadow-lg transition-all duration-300 group relative overflow-hidden hover:-translate-y-1"
              onMouseEnter={() => setIsQuoteHovered(true)}
              onMouseLeave={() => setIsQuoteHovered(false)}
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <span className="relative z-10 flex items-center">
                <FileText className={`mr-2 w-5 h-5 transition-transform duration-300 ${isQuoteHovered ? 'rotate-6' : ''}`} />
                Demander un devis
              </span>
            </Button>
          </div>
          
          {/* Subtle animated highlight */}
          <div className="mt-12 opacity-80 animate-pulse-slow">
            <div className="w-20 h-1 bg-white/30 mx-auto rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;
