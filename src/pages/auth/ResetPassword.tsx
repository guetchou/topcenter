
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/new-password`,
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: "Email envoyé",
        description: "Veuillez vérifier votre boîte de réception pour réinitialiser votre mot de passe.",
      });
    } catch (error) {
      console.error("Erreur de réinitialisation:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer l'email de réinitialisation. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Réinitialisation du mot de passe</h2>
          {!isSubmitted ? (
            <p className="mt-2 text-muted-foreground">
              Entrez votre email pour recevoir un lien de réinitialisation
            </p>
          ) : (
            <p className="mt-2 text-muted-foreground">
              Nous avons envoyé un email à <strong>{email}</strong> avec les instructions pour réinitialiser votre mot de passe.
            </p>
          )}
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 relative">
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10"
              />
              <Mail className="w-4 h-4 absolute mt-3 ml-3 text-muted-foreground" />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                "Envoyer le lien de réinitialisation"
              )}
            </Button>
          </form>
        ) : (
          <div className="space-y-6">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/login")}
            >
              Retour à la connexion
            </Button>
          </div>
        )}

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            <Button variant="link" onClick={() => navigate("/login")}>
              Retour à la connexion
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
