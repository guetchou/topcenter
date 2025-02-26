
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export const AuthCallback = () => {
  const navigate = useNavigate();
  const { checkUser } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        await checkUser();
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur votre espace TopCenter",
        });
        
        // Redirection basée sur le rôle
        const user = useAuth.getState().user;
        if (user) {
          switch (user.role) {
            case 'admin':
              navigate('/admin');
              break;
            case 'commercial_agent':
              navigate('/agent/commercial');
              break;
            case 'support_agent':
              navigate('/agent/support');
              break;
            case 'client':
              navigate('/client');
              break;
            default:
              navigate('/');
          }
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Erreur de connexion:', error);
        toast({
          title: "Erreur de connexion",
          description: "Une erreur est survenue lors de la connexion",
          variant: "destructive",
        });
        navigate('/login');
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
};
