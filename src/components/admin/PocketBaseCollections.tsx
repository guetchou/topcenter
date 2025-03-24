
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { pb, testPocketBaseConnection, createCollection } from '@/integrations/pocketbase/client';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, Database, RefreshCw } from 'lucide-react';

const PocketBaseCollections: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [collections, setCollections] = useState<any[]>([]);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connected' | 'disconnected'>('idle');

  // Tester la connexion au démarrage
  useEffect(() => {
    checkConnection();
  }, []);

  // Charger les collections
  const loadCollections = async () => {
    try {
      setIsLoading(true);
      const result = await pb.collections.getFullList();
      setCollections(result);
    } catch (error) {
      console.error('Erreur lors du chargement des collections:', error);
      toast.error('Impossible de charger les collections');
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les enregistrements d'une collection
  const loadRecords = async (collectionName: string) => {
    try {
      setIsLoading(true);
      setSelectedCollection(collectionName);
      const { success, items, error } = await pb.collection(collectionName).getList(1, 50);
      
      if (success && items) {
        setRecords(items);
      } else {
        console.error('Erreur:', error);
        setRecords([]);
        toast.error(`Erreur lors du chargement des enregistrements de ${collectionName}`);
      }
    } catch (error) {
      console.error(`Erreur lors du chargement des enregistrements de ${collectionName}:`, error);
      setRecords([]);
      toast.error(`Erreur lors du chargement des enregistrements de ${collectionName}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Créer une nouvelle collection
  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) {
      toast.error('Veuillez saisir un nom de collection');
      return;
    }

    try {
      setIsLoading(true);
      
      // Schéma simple par défaut
      const schema = [
        {
          name: 'title',
          type: 'text',
          required: true
        },
        {
          name: 'content',
          type: 'text'
        },
        {
          name: 'created',
          type: 'date',
          required: true
        }
      ];
      
      const { success, collection, error } = await createCollection(newCollectionName, schema);
      
      if (success) {
        setNewCollectionName('');
        loadCollections();
      } else {
        console.error('Erreur:', error);
      }
    } catch (error) {
      console.error('Erreur lors de la création de la collection:', error);
      toast.error('Erreur lors de la création de la collection');
    } finally {
      setIsLoading(false);
    }
  };

  // Vérifier la connexion à PocketBase
  const checkConnection = async () => {
    const result = await testPocketBaseConnection();
    if (result.success) {
      setConnectionStatus('connected');
      loadCollections();
    } else {
      setConnectionStatus('disconnected');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Collections PocketBase
            </CardTitle>
            <CardDescription>
              Gérez vos collections et données PocketBase
            </CardDescription>
          </div>
          <div className="flex items-center">
            <Badge 
              variant={connectionStatus === 'connected' ? "success" : 
                      connectionStatus === 'disconnected' ? "destructive" : "outline"}
              className="mr-2"
            >
              {connectionStatus === 'connected' ? 'Connecté' : 
               connectionStatus === 'disconnected' ? 'Déconnecté' : 'Non testé'}
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={checkConnection}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="collections">
          <TabsList className="mb-4">
            <TabsTrigger value="collections">Collections</TabsTrigger>
            <TabsTrigger value="records" disabled={!selectedCollection}>Enregistrements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="collections">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Nom de la nouvelle collection"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  disabled={isLoading || connectionStatus !== 'connected'}
                />
                <Button 
                  onClick={handleCreateCollection}
                  disabled={isLoading || !newCollectionName.trim() || connectionStatus !== 'connected'}
                >
                  {isLoading ? <Spinner className="mr-2 h-4 w-4" /> : null}
                  Créer
                </Button>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <Spinner className="h-8 w-8" />
                </div>
              ) : collections.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground">
                  Aucune collection trouvée
                </div>
              ) : (
                <div className="grid gap-2">
                  {collections.map((collection) => (
                    <div 
                      key={collection.id}
                      className="p-3 border rounded flex justify-between items-center hover:bg-accent cursor-pointer"
                      onClick={() => loadRecords(collection.name)}
                    >
                      <div>
                        <h3 className="font-medium">{collection.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {collection.schema.length} champs
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        Voir les données
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="records">
            {selectedCollection && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">{selectedCollection}</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => loadRecords(selectedCollection)}
                    disabled={isLoading}
                  >
                    {isLoading ? <Spinner className="mr-2 h-4 w-4" /> : null}
                    Actualiser
                  </Button>
                </div>
                
                {isLoading ? (
                  <div className="flex justify-center p-8">
                    <Spinner className="h-8 w-8" />
                  </div>
                ) : records.length === 0 ? (
                  <div className="text-center p-8 text-muted-foreground">
                    Aucun enregistrement trouvé
                  </div>
                ) : (
                  <div className="border rounded overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted">
                          <th className="text-left p-2">ID</th>
                          {records[0] && Object.keys(records[0]).filter(k => k !== 'id').map(key => (
                            <th key={key} className="text-left p-2">{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {records.map((record) => (
                          <tr key={record.id} className="border-t">
                            <td className="p-2 font-mono text-sm">{record.id}</td>
                            {Object.entries(record)
                              .filter(([key]) => key !== 'id')
                              .map(([key, value]) => (
                                <td key={key} className="p-2">
                                  {typeof value === 'object' 
                                    ? JSON.stringify(value).substring(0, 30) + '...'
                                    : String(value).substring(0, 30)}
                                </td>
                              ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        URL de l'API: {pb.baseUrl}
      </CardFooter>
    </Card>
  );
};

export default PocketBaseCollections;
