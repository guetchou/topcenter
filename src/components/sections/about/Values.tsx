
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Rocket, Shield, Users2, Smartphone, Globe } from "lucide-react";

export const Values = () => {
  const values = [
    {
      icon: CheckCircle2,
      title: "Excellence",
      description: "Un service de qualité basé sur des équipes qualifiées et des technologies performantes"
    },
    {
      icon: Rocket,
      title: "Innovation",
      description: "Intégration des dernières technologies : téléphonie VoIP, solutions cloud, automatisation, IA"
    },
    {
      icon: Shield,
      title: "Sécurité",
      description: "Protection des communications et des données grâce à des solutions avancées de cybersécurité"
    },
    {
      icon: Users2,
      title: "Proximité",
      description: "Une approche adaptée aux réalités des entreprises locales et internationales"
    },
    {
      icon: Smartphone,
      title: "Flexibilité",
      description: "Des solutions personnalisables pour s'adapter aux besoins de chaque entreprise"
    },
    {
      icon: Globe,
      title: "Éthique",
      description: "Engagement envers une gestion responsable des interactions et des données clients"
    }
  ];

  return (
    <div className="mb-16">
      <h3 className="text-2xl font-bold text-center mb-8">Nos Valeurs</h3>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {values.map((value, index) => {
          const Icon = value.icon;
          return (
            <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow bg-card/50 backdrop-blur">
              <CardContent className="p-6">
                <Icon className="w-8 h-8 text-primary mb-4" />
                <h4 className="text-xl font-semibold mb-2">{value.title}</h4>
                <p className="text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
