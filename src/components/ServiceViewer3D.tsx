
import { useState } from "react";
import { Phone, Globe, Shield, Headphones, Users, Clock } from "lucide-react";

const services = [
  {
    icon: Phone,
    title: "Centre d'Appels",
    description: "Service client professionnel 24/7"
  },
  {
    icon: Globe,
    title: "Support Multilingue",
    description: "Communication sans frontières"
  },
  {
    icon: Shield,
    title: "Sécurité Garantie",
    description: "Protection des données assurée"
  },
  {
    icon: Headphones,
    title: "Support Multicanal",
    description: "Communication sur tous les canaux"
  },
  {
    icon: Users,
    title: "Équipe Dédiée",
    description: "Agents qualifiés à votre service"
  },
  {
    icon: Clock,
    title: "Disponibilité 24/7",
    description: "Service continu sans interruption"
  }
];

export const ServiceViewer3D = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="relative py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Nos Services en Détail</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez notre gamme complète de services professionnels
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className={`p-6 rounded-xl transition-all duration-300 hover:scale-105 ${
                  activeIndex === index
                    ? "bg-gradient-to-br from-primary/20 to-secondary/20"
                    : "bg-white/10"
                }`}
                onClick={() => setActiveIndex(index)}
              >
                <Icon className="w-12 h-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-muted-foreground">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
