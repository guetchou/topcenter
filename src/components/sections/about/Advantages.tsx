
import { Card, CardContent } from "@/components/ui/card";
import { Diamond, Network, MessageSquare, Rocket, Shield } from "lucide-react";

export const Advantages = () => {
  const advantages = [
    {
      icon: Diamond,
      title: "Une expertise éprouvée",
      description: "En gestion de la relation client et télécommunications"
    },
    {
      icon: Network,
      title: "Infrastructure moderne",
      description: "Solutions VoIP, PABX et télétravail"
    },
    {
      icon: MessageSquare,
      title: "Approche omnicanale",
      description: "Appels, SMS, email, WhatsApp, chatbots"
    },
    {
      icon: Rocket,
      title: "Innovation continue",
      description: "CRM, ERP, IA, API de paiement"
    },
    {
      icon: Shield,
      title: "Sécurité maximale",
      description: "Solutions conformes aux normes de cybersécurité"
    }
  ];

  return (
    <div className="mb-16">
      <h3 className="text-2xl font-bold text-center mb-8">Pourquoi Choisir Top Center ?</h3>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {advantages.map((advantage, index) => {
          const Icon = advantage.icon;
          return (
            <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow bg-card/50 backdrop-blur">
              <CardContent className="p-6">
                <Icon className="w-8 h-8 text-primary mb-4" />
                <h4 className="text-xl font-semibold mb-2">{advantage.title}</h4>
                <p className="text-muted-foreground">{advantage.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
