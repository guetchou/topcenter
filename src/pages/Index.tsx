import { Button } from "@/components/ui/button";
import { NewsGrid } from "@/components/NewsGrid";
import { TestimonialSection } from "@/components/TestimonialSection";
import { MoveRight, Headphones, Phone, MessageSquare, Globe, Shield, Zap, Sparkles } from "lucide-react";
import { AIChatAssistant } from "@/components/AIChatAssistant";
import { ServiceViewer3D } from "@/components/ServiceViewer3D";
import { RealTimeStats } from "@/components/RealTimeStats";
import { ARServicePreview } from "@/components/ARServicePreview";
import { VoiceAnalytics } from "@/components/VoiceAnalytics";
import { RealTimeTranslation } from "@/components/RealTimeTranslation";
import { AIPrediction } from "@/components/AIPrediction";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section avec animation améliorée */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-r from-[#403E43] to-[#1A1F2C]">
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="inline-block mb-4 animate-bounce-subtle">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h1 className="mb-6 text-5xl font-bold animate-slide-up">
              Centre d'Appels Omnicanal au Congo
            </h1>
            <p className="mb-8 text-xl opacity-90 animate-fade-in">
              Une expertise complète en gestion de la relation client
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" variant="secondary" className="animate-fade-in hover-lift group">
                Nos services 
                <MoveRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline" className="animate-fade-in text-white hover:text-primary hover-lift">
                Contactez-nous 
                <Phone className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 opacity-10 bg-grid-white" />
      </section>

      {/* Services 3D Section */}
      <section className="py-20 bg-gradient-to-b from-secondary/5 to-transparent">
        <div className="container">
          <h2 className="mb-12 text-3xl font-bold text-center">
            Découvrez Nos Services en 3D
          </h2>
          <ServiceViewer3D />
        </div>
      </section>

      {/* Real-time Analytics Section */}
      <section className="py-20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container">
          <h2 className="mb-12 text-3xl font-bold text-center">
            Performance en Temps Réel
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <RealTimeStats />
            <AIPrediction />
          </div>
        </div>
      </section>

      {/* Voice & Translation Section */}
      <section className="py-20 bg-gradient-to-b from-secondary/5 to-transparent">
        <div className="container">
          <h2 className="mb-12 text-3xl font-bold text-center">
            Technologies Intelligentes
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <VoiceAnalytics />
            <RealTimeTranslation />
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container">
          <div className="grid gap-8 text-center md:grid-cols-4">
            <div className="p-6 hover-scale">
              <h4 className="text-4xl font-bold text-primary animate-pulse-glow">24/7</h4>
              <p className="mt-2 text-muted-foreground">Service Continu</p>
            </div>
            <div className="p-6 hover-scale">
              <h4 className="text-4xl font-bold text-primary animate-pulse-glow">3+</h4>
              <p className="mt-2 text-muted-foreground">Langues Supportées</p>
            </div>
            <div className="p-6 hover-scale">
              <h4 className="text-4xl font-bold text-primary animate-pulse-glow">98%</h4>
              <p className="mt-2 text-muted-foreground">Satisfaction Client</p>
            </div>
            <div className="p-6 hover-scale">
              <h4 className="text-4xl font-bold text-primary animate-pulse-glow">1000+</h4>
              <p className="mt-2 text-muted-foreground">Clients Satisfaits</p>
            </div>
          </div>
        </div>
      </section>

      <TestimonialSection />

      <section className="py-20 bg-gradient-to-b from-secondary/5 to-transparent">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold">Actualités</h2>
            <Button variant="outline" className="group hover-lift">
              Toutes les actualités 
              <MoveRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
          <NewsGrid />
        </div>
      </section>

      <section className="py-20 text-white bg-gradient-to-r from-[#403E43] to-[#1A1F2C]">
        <div className="container text-center">
          <div className="inline-block mb-6 animate-bounce-subtle">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h2 className="mb-6 text-3xl font-bold">Prêt à améliorer votre service client ?</h2>
          <p className="max-w-2xl mx-auto mb-8 text-lg opacity-90">
            Contactez-nous dès aujourd'hui pour découvrir comment nos solutions peuvent transformer votre relation client.
          </p>
          <Button size="lg" variant="secondary" className="hover-lift group">
            Demander un devis 
            <MoveRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Floating Components */}
      <AIChatAssistant />
      <ARServicePreview />
    </div>
  );
};

export default Index;
