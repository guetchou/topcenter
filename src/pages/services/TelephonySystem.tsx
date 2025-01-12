import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone, Hash, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Standard téléphonique</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Phone className="w-6 h-6 text-primary" />
              Gestion des standards
            </h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Installation et configuration des standards</li>
              <li>Maintenance et support technique</li>
              <li>Formation des utilisateurs</li>
              <li>Solutions personnalisées</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Hash className="w-6 h-6 text-primary" />
              Numéros spéciaux
            </h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Gestion des numéros courts</li>
              <li>Configuration des numéros spéciaux</li>
              <li>Routage intelligent des appels</li>
              <li>Statistiques d'utilisation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Settings className="w-6 h-6 text-primary" />
              Support technique
            </h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Configuration de la téléphonie interne</li>
              <li>Maintenance préventive</li>
              <li>Support 24/7</li>
              <li>Mises à jour système</li>
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

export default TelephonySystem;