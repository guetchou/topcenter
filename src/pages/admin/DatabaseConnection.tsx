
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, CheckCircle, AlertCircle, Database, Play, Save } from 'lucide-react';
import useDatabaseConnection from '@/hooks/useDatabaseConnection';
import { Textarea } from '@/components/ui/textarea';

const DatabaseConnection: React.FC = () => {
  const [host, setHost] = useState<string>(import.meta.env.VITE_DB_HOST || 'rj8dl.myd.infomaniak.com');
  const [port, setPort] = useState<string>(import.meta.env.VITE_DB_PORT || '3306');
  const [user, setUser] = useState<string>(import.meta.env.VITE_DB_USER || '');
  const [password, setPassword] = useState<string>(import.meta.env.VITE_DB_PASSWORD || '');
  const [database, setDatabase] = useState<string>(import.meta.env.VITE_DB_NAME || 'rj8dl_topcenter_moderne');
  const [ssl, setSsl] = useState<boolean>(import.meta.env.VITE_DB_SSL === 'true');
  const [sqlQuery, setSqlQuery] = useState<string>('SELECT * FROM information_schema.tables LIMIT 10;');
  const [queryResult, setQueryResult] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  const { isConnected, isLoading, error, connect, disconnect, executeQuery } = useDatabaseConnection();

  const handleConnect = async () => {
    await connect({
      host,
      port: parseInt(port),
      user,
      password,
      database,
      ssl
    });
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const handleExecuteQuery = async () => {
    setIsExecuting(true);
    try {
      const result = await executeQuery(sqlQuery);
      setQueryResult(result);
    } catch (err) {
      console.error('Erreur lors de l\'exécution de la requête:', err);
    } finally {
      setIsExecuting(false);
    }
  };

  const renderConnectionStatus = () => {
    if (isLoading) {
      return (
        <div className="flex items-center text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connexion en cours...
        </div>
      );
    }

    if (isConnected) {
      return (
        <div className="flex items-center text-green-600">
          <CheckCircle className="mr-2 h-4 w-4" />
          Connecté à {database}
        </div>
      );
    }

    return (
      <div className="flex items-center text-muted-foreground">
        <Database className="mr-2 h-4 w-4" />
        Non connecté
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Connexion à la base de données</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="connection" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="connection">Connexion</TabsTrigger>
          <TabsTrigger value="query" disabled={!isConnected}>Requêtes SQL</TabsTrigger>
        </TabsList>

        <TabsContent value="connection">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de connexion</CardTitle>
              <CardDescription>
                Configurez la connexion à votre base de données MariaDB/MySQL sur Infomaniak
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="host">Hôte</Label>
                  <Input
                    id="host"
                    value={host}
                    onChange={(e) => setHost(e.target.value)}
                    placeholder="rj8dl.myd.infomaniak.com"
                    disabled={isConnected || isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="port">Port</Label>
                  <Input
                    id="port"
                    value={port}
                    onChange={(e) => setPort(e.target.value)}
                    placeholder="3306"
                    disabled={isConnected || isLoading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="user">Utilisateur</Label>
                  <Input
                    id="user"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    placeholder="Nom d'utilisateur"
                    disabled={isConnected || isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mot de passe"
                    disabled={isConnected || isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="database">Base de données</Label>
                <Input
                  id="database"
                  value={database}
                  onChange={(e) => setDatabase(e.target.value)}
                  placeholder="rj8dl_topcenter_moderne"
                  disabled={isConnected || isLoading}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="ssl"
                  checked={ssl}
                  onCheckedChange={setSsl}
                  disabled={isConnected || isLoading}
                />
                <Label htmlFor="ssl">Utiliser SSL</Label>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              {renderConnectionStatus()}
              <div>
                {isConnected ? (
                  <Button variant="outline" onClick={handleDisconnect} disabled={isLoading}>
                    Déconnecter
                  </Button>
                ) : (
                  <Button onClick={handleConnect} disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Connecter
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="query">
          <Card>
            <CardHeader>
              <CardTitle>Exécuter une requête SQL</CardTitle>
              <CardDescription>
                Exécutez des requêtes SQL sur votre base de données
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sqlQuery">Requête SQL</Label>
                <Textarea
                  id="sqlQuery"
                  value={sqlQuery}
                  onChange={(e) => setSqlQuery(e.target.value)}
                  placeholder="SELECT * FROM information_schema.tables LIMIT 10;"
                  className="font-mono h-32"
                  disabled={isExecuting}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setSqlQuery('')}
                  disabled={isExecuting || !sqlQuery}
                >
                  Effacer
                </Button>
                <Button 
                  onClick={handleExecuteQuery} 
                  disabled={isExecuting || !sqlQuery} 
                  className="flex items-center"
                >
                  {isExecuting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="mr-2 h-4 w-4" />
                  )}
                  Exécuter
                </Button>
              </div>

              {queryResult && (
                <div className="mt-4 space-y-2">
                  <Label>Résultats</Label>
                  <div className="border rounded-md overflow-auto">
                    <pre className="p-4 text-sm">{JSON.stringify(queryResult, null, 2)}</pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DatabaseConnection;
