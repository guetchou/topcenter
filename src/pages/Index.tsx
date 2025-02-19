
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { HeroSection } from "@/components/sections/HeroSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { CallToActionSection } from "@/components/sections/CallToActionSection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Users, HeadsetIcon, Brain, BarChart, MessageSquare, Bot, Clock } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div>
      <HeroSection />

      {/* Section des caractéristiques principales */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            Solutions de Centre d'Appels Nouvelle Génération
          </h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <HeadsetIcon className="w-10 h-10 text-primary mb-4" />
                <CardTitle>Gestion des Appels</CardTitle>
                <CardDescription>
                  Distribution intelligente des appels et suivi en temps réel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• File d'attente intelligente</li>
                  <li>• Routage basé sur les compétences</li>
                  <li>• Supervision en temps réel</li>
                  <li>• Historique détaillé</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Brain className="w-10 h-10 text-primary mb-4" />
                <CardTitle>IA & Automatisation</CardTitle>
                <CardDescription>
                  Solutions d'IA avancées pour optimiser le service client
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Assistant IA en temps réel</li>
                  <li>• Analyse des sentiments</li>
                  <li>• Réponses automatisées</li>
                  <li>• Transcription automatique</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart className="w-10 h-10 text-primary mb-4" />
                <CardTitle>Analyse & Reporting</CardTitle>
                <CardDescription>
                  Insights détaillés pour améliorer les performances
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Tableaux de bord en temps réel</li>
                  <li>• KPIs personnalisables</li>
                  <li>• Rapports automatisés</li>
                  <li>• Analyse prédictive</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="w-10 h-10 text-primary mb-4" />
                <CardTitle>Formation & Support</CardTitle>
                <CardDescription>
                  Outils complets pour la formation des agents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Programmes de formation</li>
                  <li>• Suivi des performances</li>
                  <li>• Coaching en temps réel</li>
                  <li>• Base de connaissances</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section des métriques clés */}
      <section className="py-16">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-4">
            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <Phone className="w-8 h-8 mb-2" />
                <CardTitle className="text-2xl">99.9%</CardTitle>
                <CardDescription className="text-primary-foreground/80">
                  Taux de disponibilité
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <MessageSquare className="w-8 h-8 mb-2" />
                <CardTitle className="text-2xl">24/7</CardTitle>
                <CardDescription className="text-primary-foreground/80">
                  Support client
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <Bot className="w-8 h-8 mb-2" />
                <CardTitle className="text-2xl">95%</CardTitle>
                <CardDescription className="text-primary-foreground/80">
                  Satisfaction client
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <Clock className="w-8 h-8 mb-2" />
                <CardTitle className="text-2xl">&lt; 30s</CardTitle>
                <CardDescription className="text-primary-foreground/80">
                  Temps de réponse moyen
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <ServicesSection />

      {/* Section des avantages */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            Pourquoi Choisir Notre Solution
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <HeadsetIcon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expertise Métier</h3>
              <p className="text-muted-foreground">
                Plus de 10 ans d'expérience dans la gestion de centres d'appels
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Technologie Avancée</h3>
              <p className="text-muted-foreground">
                Solutions d'IA et d'automatisation de pointe
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Support Dédié</h3>
              <p className="text-muted-foreground">
                Équipe de support technique disponible 24/7
              </p>
            </div>
          </div>
        </div>
      </section>

      <CallToActionSection />
    </div>
  );
};

export default Index;
