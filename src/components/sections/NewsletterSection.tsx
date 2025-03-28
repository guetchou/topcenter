
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Interface pour la table contacts
interface Contact {
  id?: string;
  email: string;
  name: string;
  phone: string;
  message: string;
  service: string;
  created_at?: string;
  status?: string;
}

export const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const newContact: Contact = {
      email,
      name: 'Newsletter Subscriber',
      phone: 'N/A',
      message: 'Newsletter subscription',
      service: 'Newsletter',
    };

    try {
      const { error } = await supabase
        .from('contacts')
        .insert([newContact]);

      if (error) throw error;

      toast({
        title: "Inscription réussie!",
        description: "Vous recevrez nos actualités très prochainement.",
      });
      setEmail("");
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 bg-primary/5">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="flex justify-center">
            <Mail className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-3xl font-bold">Restez informé</h2>
          <p className="text-muted-foreground">
            Inscrivez-vous à notre newsletter pour recevoir nos actualités et offres exclusives.
          </p>
          <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Votre adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Inscription..." : "S'inscrire"}
            </Button>
          </form>
          <p className="text-sm text-muted-foreground">
            Recevez 10% de réduction sur votre première commande en vous inscrivant!
          </p>
        </div>
      </div>
    </section>
  );
};
