import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone, Headphones, Users, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Breadcrumbs } from "@/components/Breadcrumbs";

const CallCenter = () => {
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
        <h1 className="text-4xl font-bold mb-6">Centre d'Appels</h1>
        
        <div className="prose prose-lg max-w-none mb-8">
          <p className="lead text-xl text-muted-foreground">
            Notre centre d'appels offre des solutions complètes pour gérer votre relation client 
            avec professionnalisme et efficacité.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
            <Phone className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Appels Sortants</h3>
            <p className="text-muted-foreground">
              Prospection commerciale et campagnes d'appels ciblées
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
            <Headphones className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Support Client</h3>
            <p className="text-muted-foreground">
              Assistance technique et service après-vente
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
            <Users className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Équipe Dédiée</h3>
            <p className="text-muted-foreground">
              Agents qualifiés et formés à votre activité
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Nos Services Détaillés</h2>
            <div className="grid gap-4">
              <div className="p-4 rounded-lg border bg-card">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-primary" />
                  Gestion des appels sortants
                </h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Prospection téléphonique</li>
                  <li>Campagnes de vente</li>
                  <li>Enquêtes de satisfaction</li>
                  <li>Campagnes marketing</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg border bg-card">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Headphones className="w-5 h-5 text-primary" />
                  Support client
                </h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Assistance technique 24/7</li>
                  <li>Service après-vente</li>
                  <li>Gestion des réclamations</li>
                  <li>Support multilingue</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg border bg-card">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Services spécialisés
                </h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Migration SIM 3G vers 4G</li>
                  <li>Gestion des rendez-vous</li>
                  <li>Services de télémarketing</li>
                  <li>Relance commerciale</li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-12 flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Prêt à améliorer votre service client ?
          </h2>
          <Button size="lg" onClick={() => navigate("/contact")} className="min-w-[200px]">
            Contactez-nous
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CallCenter;