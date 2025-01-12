import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart, CreditCard, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OnlineSales = () => {
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
        <h1 className="text-4xl font-bold mb-6">Vente en ligne</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-primary" />
              Plateforme de courtage
            </h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Vente de produits et services pour entreprises</li>
              <li>Solutions pour artisans et commerçants</li>
              <li>Interface intuitive et personnalisable</li>
              <li>Gestion des catalogues produits</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-primary" />
              Gestion des paiements
            </h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Paiements via application mobile</li>
              <li>Réseau d'agents de paiement</li>
              <li>Passerelles de paiement intégrées</li>
              <li>Transactions sécurisées</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Truck className="w-6 h-6 text-primary" />
              Suivi et livraison
            </h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Suivi en temps réel des commandes</li>
              <li>Gestion des livraisons</li>
              <li>Notifications automatiques</li>
              <li>Rapports détaillés</li>
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

export default OnlineSales;