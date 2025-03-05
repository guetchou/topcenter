
import { Separator } from "@/components/ui/separator";

export default function PrivacyPolicy() {
  const lastUpdated = "05 mars 2025";

  return (
    <div className="container py-16 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-2">Politique de confidentialité</h1>
      <p className="text-muted-foreground mb-8">Dernière mise à jour: {lastUpdated}</p>
      
      <Separator className="mb-8" />
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">Introduction</h2>
          <p className="text-muted-foreground">
            Chez TopCenter, nous accordons une grande importance à la protection de vos données personnelles. 
            Cette politique de confidentialité explique comment nous collectons, utilisons, partageons et protégeons 
            vos informations lorsque vous utilisez nos services.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4">Collecte des données</h2>
          <p className="text-muted-foreground mb-4">
            Nous collectons les informations que vous nous fournissez directement lorsque vous :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Créez un compte sur notre plateforme</li>
            <li>Remplissez un formulaire de contact ou de devis</li>
            <li>Utilisez nos services téléphoniques</li>
            <li>Participez à nos enquêtes de satisfaction</li>
            <li>Postulez à une offre d'emploi</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4">Utilisation des données</h2>
          <p className="text-muted-foreground mb-4">
            Nous utilisons vos informations personnelles pour :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Fournir, maintenir et améliorer nos services</li>
            <li>Traiter vos demandes et vous contacter</li>
            <li>Personnaliser votre expérience utilisateur</li>
            <li>Analyser l'utilisation de nos services</li>
            <li>Vous envoyer des communications marketing (avec votre consentement)</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4">Protection des données</h2>
          <p className="text-muted-foreground">
            Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées 
            pour protéger vos données personnelles contre tout accès non autorisé, toute modification, 
            divulgation ou destruction. Ces mesures incluent le chiffrement des données, 
            des contrôles d'accès stricts et des audits de sécurité réguliers.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4">Vos droits</h2>
          <p className="text-muted-foreground mb-4">
            Conformément aux lois applicables sur la protection des données, vous disposez des droits suivants :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Droit d'accès à vos données personnelles</li>
            <li>Droit de rectification de vos données</li>
            <li>Droit à l'effacement (droit à l'oubli)</li>
            <li>Droit à la limitation du traitement</li>
            <li>Droit à la portabilité des données</li>
            <li>Droit d'opposition au traitement</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4">Contact</h2>
          <p className="text-muted-foreground">
            Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits, 
            veuillez nous contacter à l'adresse email : privacy@topcenter.com
          </p>
        </section>
      </div>
    </div>
  );
}
