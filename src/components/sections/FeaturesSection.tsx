
import { Check, Phone, Calendar, MessageSquare, Clock } from "lucide-react";

export const FeaturesSection = () => {
  return (
    <section className="py-20 bg-secondary/5">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Nos Services</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Des solutions innovantes pour optimiser votre relation client
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="p-6 bg-card rounded-lg shadow-sm">
            <Phone className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Centre d'appel</h3>
            <p className="text-muted-foreground">Service client professionnel disponible 24/7</p>
          </div>
          
          <div className="p-6 bg-card rounded-lg shadow-sm">
            <Calendar className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Rendez-vous</h3>
            <p className="text-muted-foreground">Planification simple et efficace</p>
          </div>
          
          <div className="p-6 bg-card rounded-lg shadow-sm">
            <MessageSquare className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Chat en direct</h3>
            <p className="text-muted-foreground">Assistance instantanée avec IA</p>
          </div>
          
          <div className="p-6 bg-card rounded-lg shadow-sm">
            <Clock className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Support 24/7</h3>
            <p className="text-muted-foreground">Toujours là quand vous en avez besoin</p>
          </div>
        </div>
      </div>
    </section>
  );
};
