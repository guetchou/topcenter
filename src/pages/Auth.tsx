
import { useEffect, useState } from "react";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          // Récupérer le rôle de l'utilisateur
          const { data: roleData, error: roleError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .single();

          if (roleError) {
            console.error("Erreur lors de la récupération du rôle:", roleError);
            navigate("/dashboard"); // Redirection par défaut
            return;
          }

          // Redirection selon le rôle
          switch (roleData?.role) {
            case 'admin':
              navigate("/admin/dashboard");
              break;
            case 'agent':
              navigate("/agent/dashboard");
              break;
            case 'trainer':
              navigate("/trainer/dashboard");
              break;
            case 'manager':
              navigate("/manager/dashboard");
              break;
            default:
              navigate("/dashboard"); // Utilisateur standard
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setErrorMessage("Une erreur est survenue lors de la vérification de l'authentification");
      } finally {
        setIsLoading(false);
      }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      if (event === "SIGNED_IN" && session) {
        // Récupérer le rôle de l'utilisateur après la connexion
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();

        if (roleError) {
          console.error("Erreur lors de la récupération du rôle:", roleError);
          navigate("/dashboard"); // Redirection par défaut
          return;
        }

        // Redirection selon le rôle
        switch (roleData?.role) {
          case 'admin':
            navigate("/admin/dashboard");
            break;
          case 'agent':
            navigate("/agent/dashboard");
            break;
          case 'trainer':
            navigate("/trainer/dashboard");
            break;
          case 'manager':
            navigate("/manager/dashboard");
            break;
          default:
            navigate("/dashboard"); // Utilisateur standard
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background flex items-center justify-center p-4"
    >
      <div className="w-full max-w-md space-y-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold">Bienvenue</h1>
          <p className="text-muted-foreground">Connectez-vous ou créez un compte</p>
        </motion.div>

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card p-6 rounded-lg shadow-lg hover-lift"
        >
          <SupabaseAuth 
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              style: {
                button: {
                  transition: 'all 0.2s ease',
                },
                anchor: {
                  transition: 'all 0.2s ease',
                },
                container: {
                  transition: 'all 0.3s ease',
                },
              },
            }}
            theme="light"
            providers={[]}
            localization={{
              variables: {
                sign_in: {
                  email_label: "Email",
                  password_label: "Mot de passe",
                  button_label: "Se connecter",
                },
                sign_up: {
                  email_label: "Email",
                  password_label: "Mot de passe",
                  button_label: "S'inscrire",
                },
              },
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Auth;
