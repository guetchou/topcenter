
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Helmet } from 'react-helmet-async';
import { Loader2, Database, Check, AlertCircle } from 'lucide-react';
import { usePocketBaseStatus } from '@/integrations/pocketbase/client';
import { loginUser, checkServerAvailability } from '@/integrations/pocketbase/client';

const PocketBaseDashboard: React.FC = () => {
  const { isAvailable, isChecking } = usePocketBaseStatus();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Tenter une connexion utilisateur standard
      await loginUser(email, password);
      setSuccess(true);
      setIsLoading(false);
    } catch (err) {
      setError('Échec de connexion. Vérifiez vos identifiants.');
      setIsLoading(false);
    }
  };

  const handleCheckAvailability = async () => {
    setIsLoading(true);
    try {
      const available = await checkServerAvailability();
      setIsLoading(false);
      if (available) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError('PocketBase inaccessible');
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      setError('Erreur de vérification');
      setIsLoading(false);
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <>
      <Helmet>
        <title>PocketBase Dashboard - TopCenter Admin</title>
      </Helmet>
      
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">PocketBase Dashboard</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Statut PocketBase
              </CardTitle>
              <CardDescription>
                Statut de connexion au serveur PocketBase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg bg-secondary/20 mb-4">
                <div className="flex items-center justify-between">
                  <span>Status:</span>
                  <div>
                    {isChecking ? (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" /> 
                        Vérification en cours...
                      </div>
                    ) : isAvailable ? (
                      <div className="flex items-center gap-2 text-green-500">
                        <Check className="h-4 w-4" />
                        Connecté
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-destructive">
                        <AlertCircle className="h-4 w-4" />
                        Non connecté
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                onClick={handleCheckAvailability} 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Vérification...
                  </>
                ) : (
                  "Vérifier la connexion"
                )}
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Connexion PocketBase</CardTitle>
              <CardDescription>
                Connectez-vous à votre instance PocketBase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">Mot de passe</label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                {error && (
                  <div className="px-3 py-2 rounded bg-destructive/20 text-destructive text-sm">
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className="px-3 py-2 rounded bg-green-500/20 text-green-500 text-sm">
                    Connexion réussie !
                  </div>
                )}
              </form>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                onClick={handleLogin} 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connexion...
                  </>
                ) : (
                  "Se connecter"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PocketBaseDashboard;
