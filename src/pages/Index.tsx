import { Button } from "@/components/ui/button";
import { NewsGrid } from "@/components/NewsGrid";
import { TestimonialSection } from "@/components/TestimonialSection";
import { Building2, Mail, FileText, Phone, MoveRight } from "lucide-react";
import { HeroSection } from "@/components/sections/HeroSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { CallToActionSection } from "@/components/sections/CallToActionSection";
import { NewsSearch } from "@/components/NewsSearch";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { ServiceViewer3D } from "@/components/ServiceViewer3D";
import { QuoteRequest } from "@/components/QuoteRequest";
import { Footer } from "@/components/Footer";

const Index = () => {
  const handleNewsSearch = (query: string) => {
    console.log("Searching news:", query);
  };

  return (
    <div className="min-h-screen">
      {/* Header/Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b">
        <div className="container flex items-center justify-between h-20">
          <div className="flex items-center gap-2">
            <img 
              src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81" 
              alt="Top Center Logo" 
              className="w-12 h-12 rounded-full object-cover"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Top Center
            </span>
          </div>

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

      <main>
        <HeroSection />
        <ServicesSection />
        <ServiceViewer3D />
        <CallToActionSection />

        {/* Section Devis */}
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

        {/* Actualités Section */}
        <section className="py-20 bg-gradient-to-b from-secondary/5 to-transparent">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Actualités</h2>
              <Button variant="outline" className="group hover-lift">
                Toutes les actualités 
                <MoveRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
            <NewsSearch onSearch={handleNewsSearch} />
            <NewsGrid />
            <div className="mt-12">
              <NewsletterSignup />
            </div>
          </div>
        </section>

        <ContactSection />
        <TestimonialSection />
      </main>

      <Footer />
    </div>
  );
};

export default Index;