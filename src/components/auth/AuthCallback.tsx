
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Récupérer la session après redirection OAuth
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (data.session) {
          // Authentification réussie
          toast.success('Connexion réussie!');
          navigate('/dashboard');
        } else {
          // Pas de session valide
          navigate('/auth');
        }
      } catch (err: any) {
        console.error('Erreur lors de la récupération de la session:', err);
        setError(err.message || 'Échec de l\'authentification');
        toast.error('Échec de l\'authentification');
        setTimeout(() => navigate('/auth'), 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        {error ? (
          <>
            <div className="text-destructive text-xl mb-4">
              <svg className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Erreur d'authentification
            </div>
            <p className="text-muted-foreground">{error}</p>
            <p className="mt-2">Redirection vers la page de connexion...</p>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <h2 className="mt-4 text-xl font-semibold">Authentification en cours...</h2>
            <p className="text-muted-foreground mt-2">Veuillez patienter pendant que nous finalisons votre connexion</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
