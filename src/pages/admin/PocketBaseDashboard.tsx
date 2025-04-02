
import React, { useState } from 'react';
import PocketBaseAdminTest from '@/components/admin/PocketBaseAdminTest';
import PocketBaseCollections from '@/components/admin/PocketBaseCollections';
import PocketBaseStatus from '@/components/PocketBaseStatus';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { pb, adminLogin, checkServerAvailability } from '@/integrations/pocketbase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ApiErrorBoundary } from '@/components/ApiErrorBoundary';

const PocketBaseDashboard: React.FC = () => {
  const [adminEmail, setAdminEmail] = useState('admin@topcenter.cg');
  const [adminPassword, setAdminPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(pb.authStore.isValid);
  const [isLoading, setIsLoading] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Vérifier d'abord la disponibilité du serveur
    const serverAvailable = await checkServerAvailability();
    
    if (!serverAvailable) {
      setIsLoading(false);
      return;
    }
    
    try {
      const result = await adminLogin(adminEmail, adminPassword);
      if (result.success) {
        setIsLoggedIn(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    pb.authStore.clear();
    setIsLoggedIn(false);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">PocketBase Dashboard</h1>
        <p className="text-muted-foreground">
          Gérez votre backend PocketBase depuis cette interface
        </p>
      </div>

      {/* Afficher le statut de connexion PocketBase */}
      <div className="mb-6">
        <PocketBaseStatus />
      </div>

      {isLoggedIn ? (
        <ApiErrorBoundary>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold">
                Connecté en tant que: {pb.authStore.model?.email}
              </h2>
              <p className="text-sm text-muted-foreground">
                Type de connexion: {pb.authStore.model?.type === 'admin' ? 'Administrateur' : 'Utilisateur'}
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Déconnexion
            </Button>
          </div>

          <Tabs defaultValue="collections" className="space-y-6">
            <TabsList>
              <TabsTrigger value="collections">Collections</TabsTrigger>
              <TabsTrigger value="test">Test de connexion</TabsTrigger>
              <TabsTrigger value="docs">Documentation</TabsTrigger>
            </TabsList>
            
            <TabsContent value="collections">
              <PocketBaseCollections />
            </TabsContent>
            
            <TabsContent value="test">
              <div className="grid gap-6 md:grid-cols-2">
                <PocketBaseAdminTest />
                
                <Card>
                  <CardHeader>
                    <CardTitle>Statut de la connexion</CardTitle>
                    <CardDescription>
                      Informations sur votre connexion PocketBase actuelle
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-1">URL de l'API</h3>
                      <p className="text-sm">{pb.baseUrl}</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Statut d'authentification</h3>
                      <p className="text-sm">
                        {pb.authStore.isValid 
                          ? 'Authentifié' 
                          : 'Non authentifié'}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Type de token</h3>
                      <p className="text-sm">
                        {pb.authStore.isValid 
                          ? (pb.authStore.model?.type === 'admin' ? 'Admin' : 'Utilisateur') 
                          : 'Aucun'}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Expiration du token</h3>
                      <p className="text-sm">
                        {pb.authStore.isValid && pb.authStore.token
                          ? new Date(pb.authStore.model?.exp * 1000).toLocaleString()
                          : 'N/A'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="docs">
              <Card>
                <CardHeader>
                  <CardTitle>Documentation PocketBase</CardTitle>
                  <CardDescription>
                    Ressources pour utiliser PocketBase efficacement
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-1">Documentation officielle</h3>
                    <p className="text-sm">
                      <a href="https://pocketbase.io/docs/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                        Documentation PocketBase
                      </a>
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Interface d'administration</h3>
                    <p className="text-sm">
                      <a href="https://api.topcenter.cg/_/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                        Admin UI (https://api.topcenter.cg/_/)
                      </a>
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">SDK JavaScript</h3>
                    <p className="text-sm">
                      <a href="https://github.com/pocketbase/js-sdk" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                        GitHub: PocketBase JavaScript SDK
                      </a>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </ApiErrorBoundary>
      ) : (
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Connexion Admin PocketBase</CardTitle>
              <CardDescription>
                Connectez-vous avec vos identifiants administrateur PocketBase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input 
                    id="password"
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Connexion...' : 'Se connecter'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PocketBaseDashboard;
