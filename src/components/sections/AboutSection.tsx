
import { Card, CardContent } from "@/components/ui/card";
import { Stats } from "./about/Stats";
import { Values } from "./about/Values";
import { Services } from "./about/Services";
import { DigitalSolutions } from "./about/DigitalSolutions";
import { Sectors } from "./about/Sectors";
import { Advantages } from "./about/Advantages";
import { MapLocation } from "./about/MapLocation";
import { Mission } from "./about/Mission";

export const AboutSection = () => {
  return (
    <section className="py-20 space-y-20 bg-gradient-to-b from-background to-secondary/5">
      <div className="container">
        {/* Introduction */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold tracking-tight">À propos de Top Center</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
            Top Center est une entreprise spécialisée dans la gestion de la relation client, 
            l'externalisation des services commerciaux, la téléphonie d'entreprise, 
            la cybersécurité et les solutions digitales avancées.
          </p>
        </div>

        {/* Statistiques */}
        <Stats />

        {/* Notre mission */}
        <Mission />

        {/* Nos valeurs */}
        <Values />

        {/* Nos services */}
        <Services />

        {/* Solutions Digitales */}
        <DigitalSolutions />

        {/* Secteurs cibles */}
        <Sectors />

        {/* Pourquoi nous choisir */}
        <Advantages />

        {/* Localisation */}
        <MapLocation />
      </div>
    </section>
  );
};
