
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const faqs = [
  {
    question: "Qu'est-ce qu'un centre d'appels externalisé ?",
    answer: "Un centre d'appels externalisé est un service qui gère les communications téléphoniques d'une entreprise à distance. Il peut gérer les appels entrants et sortants, le support client, et d'autres formes de communication client."
  },
  {
    question: "Quels sont les avantages d'externaliser son centre d'appels ?",
    answer: "L'externalisation permet de réduire les coûts opérationnels, d'accéder à une expertise spécialisée, d'améliorer la qualité du service client, d'augmenter la flexibilité opérationnelle et de se concentrer sur votre cœur de métier."
  },
  {
    question: "TopCenter propose-t-il des services en plusieurs langues ?",
    answer: "Oui, TopCenter propose des services multilingues avec des agents formés pour communiquer en français, anglais et dans plusieurs langues locales africaines."
  },
  {
    question: "Comment assurez-vous la qualité du service ?",
    answer: "Nous mettons en place des systèmes rigoureux de contrôle qualité, incluant des écoutes d'appels, des évaluations régulières, des formations continues pour nos agents et des rapports détaillés pour nos clients."
  },
  {
    question: "Quels types d'entreprises peuvent bénéficier de vos services ?",
    answer: "Nos services s'adressent à une large gamme d'entreprises : opérateurs télécom, banques et assurances, e-commerce, services publics, santé, tourisme et hôtellerie, etc."
  },
  {
    question: "Comment démarrer une collaboration avec TopCenter ?",
    answer: "Le processus commence par une consultation initiale pour comprendre vos besoins. Nous établissons ensuite un cahier des charges, formons une équipe dédiée, et lançons le service après une phase de test. Contactez-nous pour débuter."
  },
  {
    question: "Quelle est la différence entre les appels entrants et sortants ?",
    answer: "Les appels entrants sont initiés par les clients (service client, support technique, etc.), tandis que les appels sortants sont initiés par le centre d'appels (prospection, enquêtes, relances, etc.)."
  },
  {
    question: "Proposez-vous des solutions temporaires pour les pics d'activité ?",
    answer: "Oui, nous offrons des solutions flexibles pour gérer les pics d'activité saisonniers ou les campagnes ponctuelles, avec une capacité d'adaptation rapide aux volumes d'appels."
  }
];

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filtrer les FAQ basées sur la recherche
  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">Questions fréquentes</h1>
        
        <div className="relative mb-8">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher une question..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Accordion type="single" collapsible className="w-full">
          {filteredFaqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {filteredFaqs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              Aucune question ne correspond à votre recherche.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
