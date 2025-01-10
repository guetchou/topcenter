import { Button } from "@/components/ui/button";
import { NewsGrid } from "@/components/NewsGrid";
import { TestimonialSection } from "@/components/TestimonialSection";
import { 
  MoveRight, 
  Headphones, 
  Phone, 
  MessageSquare, 
  Building2, 
  Mail,
  FileText,
  Minimize,
  Globe, 
  Shield, 
  Zap, 
  Sparkles 
} from "lucide-react";
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
      {/* Header/Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b">
        <div className="container flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img 
              src="https://images.unsplash.com/photo-1501854140801-50d01698950b" 
              alt="Top Center Logo" 
              className="w-12 h-12 rounded-full object-cover"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Top Center
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#services" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Building2 className="w-4 h-4" />
              Nos Services
            </a>
            <a href="#contact" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Mail className="w-4 h-4" />
              Contactez-nous
            </a>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center gap-4">
            <Button variant="outline" className="hidden md:flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Appelez
            </Button>
            <Button className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Demandez devis
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section avec animation améliorée */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-r from-[#403E43] to-[#1A1F2C]">
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
        <div className="absolute inset-0 opacity-10 bg-grid-white" />
      </section>

      {/* Services Section */}
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

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Contactez-nous</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Notre équipe est à votre disposition pour répondre à toutes vos questions
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="p-8 rounded-lg border bg-card">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
                alt="Contact Support"
                className="w-full h-48 object-cover rounded-lg mb-6"
              />
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <span>+242 06 000 0000</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <span>contact@topcenter.cg</span>
                </div>
              </div>
            </div>
            <div className="p-8 rounded-lg border bg-card">
              <img 
                src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
                alt="Services Image"
                className="w-full h-48 object-cover rounded-lg mb-6"
              />
              <div className="space-y-4">
                <Button className="w-full" size="lg">
                  <FileText className="w-4 h-4 mr-2" />
                  Demander un devis
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  <Phone className="w-4 h-4 mr-2" />
                  Nous appeler
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Keep existing sections */}
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
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-4">
        <Button 
          variant="outline"
          size="icon"
          className="bg-white shadow-lg hover:bg-primary hover:text-white"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <Minimize className="w-4 h-4" />
        </Button>
        <AIChatAssistant />
        <ARServicePreview />
      </div>
    </div>
  );
};

export default Index;
