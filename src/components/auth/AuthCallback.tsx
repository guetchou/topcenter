
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '@/services/api';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    // Si l'utilisateur est déjà connecté, rediriger vers le dashboard
    if (user) {
      navigate('/dashboard');
      return;
    }

    const handleAuthCallback = async () => {
      try {
        // Récupérer le token depuis l'URL
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        
        if (!token) {
          throw new Error("Token non trouvé dans l'URL");
        }
        
        // Stocker le token
        localStorage.setItem('auth_token', token);
        
        // Vérifier si le token est valide
        const response = await api.get('/auth/me');
        if (response.data && response.data.user) {
          // Authentification réussie
          toast.success('Connexion réussie!');
          navigate('/dashboard');
        } else {
          // Pas de session valide
          throw new Error("Session non valide");
        }
      } catch (err: any) {
        console.error('Erreur lors de la récupération de la session:', err);
        setError(err.message || 'Échec de l\'authentification');
        toast.error('Échec de l\'authentification');
        
        // Retirer le token invalide
        localStorage.removeItem('auth_token');
        
        // Redirection vers la page de connexion après un délai
        setTimeout(() => navigate('/auth'), 3000);
      }
    };

    handleAuthCallback();
  }, [navigate, location, user]);

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
