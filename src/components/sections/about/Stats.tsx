
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Users, Award, TrendingUp } from "lucide-react";

export const Stats = () => {
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
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-16">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow bg-card/50 backdrop-blur">
            <CardContent className="p-6 text-center">
              <Icon className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-3xl font-bold text-primary mb-2">{stat.value}</h3>
              <p className="font-medium mb-2">{stat.title}</p>
              <p className="text-sm text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
