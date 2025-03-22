
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Network, Lock, Cloud, GraduationCap, CheckCircle2 } from "lucide-react";

export const Services = () => {
  const services = [
    {
      icon: Phone,
      title: "Centre d'appels & Relation client",
      items: [
        "Support client & assistance technique",
        "Télévente & prospection",
        "Prise de rendez-vous",
        "Service après-vente & enquêtes de satisfaction"
      ]
    },
    {
      icon: Network,
      title: "Téléphonie d'entreprise & interconnexion",
      items: [
        "Standard téléphonique (PABX / IPBX / VoIP)",
        "Interconnexion d'entreprises",
        "Solutions de télétravail"
      ]
    },
    {
      icon: Lock,
      title: "Cybersécurité & Sécurisation",
      items: [
        "Protection des appels & données",
        "Audit & conseil en cybersécurité",
        "Détection & prévention des cyberattaques"
      ]
    },
    {
      icon: Cloud,
      title: "Digitalisation & solutions cloud",
      items: [
        "CRM & ERP",
        "Automatisation & intégration API",
        "Plateforme de vente en ligne"
      ]
    },
    {
      icon: GraduationCap,
      title: "Formation & Conseil",
      items: [
        "Formations professionnelles",
        "Conseil stratégique",
        "Transformation digitale"
      ]
    }
  ];

  return (
    <div className="mb-16">
      <h3 className="text-2xl font-bold text-center mb-8">Nos Services</h3>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => {
          const Icon = service.icon;
          return (
            <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow bg-card/50 backdrop-blur">
              <CardContent className="p-6">
                <Icon className="w-8 h-8 text-primary mb-4" />
                <h4 className="text-xl font-semibold mb-4">{service.title}</h4>
                <ul className="space-y-2">
                  {service.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-1" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
