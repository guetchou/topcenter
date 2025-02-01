import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone, Settings, Shield, Radio, Server, Wifi } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Breadcrumbs } from "@/components/Breadcrumbs";

const TelephonySystem = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-8">
      <Button
        variant="ghost"
        className="group mb-8"
        onClick={() => navigate("/services")}
      >
        <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
        Retour aux services
      </Button>

      <Breadcrumbs />

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Système de Téléphonie</h1>
        
        <div className="prose prose-lg max-w-none mb-8">
          <p className="lead text-xl text-muted-foreground">
            Des solutions de téléphonie professionnelle adaptées à vos besoins,
            avec une technologie de pointe et un support expert.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
            <Server className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Infrastructure</h3>
            <p className="text-muted-foreground">
              Solutions robustes et évolutives
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
            <Shield className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Sécurité</h3>
            <p className="text-muted-foreground">
              Communications cryptées et sécurisées
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
            <Wifi className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Connectivité</h3>
            <p className="text-muted-foreground">
              Solutions VoIP haute performance
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Nos Solutions Téléphoniques</h2>
            <div className="grid gap-4">
              <div className="p-4 rounded-lg border bg-card">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-primary" />
                  Standards téléphoniques
                </h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Centraux téléphoniques IP</li>
                  <li>Téléphonie cloud</li>
                  <li>Solutions hybrides</li>
                  <li>Intégration CRM</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg border bg-card">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Radio className="w-5 h-5 text-primary" />
                  Communications unifiées
                </h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Messagerie instantanée</li>
                  <li>Visioconférence</li>
                  <li>Partage de documents</li>
                  <li>Présence en ligne</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg border bg-card">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  Support et maintenance
                </h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Supervision 24/7</li>
                  <li>Maintenance préventive</li>
                  <li>Support technique dédié</li>
                  <li>Mises à jour régulières</li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-12 flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Besoin d'une solution téléphonique professionnelle ?
          </h2>
          <Button size="lg" onClick={() => navigate("/contact")} className="min-w-[200px]">
            Parlons de votre projet
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TelephonySystem;