import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Services Call Center</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Gestion des appels sortants</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Prospection téléphonique</li>
              <li>Campagnes de vente</li>
              <li>Enquêtes de satisfaction</li>
              <li>Campagnes marketing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Gestion des appels entrants</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Assistance client 24/7</li>
              <li>Support technique</li>
              <li>Prise de commandes</li>
              <li>Service après-vente</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Services spécialisés</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Migration SIM 3G vers 4G</li>
              <li>Gestion des rendez-vous</li>
              <li>Services de télémarketing</li>
              <li>Relance commerciale</li>
            </ul>
          </section>
        </div>

        <div className="mt-12">
          <Button size="lg" onClick={() => navigate("/contact")}>
            Contactez-nous pour en savoir plus
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CallCenter;