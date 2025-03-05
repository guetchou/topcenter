
import { Separator } from "@/components/ui/separator";

export default function Terms() {
  const lastUpdated = "05 mars 2025";

  return (
    <div className="container py-16 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-2">Conditions d'utilisation</h1>
      <p className="text-muted-foreground mb-8">Dernière mise à jour: {lastUpdated}</p>
      
      <Separator className="mb-8" />
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">1. Acceptation des conditions</h2>
          <p className="text-muted-foreground">
            En accédant et en utilisant les services de TopCenter, vous acceptez d'être lié par ces conditions 
            d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4">2. Description des services</h2>
          <p className="text-muted-foreground">
            TopCenter fournit des services de centre d'appels, de support client, de vente téléphonique et de 
            solutions de téléphonie d'entreprise. Nous nous réservons le droit de modifier, suspendre ou 
            interrompre tout aspect de nos services à tout moment.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4">3. Comptes utilisateurs</h2>
          <p className="text-muted-foreground">
            Certains services peuvent nécessiter la création d'un compte. Vous êtes responsable de maintenir 
            la confidentialité de vos informations de connexion et de toutes les activités qui se produisent 
            sous votre compte. Vous acceptez de nous informer immédiatement de toute utilisation non autorisée 
            de votre compte.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4">4. Propriété intellectuelle</h2>
          <p className="text-muted-foreground">
            Tout le contenu présent sur notre site web, y compris les textes, graphiques, logos, icônes, 
            images, clips audio, téléchargements numériques et compilations de données, est la propriété 
            de TopCenter et est protégé par les lois sur la propriété intellectuelle.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4">5. Limitation de responsabilité</h2>
          <p className="text-muted-foreground">
            TopCenter ne sera pas responsable des dommages directs, indirects, accessoires, spéciaux ou 
            consécutifs résultant de l'utilisation ou de l'impossibilité d'utiliser nos services, même 
            si nous avons été informés de la possibilité de tels dommages.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4">6. Indemnisation</h2>
          <p className="text-muted-foreground">
            Vous acceptez de défendre, d'indemniser et de tenir TopCenter indemne de toute réclamation, 
            dommage, obligation, perte, responsabilité, coût ou dette, et dépense résultant de votre 
            utilisation de nos services.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4">7. Modifications des conditions</h2>
          <p className="text-muted-foreground">
            Nous nous réservons le droit de modifier ces conditions d'utilisation à tout moment. Les 
            modifications entreront en vigueur immédiatement après leur publication sur notre site web. 
            Votre utilisation continue de nos services après de telles modifications constitue votre 
            acceptation des nouvelles conditions.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4">8. Loi applicable</h2>
          <p className="text-muted-foreground">
            Ces conditions sont régies par les lois de la République du Congo. Tout litige relatif à 
            ces conditions sera soumis à la juridiction exclusive des tribunaux de Brazzaville.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4">9. Contact</h2>
          <p className="text-muted-foreground">
            Pour toute question concernant ces conditions d'utilisation, veuillez nous contacter à 
            l'adresse email : legal@topcenter.com
          </p>
        </section>
      </div>
    </div>
  );
}
