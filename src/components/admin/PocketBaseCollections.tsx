
import React, { useState, useEffect } from 'react';
import { pb, createCollection, getRecords } from '@/integrations/pocketbase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { AlertCircle, Database, Plus, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const PocketBaseCollections: React.FC = () => {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCollections = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Vérifier si on est connecté en admin
      if (!pb.authStore.isValid || pb.authStore.model?.type !== 'admin') {
        setError("Vous devez être connecté en tant qu'administrateur pour voir les collections.");
        setLoading(false);
        return;
      }
      
      // Récupérer la liste des collections
      const result = await pb.collections.getFullList();
      setCollections(result);
      
    } catch (err) {
      console.error("Erreur lors de la récupération des collections:", err);
      setError("Impossible de récupérer les collections. " + (err instanceof Error ? err.message : "Erreur inconnue"));
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour récupérer le nombre d'enregistrements d'une collection
  const fetchRecordCount = async (collectionId: string) => {
    try {
      const recordsResult = await getRecords(collectionId);
      return Array.isArray(recordsResult) ? recordsResult.length : 0;
    } catch (error) {
      console.error(`Erreur lors du comptage des enregistrements pour ${collectionId}:`, error);
      return 0;
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>
          {error}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchCollections} 
            className="mt-2"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Réessayer
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (collections.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Aucune collection trouvée</CardTitle>
          <CardDescription>
            Vous n'avez pas encore créé de collections dans votre base de données PocketBase.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => toast.info("Fonctionnalité de création à venir")}>
            <Plus className="mr-2 h-4 w-4" />
            Créer une collection
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Collections PocketBase</h2>
        <Button onClick={fetchCollections} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Actualiser
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {collections.map((collection) => (
          <Card key={collection.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Database className="h-4 w-4 mr-2" />
                {collection.name}
              </CardTitle>
              <CardDescription>
                {collection.type === 'auth' ? 'Collection d\'authentification' : 'Collection standard'}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID:</span>
                  <span className="font-mono">{collection.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Créée le:</span>
                  <span>{new Date(collection.created).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Champs:</span>
                  <span>{collection.schema ? collection.schema.length : 0}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => window.open(`${pb.baseUrl}/_/#/collections/${collection.id}`, '_blank')}
              >
                Voir dans l'admin PocketBase
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PocketBaseCollections;
