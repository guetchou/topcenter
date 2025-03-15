import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { HeroSection } from "@/components/sections/HeroSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { CallToActionSection } from "@/components/sections/CallToActionSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { BlogSection } from "@/components/sections/BlogSection";
import { TeamSection } from "@/components/sections/TeamSection";
import { PartnersSection } from "@/components/sections/PartnersSection";
import { SocialMediaSection } from "@/components/sections/SocialMediaSection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Users, HeadsetIcon, Brain, BarChart, MessageSquare, Bot, Clock, Shield, Globe, Zap, Award, BarChart2, CheckCircle } from "lucide-react";
import { EventsCalendarSection } from "@/components/sections/EventsCalendarSection";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Section Hero : Présentation principale */}
      <HeroSection />

      {/* Section : Calendrier des Événements */}
  <EventsCalendarSection />

      {/* Section : Notre Impact en Chiffres */}
      <section className="py-16 bg-primary/5">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Notre Impact en Chiffres</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Des résultats concrets qui démontrent notre expertise dans la gestion de centres d'appels
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-4">
            {/* Métrique 1 */}
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">+5000</div>
              <p className="text-sm text-muted-foreground">Agents formés</p>
            </div>
            {/* Métrique 2 */}
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">+2M</div>
              <p className="text-sm text-muted-foreground">Appels traités/mois</p>
            </div>
            {/* Métrique 3 */}
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">+500</div>
              <p className="text-sm text-muted-foreground">Entreprises clientes</p>
            </div>
            {/* Métrique 4 */}
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">97%</div>
              <p className="text-sm text-muted-foreground">Taux de résolution</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section : Solutions de Centre d'Appels Nouvelle Génération */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            Solutions de Centre d'Appels Nouvelle Génération
          </h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Carte 1 : Gestion des Appels */}
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

            {/* Carte 2 : IA & Automatisation */}
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

            {/* Carte 3 : Analyse & Reporting */}
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

            {/* Carte 4 : Formation & Support */}
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

      {/* Section : Métriques Clés */}
      <section className="py-16">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-4">
            {/* Métrique 1 : Taux de disponibilité */}
            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <Phone className="w-8 h-8 mb-2" />
                <CardTitle className="text-2xl">99.9%</CardTitle>
                <CardDescription className="text-primary-foreground/80">
                  Taux de disponibilité
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Métrique 2 : Support client */}
            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <MessageSquare className="w-8 h-8 mb-2" />
                <CardTitle className="text-2xl">24/7</CardTitle>
                <CardDescription className="text-primary-foreground/80">
                  Support client
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Métrique 3 : Satisfaction client */}
            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <Bot className="w-8 h-8 mb-2" />
                <CardTitle className="text-2xl">95%</CardTitle>
                <CardDescription className="text-primary-foreground/80">
                  Satisfaction client
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Métrique 4 : Temps de réponse moyen */}
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

      {/* Section : Certifications & Accréditations */}
      <section className="py-16 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Certifications & Accréditations</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Nos certifications garantissent la qualité et la sécurité de nos services
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Certification 1 : ISO 27001 */}
            <Card className="text-center hover-lift">
              <CardHeader>
                <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>ISO 27001</CardTitle>
                <CardDescription>
                  Sécurité de l'information
                </CardDescription>
              </CardHeader>
            </Card>
            {/* Certification 2 : ISO 9001 */}
            <Card className="text-center hover-lift">
              <CardHeader>
                <Award className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>ISO 9001</CardTitle>
                <CardDescription>
                  Management de la qualité
                </CardDescription>
              </CardHeader>
            </Card>
            {/* Certification 3 : PCI DSS */}
            <Card className="text-center hover-lift">
              <CardHeader>
                <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>PCI DSS</CardTitle>
                <CardDescription>
                  Sécurité des données bancaires
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Section : Services */}
      <ServicesSection />

      {/* Section : Témoignages */}
      <TestimonialsSection />

      {/* Section : Équipe */}
      <TeamSection />

      {/* Section : Blog */}
      <BlogSection />

      {/* Section : Partenaires */}
      <PartnersSection />

      {/* Section : Réseaux Sociaux */}
      <SocialMediaSection />

      {/* Section : Technologies de Pointe */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Technologies de Pointe</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Des solutions innovantes pour optimiser votre service client
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-4">
            {/* Technologie 1 : IA Conversationnelle */}
            <Card className="hover-lift">
              <CardHeader>
                <Zap className="w-8 h-8 text-primary mb-4" />
                <CardTitle>IA Conversationnelle</CardTitle>
                <CardDescription>
                  Réponses intelligentes et contextuelles
                </CardDescription>
              </CardHeader>
            </Card>
            {/* Technologie 2 : Omnicanal */}
            <Card className="hover-lift">
              <CardHeader>
                <Globe className="w-8 h-8 text-primary mb-4" />
                <CardTitle>Omnicanal</CardTitle>
                <CardDescription>
                  Intégration multiplateforme seamless
                </CardDescription>
              </CardHeader>
            </Card>
            {/* Technologie 3 : Analytics Avancé */}
            <Card className="hover-lift">
              <CardHeader>
                <BarChart2 className="w-8 h-8 text-primary mb-4" />
                <CardTitle>Analytics Avancé</CardTitle>
                <CardDescription>
                  Insights et prédictions en temps réel
                </CardDescription>
              </CardHeader>
            </Card>
            {/* Technologie 4 : Automatisation */}
            <Card className="hover-lift">
              <CardHeader>
                <Bot className="w-8 h-8 text-primary mb-4" />
                <CardTitle>Automatisation</CardTitle>
                <CardDescription>
                  Processus optimisés et efficaces
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Section : Pourquoi Choisir Notre Solution */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            Pourquoi Choisir Notre Solution
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Raison 1 : Expertise Métier */}
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <HeadsetIcon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expertise Métier</h3>
              <p className="text-muted-foreground">
                Plus de 10 ans d'expérience dans la gestion de centres d'appels
              </p>
            </div>

            {/* Raison 2 : Technologie Avancée */}
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Technologie Avancée</h3>
              <p className="text-muted-foreground">
                Solutions d'IA et d'automatisation de pointe
              </p>
            </div>

            {/* Raison 3 : Support Dédié */}
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

      {/* Section : Call to Action */}
      <CallToActionSection />
    </div>
  );
};

export default Index;
