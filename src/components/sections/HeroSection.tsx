import { Button } from "@/components/ui/button";
import { MoveRight, Phone } from "lucide-react";

export const HeroSection = () => {
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
            <Button size="lg" variant="secondary" className="animate-fade-in hover-lift group">
              Nos services 
              <MoveRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" className="animate-fade-in text-white hover:text-primary hover-lift">
              Contactez-nous 
              <Phone className="w-4 h-4" />
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