import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const CallToActionSection = () => {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
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
            >
              Contactez-nous
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => document.getElementById('devis')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              Demander un devis
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};