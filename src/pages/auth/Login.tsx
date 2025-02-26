
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Ici, implémentez la logique de connexion avec Supabase
      await login();
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur votre espace TopCenter",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Vérifiez vos identifiants et réessayez",
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
          <h2 className="text-3xl font-bold">Connexion</h2>
          <p className="mt-2 text-muted-foreground">
            Accédez à votre espace client TopCenter
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
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

            <div className="space-y-2">
              <Input
                id="password"
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10"
              />
              <Lock className="w-4 h-4 absolute mt-3 ml-3 text-muted-foreground" />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connexion en cours...
              </>
            ) : (
              "Se connecter"
            )}
          </Button>
        </form>

        <div className="text-center space-y-4">
          <p>
            <Button variant="link" onClick={() => navigate("/reset-password")}>
              Mot de passe oublié ?
            </Button>
          </p>
          <p className="text-sm text-muted-foreground">
            Pas encore de compte ?{" "}
            <Button variant="link" onClick={() => navigate("/register")}>
              S'inscrire
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
