import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart, CreditCard, Truck, Globe, Shield, Headset } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Breadcrumbs } from "@/components/Breadcrumbs";

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

      <Breadcrumbs />

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Vente en Ligne</h1>
        
        <div className="prose prose-lg max-w-none mb-8">
          <p className="lead text-xl text-muted-foreground">
            Des solutions e-commerce complètes pour développer votre activité en ligne
            et maximiser vos ventes.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
            <Globe className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Présence En Ligne</h3>
            <p className="text-muted-foreground">
              Solutions e-commerce personnalisées
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
            <Shield className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Paiement Sécurisé</h3>
            <p className="text-muted-foreground">
              Transactions sûres et fiables
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
            <Headset className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Support 24/7</h3>
            <p className="text-muted-foreground">
              Assistance client permanente
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Nos Solutions E-commerce</h2>
            <div className="grid gap-4">
              <div className="p-4 rounded-lg border bg-card">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-primary" />
                  Plateforme de vente
                </h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Interface personnalisable</li>
                  <li>Gestion des produits</li>
                  <li>Statistiques de vente</li>
                  <li>Intégration multicanal</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg border bg-card">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Solutions de paiement
                </h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Paiement mobile</li>
                  <li>Cartes bancaires</li>
                  <li>Paiement à la livraison</li>
                  <li>Transactions sécurisées</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg border bg-card">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-primary" />
                  Logistique et livraison
                </h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Suivi des commandes</li>
                  <li>Gestion des stocks</li>
                  <li>Livraison express</li>
                  <li>Retours facilités</li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-12 flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Prêt à lancer votre boutique en ligne ?
          </h2>
          <Button size="lg" onClick={() => navigate("/contact")} className="min-w-[200px]">
            Demander un devis
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnlineSales;