
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowRight, Check } from 'lucide-react';

interface RegisterFormProps {
  onSuccess: () => void;
}

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { register } = useAuth();
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      await register(email, password, fullName);
      setIsSuccess(true);
      
      // Rediriger vers la connexion après un délai
      setTimeout(() => {
        setIsSuccess(false);
        onSuccess();
      }, 3000);
    } catch (err: any) {
      console.error('Erreur d\'inscription:', err);
      setError(err.message || 'Erreur d\'inscription. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleRegister}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Nom complet</Label>
          <Input 
            id="fullName"
            type="text" 
            placeholder="Prénom Nom" 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="register-email">Email</Label>
          <Input 
            id="register-email"
            type="email" 
            placeholder="votre@email.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="register-password">Mot de passe</Label>
          <Input 
            id="register-password"
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <p className="text-xs text-muted-foreground">
            Au moins 6 caractères
          </p>
        </div>
        
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {isSuccess && (
          <Alert variant="default">
            <Check className="h-4 w-4" />
            <AlertDescription>
              Inscription réussie! Vous allez être redirigé vers la page de connexion.
            </AlertDescription>
          </Alert>
        )}
      </div>
      <div className="mt-4">
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading || isSuccess}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Inscription en cours...
            </>
          ) : (
            <>
              <ArrowRight className="mr-2 h-4 w-4" />
              S'inscrire
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
