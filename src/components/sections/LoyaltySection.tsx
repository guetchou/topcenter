
import { Button } from "@/components/ui/button";
import { Handshake, Award, Building, BarChart4 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const LoyaltySection = () => {
  const { toast } = useToast();

  const handlePartnerInquiry = () => {
    toast({
      title: "Demande reçue",
      description: "Nous vous contacterons rapidement pour discuter de notre programme partenaire.",
    });
  };

  return (
    <section className="py-16 bg-gradient-to-b from-background to-primary/5">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="flex justify-center">
            <Award className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-3xl font-bold">Programme Partenaires</h2>
          <p className="text-lg text-muted-foreground">
            Collaborez avec TopCenter et développez votre activité avec nos solutions de centre d'appels innovantes.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="space-y-4">
              <div className="flex justify-center">
                <Building className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-xl">Partenariats B2B</h3>
              <p className="text-muted-foreground">
                Intégrez nos solutions à votre offre existante et proposez une expérience client complète.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-center">
                <Handshake className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-xl">Revendeurs</h3>
              <p className="text-muted-foreground">
                Devenez revendeur agréé et bénéficiez de marges attractives sur nos solutions.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-center">
                <BarChart4 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-xl">Support entreprise</h3>
              <p className="text-muted-foreground">
                Une équipe dédiée pour accompagner la croissance de vos clients B2B et B2C.
              </p>
            </div>
          </div>
          
          <div className="mt-12">
            <Button
              size="lg"
              onClick={handlePartnerInquiry}
              className="gap-2"
            >
              <Handshake className="h-5 w-5" />
              Devenir partenaire
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
