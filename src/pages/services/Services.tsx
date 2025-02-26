
import { Phone, Headphones, Clock, MessageSquare, BarChart3, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Services = () => {
  const services = [
    {
      icon: Phone,
      title: "Centre d'appels",
      description: "Service client professionnel 24/7 avec des agents formés",
      details: "Gestion des appels entrants et sortants, suivi qualité, reporting en temps réel"
    },
    {
      icon: Headphones,
      title: "Support technique",
      description: "Assistance technique multilingue",
      details: "Résolution des problèmes, maintenance préventive, documentation technique"
    },
    {
      icon: Clock,
      title: "Service 24/7",
      description: "Disponibilité permanente pour vos clients",
      details: "Couverture complète, équipes en rotation, gestion des urgences"
    },
    {
      icon: MessageSquare,
      title: "Chat en direct",
      description: "Communication instantanée multicanale",
      details: "WhatsApp, Messenger, chat web, réponses personnalisées"
    },
    {
      icon: BarChart3,
      title: "Analyse des données",
      description: "Insights et rapports détaillés",
      details: "KPIs, tableaux de bord, recommandations d'amélioration"
    },
    {
      icon: Users,
      title: "Formation",
      description: "Programmes de formation personnalisés",
      details: "Développement des compétences, certifications, évaluation continue"
    }
  ];

  return (
    <div className="py-12 container">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Nos Services</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Des solutions professionnelles pour optimiser votre relation client et développer votre activité
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <service.icon className="h-8 w-8 text-primary mb-2" />
              <CardTitle>{service.title}</CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{service.details}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Services;
