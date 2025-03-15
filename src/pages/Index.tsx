import { useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Users, HeadsetIcon, Brain, BarChart, MessageSquare, Bot, Clock, Shield, Globe, Zap, Award, BarChart2, CheckCircle, HelpCircle, ChevronRight } from "lucide-react";

// Chargement différé des sections
const HeroSection = lazy(() => import("@/components/sections/HeroSection"));
const ServicesSection = lazy(() => import("@/components/sections/ServicesSection"));
const CallToActionSection = lazy(() => import("@/components/sections/CallToActionSection"));
const TestimonialsSection = lazy(() => import("@/components/sections/TestimonialsSection"));
const BlogSection = lazy(() => import("@/components/sections/BlogSection"));
const TeamSection = lazy(() => import("@/components/sections/TeamSection"));
const PartnersSection = lazy(() => import("@/components/sections/PartnersSection"));
const SocialMediaSection = lazy(() => import("@/components/sections/SocialMediaSection"));

const Index = () => {
  const navigate = useNavigate();
  const [expandedCards, setExpandedCards] = useState({});

  // Fonction pour basculer l'état d'une carte
  const toggleCard = (index) => {
    setExpandedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  // Micro-interaction : Effet de survol
  const hoverEffect = {
    scale: 1.05,
    transition: { duration: 0.3 },
  };

  return (
    <div>
      {/* Balises meta pour le SEO */}
      <head>
        <title>Solution de Centre d'Appels Nouvelle Génération</title>
        <meta
          name="description"
          content="Découvrez notre solution de centre d'appels innovante, optimisée par l'IA et conçue pour améliorer votre service client."
        />
        <meta
          name="keywords"
          content="centre d'appels, IA, service client, gestion des appels, automatisation"
        />
        <meta name="author" content="Votre Entreprise" />
      </head>

      {/* HeroSection avec image optimisée */}
      <Suspense fallback={<div>Chargement...</div>}>
        <HeroSection>
          <picture>
            <source srcSet="/images/hero-background.webp" type="image/webp" />
            <source srcSet="/images/hero-background.jpg" type="image/jpeg" />
            <img
              src="/images/hero-background.jpg"
              alt="Background de la section hero"
              className="absolute inset-0 w-full h-full object-cover z-0"
              loading="lazy"
            />
          </picture>
        </HeroSection>
      </Suspense>

      {/* Section Nouvelle : Notre Impact */}
      <motion.section
        className="py-16 bg-primary/5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Notre Impact en Chiffres</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Des résultats concrets qui démontrent notre expertise dans la gestion de centres d'appels
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-4">
            {[
              { value: "+5000", label: "Agents formés" },
              { value: "+2M", label: "Appels traités/mois" },
              { value: "+500", label: "Entreprises clientes" },
              { value: "97%", label: "Taux de résolution" },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="text-center"
                variants={fadeInUp}
                whileHover={hoverEffect}
              >
                <div className="text-4xl font-bold text-primary mb-2">{item.value}</div>
                <p className="text-sm text-muted-foreground">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Section des caractéristiques principales */}
      <motion.section
        className="py-16 bg-muted/50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            Solutions de Centre d'Appels Nouvelle Génération
          </h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <HeadsetIcon className="w-10 h-10 text-primary mb-4" />,
                title: "Gestion des Appels",
                description: "Distribution intelligente des appels et suivi en temps réel",
                features: [
                  "File d'attente intelligente",
                  "Routage basé sur les compétences",
                  "Supervision en temps réel",
                  "Historique détaillé",
                ],
                image: "/images/feature-call-management.webp",
              },
              {
                icon: <Brain className="w-10 h-10 text-primary mb-4" />,
                title: "IA & Automatisation",
                description: "Solutions d'IA avancées pour optimiser le service client",
                features: [
                  "Assistant IA en temps réel",
                  "Analyse des sentiments",
                  "Réponses automatisées",
                  "Transcription automatique",
                ],
                image: "/images/feature-ai-automation.webp",
              },
              {
                icon: <BarChart className="w-10 h-10 text-primary mb-4" />,
                title: "Analyse & Reporting",
                description: "Insights détaillés pour améliorer les performances",
                features: [
                  "Tableaux de bord en temps réel",
                  "KPIs personnalisables",
                  "Rapports automatisés",
                  "Analyse prédictive",
                ],
                image: "/images/feature-analytics.webp",
              },
              {
                icon: <Users className="w-10 h-10 text-primary mb-4" />,
                title: "Formation & Support",
                description: "Outils complets pour la formation des agents",
                features: [
                  "Programmes de formation",
                  "Suivi des performances",
                  "Coaching en temps réel",
                  "Base de connaissances",
                ],
                image: "/images/feature-training.webp",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={hoverEffect}
              >
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    {feature.icon}
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <picture>
                      <source srcSet={feature.image} type="image/webp" />
                      <source srcSet={feature.image.replace(".webp", ".jpg")} type="image/jpeg" />
                      <img
                        src={feature.image.replace(".webp", ".jpg")}
                        alt={feature.title}
                        className="w-full h-auto mb-4"
                        loading="lazy"
                      />
                    </picture>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {feature.features
                        .slice(0, expandedCards[index] ? feature.features.length : 2)
                        .map((item, i) => (
                          <li key={i}>• {item}</li>
                        ))}
                    </ul>
                    <Button
                      variant="link"
                      className="mt-4 p-0"
                      onClick={() => toggleCard(index)}
                    >
                      {expandedCards[index] ? "Voir moins" : "En savoir plus"}{" "}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Chargement différé des autres sections */}
      <Suspense fallback={<div>Chargement...</div>}>
        <ServicesSection />
        <TestimonialsSection />
        <TeamSection />
        <BlogSection />
        <PartnersSection />
        <SocialMediaSection />
        <CallToActionSection />
      </Suspense>
    </div>
  );
};

export default Index;
