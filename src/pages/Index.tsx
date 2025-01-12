import { Button } from "@/components/ui/button";
import { NewsGrid } from "@/components/NewsGrid";
import { TestimonialSection } from "@/components/TestimonialSection";
import { Building2, Mail, FileText, Phone, MoveRight } from "lucide-react";
import { HeroSection } from "@/components/sections/HeroSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { CallToActionSection } from "@/components/sections/CallToActionSection";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { ServiceViewer3D } from "@/components/ServiceViewer3D";
import { QuoteRequest } from "@/components/QuoteRequest";
import { Footer } from "@/components/Footer";
import { AIAssistant } from "@/components/AIAssistant";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Header/Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b">
        <div className="container flex items-center justify-between h-20">
          <div className="flex items-center gap-2">
            <img 
              src="/logo.png"
              alt="Top Center Logo" 
              className="w-12 h-12 rounded-full object-cover"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Top Center
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#about" className="hover:text-primary transition-colors">À propos</a>
            <a href="#services" className="hover:text-primary transition-colors">Services</a>
            <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              className="hidden md:flex items-center gap-2"
              onClick={() => window.location.href = "tel:+24223456789"}
            >
              <Phone className="w-4 h-4" />
              Appelez
            </Button>
            <Button 
              className="flex items-center gap-2"
              onClick={() => document.getElementById('devis')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <FileText className="w-4 h-4" />
              Demandez devis
            </Button>
          </div>
        </div>
      </header>

      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <ServiceViewer3D />
        <CallToActionSection />

        <section id="devis" className="py-20 bg-gradient-to-b from-secondary/5 to-transparent">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Demandez un devis</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Obtenez une estimation personnalisée pour vos besoins
              </p>
            </div>
            <QuoteRequest />
          </div>
        </section>

        <TestimonialSection />
        <ContactSection />
      </main>

      <Footer />
      
      {/* Assistant IA flottant */}
      <div className="fixed bottom-4 right-4 z-50">
        <AIAssistant />
      </div>
    </div>
  );
};

export default Index;