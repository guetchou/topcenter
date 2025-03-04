
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, checkUser } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      await checkUser();
      
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur votre espace TopCenter",
      });
      
      // Redirection basée sur le rôle
      const { user } = useAuth.getState();
      if (user) {
        if (user.role === 'super_admin') {
          navigate('/super-admin/users');
        } else if (user.role === 'admin') {
          navigate('/admin');
        } else if (user.role === 'commercial_agent' || user.role === 'support_agent') {
          navigate('/agent');
        } else if (user.role === 'client') {
          navigate('/client');
        } else {
          navigate('/');
        }
      } else {
        navigate('/');
      }
    } catch (error: any) {
      console.error("Erreur de connexion:", error);
      
      let errorMessage = "Vérifiez vos identifiants et réessayez";
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Email ou mot de passe incorrect";
      }
      
      toast({
        title: "Erreur de connexion",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
    } catch (error) {
      console.error("Erreur de connexion Google:", error);
      toast({
        title: "Erreur de connexion",
        description: "Impossible de se connecter avec Google. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  // Fonction pour créer un compte super admin (à utiliser pour le développement)
  const createSuperAdmin = async () => {
    try {
      // 1. Créer un utilisateur
      const { data: userData, error: userError } = await supabase.auth.signUp({
        email: 'admin@topcenter.com',
        password: 'Admin@123456',
        options: {
          data: {
            full_name: 'Super Administrateur',
          },
        },
      });

      if (userError) throw userError;

      if (userData.user) {
        // 2. Assigner le rôle super_admin
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({ 
            user_id: userData.user.id, 
            role: 'super_admin' 
          });

        if (roleError) throw roleError;

        toast({
          title: "Compte super admin créé",
          description: "Email: admin@topcenter.com, Mot de passe: Admin@123456",
        });
      }
    } catch (error: any) {
      console.error("Erreur création super admin:", error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer le compte super admin",
        variant: "destructive",
      });
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

        <form onSubmit={handleEmailLogin} className="space-y-6">
          <div className="space-y-4">
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

            <div className="space-y-2 relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10 pr-10"
              />
              <Lock className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <Button 
                type="button" 
                variant="ghost" 
                className="p-0 h-auto absolute right-3 top-3 text-muted-foreground" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
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
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Ou
              </span>
            </div>
          </div>
          
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
          >
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
              <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
            </svg>
            Continuer avec Google
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
          
          {/* Bouton caché pour créer un super admin (pour le développement) */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-muted-foreground" 
            onClick={createSuperAdmin}
          >
            Créer compte super admin
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
