
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
    // If user is already logged in, redirect to dashboard
    if (user) {
      navigate('/dashboard');
      return;
    }

    const handleAuthCallback = async () => {
      try {
        // Get token from URL
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        
        if (!token) {
          throw new Error("Token not found in URL");
        }
        
        // Store the token
        localStorage.setItem('auth_token', token);
        
        // Verify if token is valid
        const response = await api.get('/auth/me');
        if (response.data && response.data.user && response.data.user.id) {
          // Authentication successful
          toast.success('Authentication successful!');
          navigate('/dashboard');
        } else {
          // No valid session
          throw new Error("Invalid session");
        }
      } catch (err: any) {
        console.error('Error retrieving session:', err);
        setError(err.message || 'Authentication failed');
        toast.error('Authentication failed');
        
        // Remove invalid token
        localStorage.removeItem('auth_token');
        
        // Redirect to login page after a delay
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
              Authentication Error
            </div>
            <p className="text-muted-foreground">{error}</p>
            <p className="mt-2">Redirecting to login page...</p>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <h2 className="mt-4 text-xl font-semibold">Authenticating...</h2>
            <p className="text-muted-foreground mt-2">Please wait while we complete your login</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
