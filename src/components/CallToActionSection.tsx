
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { AnimationWrapper } from "./AnimationWrapper";

export const CallToActionSection = () => {
  return (
    <section className="py-20 bg-primary/95 text-primary-foreground relative overflow-hidden">
      {/* Design elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white/30 -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white/20 translate-x-1/3 translate-y-1/3 blur-3xl"></div>
      </div>
      
      <div className="container relative z-10">
        <AnimationWrapper type="fade-in" duration={800}>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
              Prêt à améliorer votre service client ?
            </h2>
            <p className="mb-8 text-primary-foreground/90 text-lg">
              Rejoignez les entreprises qui font confiance à Top Center pour leur relation client
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-glow group"
              >
                Contactez-nous
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => document.getElementById('devis')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary transition-all duration-300"
              >
                Demander un devis
              </Button>
            </div>
          </div>
        </AnimationWrapper>
      </div>
    </section>
  );
};
