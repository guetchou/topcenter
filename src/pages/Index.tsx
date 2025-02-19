
import { Button } from "@/components/ui/button";
import { NewsGrid } from "@/components/NewsGrid";
import { TestimonialSection } from "@/components/TestimonialSection";
import { Building2, Mail, FileText, Phone, MoveRight, User, GraduationCap } from "lucide-react";
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
import { ScrollToTop } from "@/components/ScrollToTop";
import { SearchFilter } from "@/components/SearchFilter";
import { TeamSection } from "@/components/sections/TeamSection";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log("Recherche:", query);
  };

  const handleFilter = (category: string) => {
    setSelectedCategory(category);
    console.log("Filtrer par catégorie:", category);
  };

  return (
    <div className="min-h-screen">
      {/* Header/Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b">
        <div className="container flex items-center justify-between h-20">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/94200422-356e-4b69-8e4c-c385cc1eb543.png"
              alt="Logo" 
              className="h-12 object-contain"
            />
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#about" className="hover:text-primary transition-colors">À propos</a>
            <a href="#services" className="hover:text-primary transition-colors">Services</a>
            <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
            <a href="/training" className="hover:text-primary transition-colors">Formation</a>
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
            {isAuthenticated ? (
              <Button 
                className="flex items-center gap-2"
                onClick={() => navigate("/dashboard")}
              >
                <User className="w-4 h-4" />
                Mon compte
              </Button>
            ) : (
              <Button 
                className="flex items-center gap-2"
                onClick={() => navigate("/auth")}
              >
                <User className="w-4 h-4" />
                Connexion
              </Button>
            )}
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
        <TeamSection />
        
        {/* Section Formation */}
        <section className="py-20 bg-gradient-to-b from-secondary/5 to-transparent">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Formation Professionnelle</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Développez vos compétences avec nos formations spécialisées
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    Formations en direct
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Participez à nos sessions de formation en direct avec nos experts
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="ghost" 
                    className="w-full"
                    onClick={() => navigate("/training")}
                  >
                    Voir les sessions
                    <MoveRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Ressources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Accédez à notre bibliothèque de ressources pédagogiques
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="ghost" 
                    className="w-full"
                    onClick={() => navigate("/training")}
                  >
                    Explorer
                    <MoveRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    Certification
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Obtenez des certifications reconnues dans votre domaine
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="ghost" 
                    className="w-full"
                    onClick={() => navigate("/training")}
                  >
                    En savoir plus
                    <MoveRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
        
        <section className="py-20">
          <div className="container">
            <SearchFilter onSearch={handleSearch} onFilter={handleFilter} />
          </div>
        </section>
        
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
      
      <div className="fixed bottom-4 right-4 z-50">
        <AIAssistant />
      </div>

      <ScrollToTop />
    </div>
  );
};

export default Index;
