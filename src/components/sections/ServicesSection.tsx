import { Headphones, Globe, Shield } from "lucide-react";

export const ServicesSection = () => {
  return (
    <section id="services" className="py-20 bg-gradient-to-b from-secondary/5 to-transparent">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Nos Services</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez notre gamme complète de services innovants pour améliorer votre relation client
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="p-6 rounded-lg border bg-card hover-lift">
            <Headphones className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Centre d'Appels</h3>
            <p className="text-muted-foreground">Service client professionnel 24/7</p>
          </div>
          <div className="p-6 rounded-lg border bg-card hover-lift">
            <Globe className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Support Multilingue</h3>
            <p className="text-muted-foreground">Communication sans frontières</p>
          </div>
          <div className="p-6 rounded-lg border bg-card hover-lift">
            <Shield className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Sécurité Garantie</h3>
            <p className="text-muted-foreground">Protection des données assurée</p>
          </div>
        </div>
      </div>
    </section>
  );
};