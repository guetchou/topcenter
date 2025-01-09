import { useState } from "react";
import { motion } from "framer-motion";
import { Box, Phone, Headphones, Code, Shield } from "lucide-react";

const services = [
  {
    icon: Phone,
    title: "Centre d'Appels",
    description: "Service client professionnel 24/7"
  },
  {
    icon: Headphones,
    title: "Support Multicanal",
    description: "Communication sur tous les canaux"
  },
  {
    icon: Code,
    title: "Solutions IT",
    description: "Développement sur mesure"
  },
  {
    icon: Shield,
    title: "Sécurité",
    description: "Protection des données"
  }
];

export const ServiceViewer3D = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="relative h-[400px] perspective-1000">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full max-w-4xl">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={index}
                  className={`p-6 rounded-xl backdrop-blur-md ${
                    activeIndex === index
                      ? "bg-gradient-to-br from-primary/20 to-secondary/20"
                      : "bg-white/10"
                  }`}
                  whileHover={{ scale: 1.05, rotateY: 180 }}
                  onClick={() => setActiveIndex(index)}
                >
                  <Icon className="w-8 h-8 mb-4 text-primary" />
                  <h3 className="mb-2 font-semibold">{service.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {service.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};