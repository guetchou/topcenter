
import { Breadcrumbs } from "@/components/Breadcrumbs";

export default function PrivacyPolicy() {
  return (
    <div className="container py-8">
      <Breadcrumbs />
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Politique de confidentialité</h1>
        
        <div className="prose prose-lg max-w-none">
          <p>
            Cette politique de confidentialité définit la manière dont TopCenter collecte, utilise et protège les informations que vous nous fournissez lorsque vous utilisez notre site internet et nos services.
          </p>
          
          <h2>Collecte d'informations</h2>
          <p>
            Nous pouvons collecter les informations suivantes :
          </p>
          <ul>
            <li>Nom et prénom</li>
            <li>Coordonnées professionnelles</li>
            <li>Adresse email et numéro de téléphone</li>
            <li>Information démographique</li>
            <li>Informations relatives à vos préférences et centres d'intérêt</li>
            <li>Autres informations pertinentes pour les enquêtes et/ou offres</li>
          </ul>
          
          <h2>Utilisation des informations</h2>
          <p>
            Nous utilisons ces informations pour mieux comprendre vos besoins et vous fournir un meilleur service, notamment pour :
          </p>
          <ul>
            <li>La tenue de registres internes</li>
            <li>L'amélioration de nos produits et services</li>
            <li>L'envoi d'emails promotionnels sur de nouveaux produits ou autres informations</li>
            <li>Des contacts occasionnels à des fins d'études de marché</li>
          </ul>
          
          <h2>Sécurité</h2>
          <p>
            Nous nous engageons à assurer la sécurité de vos informations. Afin d'empêcher tout accès non autorisé ou divulgation, nous avons mis en place des procédures physiques, électroniques et managériales pour sauvegarder et sécuriser les informations que nous collectons en ligne.
          </p>
          
          <h2>Cookies</h2>
          <p>
            Notre site web utilise des cookies pour améliorer l'expérience utilisateur. Un cookie est un petit fichier qui demande la permission d'être placé sur le disque dur de votre ordinateur. Ces cookies nous permettent de suivre la fréquentation de notre site et de comprendre les préférences de nos utilisateurs.
          </p>
          
          <h2>Liens vers d'autres sites</h2>
          <p>
            Notre site peut contenir des liens vers d'autres sites d'intérêt. Cependant, une fois que vous avez utilisé ces liens pour quitter notre site, vous devez noter que nous n'avons aucun contrôle sur cet autre site. Par conséquent, nous ne pouvons être responsables de la protection et de la confidentialité des informations que vous fournissez lors de la visite de tels sites.
          </p>
          
          <h2>Contrôle de vos informations personnelles</h2>
          <p>
            Vous pouvez limiter la collecte ou l'utilisation de vos informations personnelles de la manière suivante :
          </p>
          <ul>
            <li>Si vous avez déjà accepté que nous utilisions vos informations personnelles à des fins de marketing direct, vous pouvez changer d'avis à tout moment en nous écrivant ou en nous envoyant un email</li>
            <li>Vous pouvez demander des détails sur les informations personnelles que nous détenons sur vous</li>
          </ul>
          
          <p>
            Nous ne vendrons, ne distribuerons ni ne louerons vos informations personnelles à des tiers, sauf si nous avons votre permission ou si la loi nous y oblige.
          </p>
          
          <h2>Modifications de notre politique</h2>
          <p>
            Nous pouvons modifier cette politique de temps à autre en mettant à jour cette page. Vous devriez consulter cette page régulièrement pour vous assurer que vous êtes satisfait des changements.
          </p>
          
          <p className="font-semibold mt-8">
            Cette politique est effective à partir du 1er juin 2023.
          </p>
        </div>
      </div>
    </div>
  );
}
