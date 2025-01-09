import { Button } from "@/components/ui/button";
import { NewsGrid } from "@/components/NewsGrid";
import { MoveRight, ArrowRight, Globe, Shield, Zap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-r from-primary to-primary/80">
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="mb-6 text-5xl font-bold animate-slide-up">
              Solutions IT Innovantes pour l'Afrique
            </h1>
            <p className="mb-8 text-xl opacity-90 animate-fade-in">
              Top Center accompagne votre transformation numérique avec expertise et innovation
            </p>
            <Button size="lg" variant="secondary" className="animate-fade-in">
              Découvrir nos services <MoveRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
        <div className="absolute inset-0 opacity-10 bg-grid-white" />
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="p-6 transition-all rounded-lg hover:shadow-lg">
              <Globe className="w-12 h-12 mb-4 text-primary" />
              <h3 className="mb-2 text-xl font-semibold">Présence Internationale</h3>
              <p className="text-muted-foreground">
                Une expertise reconnue en Afrique et au-delà
              </p>
            </div>
            <div className="p-6 transition-all rounded-lg hover:shadow-lg">
              <Shield className="w-12 h-12 mb-4 text-primary" />
              <h3 className="mb-2 text-xl font-semibold">Sécurité Maximale</h3>
              <p className="text-muted-foreground">
                Protection avancée de vos données
              </p>
            </div>
            <div className="p-6 transition-all rounded-lg hover:shadow-lg">
              <Zap className="w-12 h-12 mb-4 text-primary" />
              <h3 className="mb-2 text-xl font-semibold">Innovation Continue</h3>
              <p className="text-muted-foreground">
                Toujours à la pointe de la technologie
              </p>
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
              Toutes les actualités <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <NewsGrid />
        </div>
      </section>
    </div>
  );
};

export default Index;