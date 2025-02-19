
import { Phone, Globe, Shield, Headphones, Users, Server, BookOpen, Network, Briefcase, MessageSquare, Database, Home } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ServicesSection = () => {
  const services = [
    {
      icon: Phone,
      title: "Call Center",
      description: "Gestion des appels entrants et sortants, prospection téléphonique",
      features: [
        "Prospection téléphonique",
        "Assistance client",
        "Support technique",
        "Prise de commandes"
      ]
    },
    {
      icon: Globe,
      title: "Téléphonie d'entreprise",
      description: "Solutions de téléphonie professionnelle avancées",
      features: [
        "Standards téléphoniques IP",
        "Téléphonie cloud",
        "Intégration VoIP",
        "Communications unifiées"
      ]
    },
    {
      icon: Headphones,
      title: "Métiers du Call Center",
      description: "Expertise dans tous les métiers des centres d'appels",
      features: [
        "Téléopérateurs qualifiés",
        "Superviseurs expérimentés",
        "Formateurs spécialisés",
        "Quality managers"
      ]
    },
    {
      icon: Database,
      title: "Solution CRM",
      description: "Gestion complète de la relation client",
      features: [
        "Suivi client personnalisé",
        "Historique des interactions",
        "Analyses prédictives",
        "Automatisation des tâches"
      ]
    },
    {
      icon: MessageSquare,
      title: "Gestion Réseaux Sociaux",
      description: "Gestion professionnelle de votre présence sociale",
      features: [
        "Community management",
        "Modération de contenus",
        "Veille stratégique",
        "Social listening"
      ]
    },
    {
      icon: Network,
      title: "Interconnexion d'Entreprise",
      description: "Solutions de connexion inter-entreprises sécurisées",
      features: [
        "VPN d'entreprise",
        "Réseaux privés",
        "Intégration systèmes",
        "Sécurité avancée"
      ]
    },
    {
      icon: Home,
      title: "Solution de Télétravail",
      description: "Outils et solutions pour le travail à distance",
      features: [
        "Postes virtuels",
        "Collaboration à distance",
        "Sécurité des accès",
        "Support dédié"
      ]
    },
    {
      icon: BookOpen,
      title: "Formation et coaching",
      description: "Formation des équipes en télémarketing et relation client",
      features: [
        "Télémarketing",
        "Relation client",
        "Vente",
        "Coaching d'équipe"
      ]
    },
    {
      icon: Server,
      title: "Services techniques",
      description: "Solutions Vicidial, Asterisk et chatbot IA",
      features: [
        "Vicidial",
        "Asterisk",
        "Chatbot IA",
        "Serveurs mail"
      ]
    },
    {
      icon: Users,
      title: "Solutions entreprises",
      description: "Conseil et assistance personnalisés",
      features: [
        "Conseil stratégique",
        "Secrétariat à distance",
        "Gestion relation client",
        "Solutions sur mesure"
      ]
    }
  ];

  return (
    <section id="services" className="py-20 bg-gradient-to-b from-secondary/5 to-transparent">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Nos Services</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Des solutions complètes pour optimiser votre relation client et développer votre activité
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Icon className="w-12 h-12 text-primary mb-4" />
                  <CardTitle>{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
