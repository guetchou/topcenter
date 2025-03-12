
import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Users, Headphones, Timer } from "lucide-react";

const stats = [
  {
    id: 1,
    label: "Appels Traités",
    value: 150000,
    icon: Phone,
    suffix: "+"
  },
  {
    id: 2,
    label: "Clients Satisfaits",
    value: 5000,
    icon: Users,
    suffix: "+"
  },
  {
    id: 3,
    label: "Heures de Support",
    value: 24,
    icon: Headphones,
    suffix: "/7"
  },
  {
    id: 4,
    label: "Temps Moyen de Réponse",
    value: 45,
    icon: Timer,
    suffix: "s"
  }
];

export const StatsSection = () => {
  const [counters, setCounters] = useState(stats.map(() => 0));

  useEffect(() => {
    stats.forEach((stat, index) => {
      const increment = stat.value / 50;
      let current = 0;
      
      const timer = setInterval(() => {
        if (current < stat.value) {
          current = Math.min(current + increment, stat.value);
          setCounters(prev => {
            const newCounters = [...prev];
            newCounters[index] = Math.round(current);
            return newCounters;
          });
        } else {
          clearInterval(timer);
        }
      }, 50);

      return () => clearInterval(timer);
    });
  }, []);

  return (
    <section className="py-12 bg-muted/50">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={stat.id} className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold">
                      {counters[index]}
                      {stat.suffix}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
