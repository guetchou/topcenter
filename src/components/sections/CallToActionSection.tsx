import { Button } from "@/components/ui/button";
import { Phone, Mail, Clock } from "lucide-react";

export const CallToActionSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/10 to-secondary/10">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="p-6 bg-white rounded-lg shadow-lg hover-lift">
            <Phone className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Appelez-nous</h3>
            <p className="text-muted-foreground mb-4">
              Notre équipe est disponible 24/7 pour répondre à vos questions
            </p>
            <Button variant="secondary" className="w-full">
              +242 06 000 0000
            </Button>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-lg hover-lift">
            <Mail className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Écrivez-nous</h3>
            <p className="text-muted-foreground mb-4">
              Envoyez-nous un email, nous vous répondrons rapidement
            </p>
            <Button variant="secondary" className="w-full">
              contact@topcenter.cg
            </Button>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-lg hover-lift">
            <Clock className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Horaires</h3>
            <p className="text-muted-foreground mb-4">
              Service disponible 24h/24 et 7j/7
            </p>
            <Button variant="secondary" className="w-full">
              24/7
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};