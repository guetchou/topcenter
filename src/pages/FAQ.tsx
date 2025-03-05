
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQ() {
  return (
    <div className="container py-16 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">Questions fréquemment posées</h1>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Quels services proposez-vous ?</AccordionTrigger>
          <AccordionContent>
            TopCenter propose des services complets de centre d'appels, incluant le support client, les ventes téléphoniques, les enquêtes de satisfaction, et des solutions de téléphonie d'entreprise avancées adaptées aux besoins spécifiques de votre activité.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-2">
          <AccordionTrigger>Comment demander un devis personnalisé ?</AccordionTrigger>
          <AccordionContent>
            Vous pouvez demander un devis personnalisé en remplissant notre formulaire sur la page Devis, ou en nous contactant directement par téléphone. Nous vous proposerons une solution adaptée à vos besoins et à votre budget.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-3">
          <AccordionTrigger>Proposez-vous des services bilingues ?</AccordionTrigger>
          <AccordionContent>
            Oui, nos agents sont formés pour communiquer en français et en anglais. Nous pouvons également proposer d'autres langues sur demande pour répondre aux besoins spécifiques de votre clientèle.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-4">
          <AccordionTrigger>Comment garantissez-vous la qualité de service ?</AccordionTrigger>
          <AccordionContent>
            Nous assurons la qualité de nos services grâce à un recrutement rigoureux, des formations régulières, un suivi continu des performances et des évaluations de satisfaction. Chaque appel est analysé pour garantir une amélioration constante de notre service.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-5">
          <AccordionTrigger>Quelles technologies utilisez-vous ?</AccordionTrigger>
          <AccordionContent>
            Nous utilisons des technologies de pointe comme des systèmes CRM avancés, des plateformes omnicanales, et des outils d'analyse alimentés par l'IA. Notre infrastructure technique est constamment mise à jour pour offrir le meilleur service possible.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-6">
          <AccordionTrigger>Comment rejoindre votre équipe ?</AccordionTrigger>
          <AccordionContent>
            Vous pouvez consulter nos offres d'emploi sur notre page Recrutement et y postuler directement. Nous recherchons régulièrement des talents motivés et orientés service client pour rejoindre notre équipe dynamique.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
