
import { 
  Calendar, 
  Trophy, 
  Milestone, 
  HelpCircle, 
  Target, 
  BarChart2,
  Zap,
  CheckCircle2,
  MapPin
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoyaltySection } from "@/components/sections/LoyaltySection";
import { EventsCalendarSection } from "@/components/sections/EventsCalendarSection";
import { TimelineSection } from "@/components/sections/TimelineSection";
import { RealTimeStats } from "@/components/RealTimeStats";

// Sample data for events calendar
const sampleEvents = [
  {
    id: 1,
    title: "Formation des agents",
    date: new Date(),
    type: "formation" as const
  },
  {
    id: 2,
    title: "Séminaire sur l'IA",
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
    type: "seminaire" as const
  },
  {
    id: 3,
    title: "Atelier Service Client",
    date: new Date(new Date().setDate(new Date().getDate() + 5)),
    type: "atelier" as const
  }
];

export const CompanyInfoSection = () => {
  return (
    <section className="py-16 bg-secondary/5">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">
          Découvrez TopCenter
        </h2>
        
        <Tabs defaultValue="loyalty" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-1">
              <TabsTrigger value="loyalty" className="flex gap-2 items-center">
                <Trophy className="h-4 w-4 text-amber-400" />
                <span className="hidden md:inline">Programme de fidélité</span>
              </TabsTrigger>
              <TabsTrigger value="events" className="flex gap-2 items-center">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span className="hidden md:inline">Calendrier</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex gap-2 items-center">
                <Milestone className="h-4 w-4 text-green-500" />
                <span className="hidden md:inline">Notre Histoire</span>
              </TabsTrigger>
              <TabsTrigger value="why" className="flex gap-2 items-center">
                <HelpCircle className="h-4 w-4 text-purple-500" />
                <span className="hidden md:inline">Pourquoi Nous Choisir</span>
              </TabsTrigger>
              <TabsTrigger value="targets" className="flex gap-2 items-center">
                <Target className="h-4 w-4 text-red-500" />
                <span className="hidden md:inline">Secteurs Cibles</span>
              </TabsTrigger>
              <TabsTrigger value="solutions" className="flex gap-2 items-center">
                <Zap className="h-4 w-4 text-orange-500" />
                <span className="hidden md:inline">Solutions Digitales</span>
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex gap-2 items-center">
                <BarChart2 className="h-4 w-4 text-indigo-500" />
                <span className="hidden md:inline">Statistiques</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="loyalty" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-400" />
                  Programme de fidélité
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-[500px] overflow-y-auto">
                  <LoyaltySection />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="events" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  Calendrier des Événements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-[500px] overflow-y-auto">
                  <EventsCalendarSection events={sampleEvents} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Milestone className="h-5 w-5 text-green-500" />
                  Notre Histoire
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-[500px] overflow-y-auto">
                  <TimelineSection />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="why" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-purple-500" />
                  Pourquoi Choisir TopCenter ?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      icon: <CheckCircle2 className="h-8 w-8 text-primary" />,
                      title: "Excellence",
                      description: "Un service de qualité basé sur des équipes qualifiées et des technologies performantes"
                    },
                    {
                      icon: <Zap className="h-8 w-8 text-primary" />,
                      title: "Innovation",
                      description: "Intégration des dernières technologies : téléphonie VoIP, solutions cloud, automatisation, IA"
                    },
                    {
                      icon: <Trophy className="h-8 w-8 text-primary" />,
                      title: "Expertise éprouvée",
                      description: "En gestion de la relation client et télécommunications depuis plus de 10 ans"
                    },
                    {
                      icon: <Calendar className="h-8 w-8 text-primary" />,
                      title: "Disponibilité 24/7",
                      description: "Service client disponible à tout moment pour répondre à vos besoins"
                    },
                    {
                      icon: <Target className="h-8 w-8 text-primary" />,
                      title: "Solutions personnalisées",
                      description: "Adaptées à vos besoins spécifiques et à votre secteur d'activité"
                    },
                    {
                      icon: <MapPin className="h-8 w-8 text-primary" />,
                      title: "Ancrage local",
                      description: "Une parfaite connaissance du marché congolais et africain"
                    }
                  ].map((item, i) => (
                    <Card key={i} className="border border-primary/10">
                      <CardContent className="pt-6">
                        <div className="mb-4">{item.icon}</div>
                        <h3 className="text-xl font-medium mb-2">{item.title}</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="targets" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-red-500" />
                  Secteurs Cibles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[
                    "Banques & Assurances",
                    "Télécommunications",
                    "Commerce & Distribution",
                    "Santé & Pharmacie",
                    "Transport & Logistique",
                    "Secteur Public",
                    "Tourisme & Hôtellerie",
                    "Énergie & Ressources"
                  ].map((sector, i) => (
                    <Card key={i} className="border border-primary/10">
                      <CardContent className="flex items-center justify-center p-4 h-24">
                        <p className="text-center font-medium">{sector}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="solutions" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-orange-500" />
                  Solutions Digitales Avancées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      title: "Centre d'appels intelligent",
                      description: "Plateforme omnicanale avec IA pour un service client exceptionnel",
                      features: ["Téléphonie VoIP", "Chatbots IA", "Analyse prédictive"]
                    },
                    {
                      title: "CRM & Gestion Client",
                      description: "Solutions intégrées pour une gestion efficace de vos clients",
                      features: ["Historique centralisé", "Segmentation clients", "Automatisation marketing"]
                    },
                    {
                      title: "Solutions Cloud",
                      description: "Infrastructure cloud sécurisée et performante",
                      features: ["Stockage sécurisé", "Collaboration en temps réel", "Sauvegarde automatisée"]
                    },
                    {
                      title: "Cybersécurité",
                      description: "Protection avancée contre les menaces numériques",
                      features: ["Audit de sécurité", "Protection des données", "Formation du personnel"]
                    }
                  ].map((solution, i) => (
                    <Card key={i} className="border border-primary/10">
                      <CardContent className="pt-6">
                        <h3 className="text-xl font-medium mb-2">{solution.title}</h3>
                        <p className="text-muted-foreground mb-4">{solution.description}</p>
                        <ul className="space-y-2">
                          {solution.features.map((feature, j) => (
                            <li key={j} className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-primary" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="stats" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart2 className="h-5 w-5 text-indigo-500" />
                  Statistiques en Temps Réel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RealTimeStats />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};
