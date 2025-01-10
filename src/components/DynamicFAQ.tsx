import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const FAQ_DATA = [
  {
    question: "Quels sont vos horaires d'ouverture ?",
    answer: "Nous sommes ouverts 24h/24 et 7j/7 pour mieux vous servir."
  },
  {
    question: "Dans quelles langues proposez-vous vos services ?",
    answer: "Nous proposons nos services en français, anglais, lingala et kituba."
  },
  {
    question: "Comment puis-je devenir client ?",
    answer: "Contactez-nous par téléphone ou email pour discuter de vos besoins spécifiques."
  }
];

export const DynamicFAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFAQ = FAQ_DATA.filter(
    item => 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative mb-6">
        <Input
          type="text"
          placeholder="Rechercher dans la FAQ..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      </div>

      <Accordion type="single" collapsible>
        {filteredFAQ.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};