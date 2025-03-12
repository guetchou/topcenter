
import { Card, CardContent } from "@/components/ui/card";
import { Flag, Milestone } from "lucide-react";

const timelineEvents = [
  {
    year: 2018,
    title: "Création de TopCenter",
    description: "Lancement officiel de notre centre d'appels à Brazzaville"
  },
  {
    year: 2019,
    title: "Premier Partenariat Majeur",
    description: "Signature avec des opérateurs télécom nationaux"
  },
  {
    year: 2020,
    title: "Expansion des Services",
    description: "Lancement du support client multicanal"
  },
  {
    year: 2023,
    title: "Innovation Technologique",
    description: "Intégration de l'IA dans nos services"
  }
];

export const TimelineSection = () => {
  return (
    <section className="py-12 bg-background">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-2">
            <Milestone className="w-6 h-6" />
            Notre Histoire
          </h2>

          <div className="space-y-8">
            {timelineEvents.map((event, index) => (
              <Card 
                key={event.year}
                className={`relative ${
                  index % 2 === 0 ? 'ml-8' : 'ml-8'
                } hover:shadow-lg transition-all duration-300`}
              >
                <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Flag className="w-4 h-4 text-primary-foreground" />
                </div>
                <CardContent className="p-6">
                  <div className="font-bold text-xl mb-2">{event.year}</div>
                  <div className="font-semibold mb-1">{event.title}</div>
                  <div className="text-muted-foreground">{event.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
