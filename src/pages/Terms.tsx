
import { Breadcrumbs } from "@/components/Breadcrumbs";

export default function Terms() {
  return (
    <div className="container py-8">
      <Breadcrumbs />
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Conditions d'utilisation</h1>
        
        <div className="prose prose-lg max-w-none">
          <h2>1. Acceptation des conditions</h2>
          <p>
            En accédant à ce site web, vous acceptez d'être lié par ces conditions d'utilisation, toutes les lois et réglementations applicables, et vous acceptez que vous êtes responsable du respect des lois locales applicables. Si vous n'acceptez pas l'une de ces conditions, vous êtes interdit d'utiliser ou d'accéder à ce site.
          </p>
          
          <h2>2. Licence d'utilisation</h2>
          <p>
            La permission est accordée de télécharger temporairement une copie des documents sur le site web de TopCenter pour un affichage transitoire personnel et non commercial uniquement. Il s'agit de l'octroi d'une licence, et non d'un transfert de titre, et sous cette licence, vous ne pouvez pas :
          </p>
          <ul>
            <li>Modifier ou copier les documents</li>
            <li>Utiliser les documents à des fins commerciales ou pour toute présentation publique</li>
            <li>Tenter de décompiler ou d'effectuer de l'ingénierie inverse de tout logiciel contenu sur le site web de TopCenter</li>
            <li>Supprimer tout droit d'auteur ou autres notations de propriété des documents</li>
            <li>Transférer les documents à une autre personne ou 'miroiter' les documents sur tout autre serveur</li>
          </ul>
          
          <h2>3. Clause de non-responsabilité</h2>
          <p>
            Les documents sur le site web de TopCenter sont fournis 'tels quels'. TopCenter ne donne aucune garantie, expresse ou implicite, et décline et nie par la présente toutes les autres garanties, y compris, sans limitation, les garanties implicites ou les conditions de qualité marchande, d'adéquation à un usage particulier, ou de non-violation de la propriété intellectuelle ou autre violation des droits.
          </p>
          
          <h2>4. Limitations</h2>
          <p>
            En aucun cas, TopCenter ou ses fournisseurs ne seront responsables de dommages (y compris, sans limitation, les dommages pour perte de données ou de profit, ou en raison d'une interruption d'activité) découlant de l'utilisation ou de l'impossibilité d'utiliser les matériaux sur le site web de TopCenter, même si TopCenter ou un représentant autorisé de TopCenter a été informé verbalement ou par écrit de la possibilité de tels dommages.
          </p>
          
          <h2>5. Révisions et erreurs</h2>
          <p>
            Les documents apparaissant sur le site web de TopCenter peuvent inclure des erreurs techniques, typographiques ou photographiques. TopCenter ne garantit pas que les documents de son site web sont exacts, complets ou à jour. TopCenter peut apporter des modifications aux documents contenus sur son site web à tout moment sans préavis.
          </p>
          
          <h2>6. Liens</h2>
          <p>
            TopCenter n'a pas examiné tous les sites liés à son site internet et n'est pas responsable du contenu de ces sites liés. L'inclusion de tout lien n'implique pas l'approbation par TopCenter du site. L'utilisation de tout site web lié est aux risques et périls de l'utilisateur.
          </p>
          
          <h2>7. Modifications des conditions d'utilisation</h2>
          <p>
            TopCenter peut réviser ces conditions d'utilisation de son site web à tout moment sans préavis. En utilisant ce site web, vous acceptez d'être lié par la version actuelle de ces conditions d'utilisation.
          </p>
          
          <h2>8. Loi applicable</h2>
          <p>
            Toute réclamation relative au site web de TopCenter sera régie par les lois de la République du Congo sans égard à ses dispositions en matière de conflit de lois.
          </p>
          
          <p className="font-semibold mt-8">
            Ces conditions sont effectives à partir du 1er juin 2023.
          </p>
        </div>
      </div>
    </div>
  );
}
