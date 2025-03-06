
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { authService } from '@/services/authService';
import { authStore } from '@/stores/authStore';
import { toast } from 'sonner';

export const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Erreur lors de la récupération de la session:', error);
        toast.error('Échec de l\'authentification');
        navigate('/login');
        return;
      }
      
      if (data.session) {
        await authService.checkUser();
        toast.success('Connexion réussie!');
        navigate('/');
      } else {
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <h2 className="mt-4 text-xl font-semibold">Authentification en cours...</h2>
      </div>
    </div>
  );
};
