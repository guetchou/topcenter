import { Button } from "@/components/ui/button";
import { NewsGrid } from "@/components/NewsGrid";
import { TestimonialSection } from "@/components/TestimonialSection";
import { Building2, Mail, FileText, Phone, MoveRight } from "lucide-react";
import { HeroSection } from "@/components/sections/HeroSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { NewsSearch } from "@/components/NewsSearch";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { AppointmentScheduler } from "@/components/AppointmentScheduler";
import { LiveChat } from "@/components/LiveChat";
import { DynamicFAQ } from "@/components/DynamicFAQ";
import { Footer } from "@/components/Footer";

const Index = () => {
  const handleNewsSearch = (query: string) => {
    console.log("Searching news:", query);
    // Implement search logic here
  };

  return (
    <div className="min-h-screen">
      {/* Header/Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b">
        <div className="container flex items-center justify-between h-20">
          {/* Logo */}
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

      <HeroSection />
      <ServicesSection />

      {/* Actualités Section with Search */}
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

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Questions fréquentes</h2>
            <p className="text-muted-foreground">
              Trouvez rapidement les réponses à vos questions
            </p>
          </div>
          <DynamicFAQ />
        </div>
      </section>

      <TestimonialSection />
      <Footer />

      {/* Floating Components */}
      <AppointmentScheduler />
      <LiveChat />
    </div>
  );
};

export default Index;