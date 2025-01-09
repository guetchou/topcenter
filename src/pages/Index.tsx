import { Button } from "@/components/ui/button";
import { NewsGrid } from "@/components/NewsGrid";
import { MoveRight, Headphones, Phone, MessageSquare, Globe, Shield, Zap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-r from-[#403E43] to-[#1A1F2C]">
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="mb-6 text-5xl font-bold animate-slide-up">
              Centre d'Appels Omnicanal au Congo
            </h1>
            <p className="mb-8 text-xl opacity-90 animate-fade-in">
              Une expertise complète en gestion de la relation client
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" variant="secondary" className="animate-fade-in">
                Nos services <MoveRight className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="animate-fade-in text-white hover:text-primary">
                Contactez-nous <Phone className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 opacity-10 bg-grid-white" />
      </section>

      {/* Services Section */}
      <section className="py-20 bg-secondary/20">
        <div className="container">
          <h2 className="mb-12 text-3xl font-bold text-center">Nos Services Omnicanaux</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="p-6 transition-all rounded-lg bg-white hover:shadow-lg">
              <Headphones className="w-12 h-12 mb-4 text-primary" />
              <h3 className="mb-2 text-xl font-semibold">Centre d'Appels</h3>
              <p className="text-muted-foreground">
                Service client professionnel 24/7 en plusieurs langues
              </p>
            </div>
            <div className="p-6 transition-all rounded-lg bg-white hover:shadow-lg">
              <MessageSquare className="w-12 h-12 mb-4 text-primary" />
              <h3 className="mb-2 text-xl font-semibold">Chat & Messagerie</h3>
              <p className="text-muted-foreground">
                Support client via chat, email et réseaux sociaux
              </p>
            </div>
            <div className="p-6 transition-all rounded-lg bg-white hover:shadow-lg">
              <Globe className="w-12 h-12 mb-4 text-primary" />
              <h3 className="mb-2 text-xl font-semibold">Services IT</h3>
              <p className="text-muted-foreground">
                Solutions technologiques sur mesure
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="container">
          <div className="grid gap-8 text-center md:grid-cols-4">
            <div className="p-6">
              <h4 className="text-4xl font-bold text-primary">24/7</h4>
              <p className="mt-2 text-muted-foreground">Service Continu</p>
            </div>
            <div className="p-6">
              <h4 className="text-4xl font-bold text-primary">3+</h4>
              <p className="mt-2 text-muted-foreground">Langues Supportées</p>
            </div>
            <div className="p-6">
              <h4 className="text-4xl font-bold text-primary">98%</h4>
              <p className="mt-2 text-muted-foreground">Satisfaction Client</p>
            </div>
            <div className="p-6">
              <h4 className="text-4xl font-bold text-primary">1000+</h4>
              <p className="mt-2 text-muted-foreground">Clients Satisfaits</p>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-20 bg-secondary/50">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold">Actualités</h2>
            <Button variant="outline">
              Toutes les actualités <MoveRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <NewsGrid />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-white bg-gradient-to-r from-[#403E43] to-[#1A1F2C]">
        <div className="container text-center">
          <h2 className="mb-6 text-3xl font-bold">Prêt à améliorer votre service client ?</h2>
          <p className="max-w-2xl mx-auto mb-8 text-lg opacity-90">
            Contactez-nous dès aujourd'hui pour découvrir comment nos solutions peuvent transformer votre relation client.
          </p>
          <Button size="lg" variant="secondary">
            Demander un devis <MoveRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;