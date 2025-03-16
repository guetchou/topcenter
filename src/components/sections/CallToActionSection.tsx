
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Phone } from "lucide-react";
import { useState } from "react";

export const CallToActionSection = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary-foreground/10 opacity-90"></div>
      
      {/* Animated particles */}
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
          <h2 className="text-3xl font-bold mb-4 animate-slide-in-bottom">
            Prêt à améliorer votre service client ?
          </h2>
          <p className="mb-8 text-primary-foreground/90">
            Rejoignez les entreprises qui font confiance à Top Center pour leur relation client
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative overflow-hidden transition-transform duration-300 hover:-translate-y-1"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <span className="relative z-10 flex items-center">
                <Phone className={`mr-2 w-4 h-4 transition-transform duration-300 ${isHovered ? 'rotate-12' : ''}`} />
                Contactez-nous
                <ArrowRight className={`ml-2 w-4 h-4 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
              </span>
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-secondary/0 via-secondary/30 to-secondary/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => document.getElementById('devis')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-primary hover:bg-white/90 hover:text-primary/90 border-2 border-white shadow-lg transition-all duration-300 font-semibold relative overflow-hidden group hover:-translate-y-1"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
              <FileText className="mr-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
              Demander un devis
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;
