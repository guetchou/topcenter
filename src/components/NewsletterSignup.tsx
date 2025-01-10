import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Inscription réussie !",
      description: "Vous recevrez bientôt nos dernières actualités.",
    });
    setEmail("");
  };

  return (
    <div className="bg-secondary/5 p-6 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Newsletter Top Center</h3>
      <p className="text-muted-foreground mb-4">
        Restez informé de nos dernières actualités et offres
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          placeholder="Votre email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit">
          <Mail className="w-4 h-4 mr-2" />
          S'inscrire
        </Button>
      </form>
    </div>
  );
};