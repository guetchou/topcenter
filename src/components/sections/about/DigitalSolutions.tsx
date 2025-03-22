
import { Card, CardContent } from "@/components/ui/card";
import { Bot, MessageSquare, Bell, BarChart3, CheckCircle2 } from "lucide-react";

export const DigitalSolutions = () => {
  const digitalSolutions = [
    {
      icon: Bot,
      title: "Chatbots & Assistance Virtuelle",
      description: "Automatisation intelligente du support client 24/7",
      features: [
        "Réponses automatisées multilingues",
        "Apprentissage continu",
        "Support client 24/7"
      ]
    },
    {
      icon: MessageSquare,
      title: "CRM & Gestion Client",
      description: "Solutions intégrées de gestion client",
      features: [
        "Historique centralisé",
        "Suivi des interactions",
        "Tableaux de bord personnalisés"
      ]
    },
    {
      icon: Bell,
      title: "Notifications Automatisées",
      description: "Communication multicanale proactive",
      features: [
        "SMS transactionnels",
        "Emails personnalisés",
        "Messages WhatsApp"
      ]
    },
    {
      icon: BarChart3,
      title: "Analyse & Reporting",
      description: "Insights pour une meilleure décision",
      features: [
        "Tableaux de bord en temps réel",
        "Analyse prédictive",
        "Rapports personnalisés"
      ]
    }
  ];

  return (
    <div className="mb-16">
      <h3 className="text-2xl font-bold text-center mb-8">Solutions Digitales Avancées</h3>
      <div className="grid gap-8 md:grid-cols-2">
        {digitalSolutions.map((solution, index) => {
          const Icon = solution.icon;
          return (
            <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold mb-2">{solution.title}</h4>
                    <p className="text-muted-foreground mb-4">{solution.description}</p>
                    <ul className="space-y-2">
                      {solution.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
