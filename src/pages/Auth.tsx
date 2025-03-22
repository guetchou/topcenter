
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { Logo } from '@/components/Logo';
import { NetworkStatus } from '@/components/NetworkStatus';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle, register, user, isLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });

  // Déterminer la redirection en fonction de l'état de location ou utiliser un chemin par défaut
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  useEffect(() => {
    // Si l'utilisateur est déjà connecté, rediriger vers la page de destination
    if (user && !isLoading) {
      navigate(from, { replace: true });
    }
  }, [user, isLoading, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setErrorMessage(null);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.email, formData.password, formData.fullName);
        // Pour le processus d'inscription, ne pas naviguer tout de suite
        // car l'utilisateur doit d'abord confirmer son email
        setIsLogin(true);
        setFormData(prev => ({ ...prev, fullName: '' }));
        toast.success("Compte créé avec succès. Vous pouvez maintenant vous connecter.");
        setFormLoading(false);
        return;
      }
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error("Erreur d'authentification:", error);
      setErrorMessage(error.message || "Erreur d'authentification");
      toast.error(error.message || "Erreur d'authentification");
    } finally {
      setFormLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setFormLoading(true);
      setErrorMessage(null);
      await loginWithGoogle();
      // Note: La redirection est gérée par OAuth et AuthCallback component
    } catch (error: any) {
      console.error("Erreur de connexion avec Google:", error);
      setErrorMessage(error.message || "Erreur de connexion avec Google");
      toast.error(error.message || "Erreur de connexion avec Google");
    } finally {
      setFormLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <NetworkStatus />
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Logo />
          </div>
          <CardTitle>{isLogin ? "Connexion" : "Créer un compte"}</CardTitle>
          <CardDescription>
            {isLogin 
              ? "Connectez-vous à votre espace TopCenter" 
              : "Créez un compte pour accéder à tous nos services"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {errorMessage && (
            <div className="mb-4 p-3 rounded-md bg-destructive/10 text-destructive text-sm">
              {errorMessage}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Nom complet</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    fullName: e.target.value
                  }))}
                  required={!isLogin}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  email: e.target.value
                }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  password: e.target.value
                }))}
                required
              />
            </div>
            
            {isLogin && (
              <div className="text-right">
                <Link to="/reset-password" className="text-sm text-primary hover:underline">
                  Mot de passe oublié?
                </Link>
              </div>
            )}
            
            <Button type="submit" className="w-full" disabled={formLoading}>
              {formLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                  {isLogin ? "Connexion..." : "Création..."}
                </span>
              ) : (isLogin ? "Se connecter" : "Créer un compte")}
            </Button>
          </form>

          <div className="relative my-6">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
              OU
            </span>
          </div>

          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleGoogleLogin}
            disabled={formLoading}
          >
            <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continuer avec Google
          </Button>
          
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>
              Identifiants de démonstration:<br />
              - Email: admin@topcenter.app<br />
              - Mot de passe: password123
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            {isLogin ? "Pas encore de compte?" : "Déjà un compte?"}{" "}
            <button 
              type="button"
              className="text-primary hover:underline"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "S'inscrire" : "Se connecter"}
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
