
import React from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { MoveRight, PhoneCall, Mail, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function HomeNew() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleContactClick = () => {
    navigate("/contact");
    toast({
      title: "Contact",
      description: "Vous allez être redirigé vers notre page de contact.",
    });
  };

  const handleQuoteRequest = () => {
    navigate("/devis");
    toast({
      title: "Demande de devis",
      description: "Remplissez le formulaire pour obtenir un devis personnalisé.",
    });
  };

  return (
    <>
      <Helmet>
        <title>TopCenter - Centre d'Appels Professionnel (Nouveau)</title>
        <meta
          name="description"
          content="TopCenter, votre partenaire en solutions de centre d'appels et services clients personnalisés en République du Congo et Afrique centrale."
        />
      </Helmet>

      <main className="bg-background font-sans">
        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-r from-primary/90 to-primary/70">
          <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1519389950473-47ba0277781c')] bg-cover bg-center" />
          
          <div className="container relative z-10 py-16">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
                  Centre d'Appels <br />
                  <span className="text-accent-foreground">Nouvelle Génération</span>
                </h1>
                
                <p className="text-lg text-white/90 mt-6 mb-8 max-w-xl">
                  Optimisez votre relation client grâce à notre technologie omnicanale alimentée par l'IA. Performance, innovation et excellence au service de votre entreprise.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    variant="secondary"
                    className="group"
                    onClick={handleContactClick}
                  >
                    Nous contacter
                    <MoveRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-white bg-transparent text-white hover:bg-white/10"
                    onClick={handleQuoteRequest}
                  >
                    Demander un devis
                  </Button>
                </div>
              </div>

              <div className="hidden md:block">
                <img 
                  src="/lovable-uploads/agent-topcenter1.png" 
                  alt="Agent TopCenter" 
                  className="w-full max-w-md mx-auto rounded-lg shadow-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              {[
                { label: "Agents Formés", value: "120+", icon: "👨‍💼" },
                { label: "Clients Satisfaits", value: "350+", icon: "🏆" },
                { label: "Appels par Jour", value: "2500+", icon: "📞" },
                { label: "Solutions IA", value: "15+", icon: "🤖" }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-white/10"
                >
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-white/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-accent/5">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Nos Services</h2>
              <p className="text-muted-foreground mt-2">Solutions complètes pour optimiser votre relation client</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Centre d'Appels Externalisé",
                  description: "Bénéficiez d'une équipe d'agents formés pour gérer vos appels entrants et sortants.",
                  icon: <PhoneCall className="h-10 w-10 text-primary" />
                },
                {
                  title: "Service Client Multicanal",
                  description: "Gérez vos interactions clients via téléphone, email, chat et réseaux sociaux.",
                  icon: <Mail className="h-10 w-10 text-primary" />
                },
                {
                  title: "Formation d'Agents",
                  description: "Formez vos équipes aux meilleures pratiques de la relation client.",
                  icon: <Users className="h-10 w-10 text-primary" />
                }
              ].map((service, index) => (
                <div 
                  key={index}
                  className="bg-card p-6 rounded-lg shadow-sm border border-border hover:shadow-md transition-shadow"
                >
                  <div className="mb-4">{service.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4">Prêt à améliorer votre service client ?</h2>
            <p className="mb-8 max-w-2xl mx-auto">
              Rejoignez les entreprises qui font confiance à TopCenter pour leur relation client
            </p>
            <Button 
              variant="secondary" 
              size="lg"
              onClick={handleQuoteRequest}
            >
              Demander un devis
              <MoveRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </section>
      </main>
    </>
  );
}
