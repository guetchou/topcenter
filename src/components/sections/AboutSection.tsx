import { Card } from "@/components/ui/card";
import { Building2, Users, Award, TrendingUp } from "lucide-react";

export const AboutSection = () => {
  const stats = [
    {
      icon: Building2,
      title: "Années d'expérience",
      value: "10+",
      description: "Dans la relation client"
    },
    {
      icon: Users,
      title: "Clients satisfaits",
      value: "500+",
      description: "À travers l'Afrique"
    },
    {
      icon: Award,
      title: "Taux de satisfaction",
      value: "98%",
      description: "Clients satisfaits"
    },
    {
      icon: TrendingUp,
      title: "Appels traités",
      value: "1M+",
      description: "Par an"
    }
  ];

  return (
    <section id="about" className="py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">À propos de Top Center</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Leader dans la gestion de la relation client en Afrique centrale, 
            nous offrons des solutions innovantes et personnalisées pour votre entreprise.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <Icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-2xl font-bold mb-2">{stat.value}</h3>
                <p className="font-semibold mb-2">{stat.title}</p>
                <p className="text-sm text-muted-foreground">{stat.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};