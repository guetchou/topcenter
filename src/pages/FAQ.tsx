
import { usePageContent } from "@/hooks/usePageContent";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DynamicFAQ } from "@/components/DynamicFAQ";
import { ApiContentWrapper } from "@/components/ApiContentWrapper";
import { Helmet } from "react-helmet-async";

const FAQ = () => {
  const { data: pageContent, isLoading, error, refetch } = usePageContent('faq');

  const FAQContent = ({ data }: { data: any }) => {
    const faqItems = data.content?.questions || [
      { question: "Quels services proposez-vous ?", 
        answer: "TopCenter propose des services complets de centre d'appels, incluant le support client, les ventes téléphoniques, les enquêtes de satisfaction, et des solutions de téléphonie d'entreprise avancées adaptées aux besoins spécifiques de votre activité." },
      { question: "Comment demander un devis personnalisé ?", 
        answer: "Vous pouvez demander un devis personnalisé en remplissant notre formulaire sur la page Devis, ou en nous contactant directement par téléphone. Nous vous proposerons une solution adaptée à vos besoins et à votre budget." },
      { question: "Proposez-vous des services bilingues ?", 
        answer: "Oui, nos agents sont formés pour communiquer en français et en anglais. Nous pouvons également proposer d'autres langues sur demande pour répondre aux besoins spécifiques de votre clientèle." },
      { question: "Comment garantissez-vous la qualité de service ?", 
        answer: "Nous assurons la qualité de nos services grâce à un recrutement rigoureux, des formations régulières, un suivi continu des performances et des évaluations de satisfaction. Chaque appel est analysé pour garantir une amélioration constante de notre service." },
      { question: "Quelles technologies utilisez-vous ?", 
        answer: "Nous utilisons des technologies de pointe comme des systèmes CRM avancés, des plateformes omnicanales, et des outils d'analyse alimentés par l'IA. Notre infrastructure technique est constamment mise à jour pour offrir le meilleur service possible." },
      { question: "Comment rejoindre votre équipe ?", 
        answer: "Vous pouvez consulter nos offres d'emploi sur notre page Recrutement et y postuler directement. Nous recherchons régulièrement des talents motivés et orientés service client pour rejoindre notre équipe dynamique." }
    ];

    return (
      <div className="container py-16 max-w-3xl mx-auto">
        <Helmet>
          <title>{data.meta_tags?.title || "FAQ | TopCenter"}</title>
          <meta name="description" content={data.meta_tags?.description || data.description || "Questions fréquemment posées sur nos services"} />
        </Helmet>
        
        <h1 className="text-4xl font-bold mb-8 text-center">{data.title || "Questions fréquemment posées"}</h1>
        <p className="text-muted-foreground text-center mb-10">{data.description || "Trouvez rapidement des réponses à vos questions"}</p>
        
        {/* Afficher la recherche dynamique si nous sommes en ligne */}
        {data.id.startsWith('fallback') ? (
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item: any, index: number) => (
              <AccordionItem key={index} value={`item-${index+1}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <DynamicFAQ />
        )}
      </div>
    );
  };

  return (
    <ApiContentWrapper
      data={pageContent}
      isLoading={isLoading}
      error={error}
      refetch={refetch}
      fallback={
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
          </Accordion>
        </div>
      }
    >
      {(data) => <FAQContent data={data} />}
    </ApiContentWrapper>
  );
};

export default FAQ;
