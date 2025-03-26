
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Database, RefreshCw, TableProperties, DatabaseBackup } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import useDatabaseConnection from '@/hooks/useDatabaseConnection';
import DatabaseStatus from '@/components/admin/DatabaseStatus';
import axios from 'axios';

interface Table {
  table_name: string;
  engine: string;
  table_rows: number;
  data_length: number;
  create_time: string;
  update_time: string;
}

interface Column {
  column_name: string;
  column_type: string;
  is_nullable: string;
  column_key: string;
  column_default: string | null;
  extra: string;
}

const DatabaseMigration: React.FC = () => {
  const { isConnected, isLoading, error, connect, executeQuery } = useDatabaseConnection();
  const [tables, setTables] = useState<Table[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [sqlQuery, setSqlQuery] = useState<string>('');
  const [queryResults, setQueryResults] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [isLoadingTables, setIsLoadingTables] = useState<boolean>(false);
  const [migrationProgress, setMigrationProgress] = useState<number>(0);
  const [isMigrating, setIsMigrating] = useState<boolean>(false);

  useEffect(() => {
    if (isConnected) {
      loadTables();
    }
  }, [isConnected]);

  const loadTables = async () => {
    setIsLoadingTables(true);
    try {
      const response = await axios.get('/api/db-migration/tables');
      setTables(response.data.tables);
    } catch (error) {
      console.error('Erreur lors du chargement des tables:', error);
      toast.error('Erreur lors du chargement des tables');
    } finally {
      setIsLoadingTables(false);
    }
  };

  const loadColumns = async (tableName: string) => {
    if (!tableName) return;
    
    try {
      const response = await axios.get(`/api/db-migration/tables/${tableName}/columns`);
      setColumns(response.data.columns);
      setSelectedTable(tableName);
      
      // Générer une requête SELECT automatiquement
      setSqlQuery(`SELECT * FROM ${tableName} LIMIT 10;`);
    } catch (error) {
      console.error('Erreur lors du chargement des colonnes:', error);
      toast.error('Erreur lors du chargement des colonnes');
    }
  };

  const handleExecuteQuery = async () => {
    if (!sqlQuery) return;
    
    setIsExecuting(true);
    setQueryResults(null);
    
    try {
      const response = await axios.post('/api/db-migration/execute', { query: sqlQuery });
      setQueryResults(response.data.results);
      toast.success('Requête exécutée avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'exécution de la requête:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      toast.error(`Erreur SQL: ${errorMessage}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const startMigration = async () => {
    setIsMigrating(true);
    setMigrationProgress(0);
    
    try {
      // Simuler une migration par étapes
      for (let i = 1; i <= 5; i++) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setMigrationProgress(i * 20);
        
        // Messages de statut selon l'étape
        switch (i) {
          case 1:
            toast.info('Vérification de la connexion à la base de données');
            break;
          case 2:
            toast.info('Analyse de la structure de la base de données');
            break;
          case 3:
            toast.info('Migration des tables principales');
            break;
          case 4:
            toast.info('Migration des données utilisateurs');
            break;
          case 5:
            toast.success('Migration vers rj8dl_topcenter_moderne terminée');
            break;
        }
      }
    } catch (error) {
      console.error('Erreur lors de la migration:', error);
      toast.error('Erreur lors de la migration');
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Migration de base de données - TopCenter</title>
      </Helmet>
      
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Migration vers Infomaniak</h1>
        
        <DatabaseStatus />
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur de connexion</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="tables" disabled={!isConnected}>Structure</TabsTrigger>
            <TabsTrigger value="query" disabled={!isConnected}>Requêtes SQL</TabsTrigger>
            <TabsTrigger value="migration" disabled={!isConnected}>Migration</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Base de données Infomaniak</CardTitle>
                <CardDescription>
                  Informations sur la connexion à la base de données MariaDB hébergée sur Infomaniak
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium mb-2">Détails de la connexion</h3>
                      <ul className="space-y-2">
                        <li><strong>Serveur:</strong> rj8dl.myd.infomaniak.com</li>
                        <li><strong>Port:</strong> 3306</li>
                        <li><strong>Base de données:</strong> rj8dl_topcenter_moderne</li>
                        <li><strong>Type:</strong> MariaDB 10.4</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Statut</h3>
                      <div className="flex flex-col gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center gap-2"
                          onClick={() => connect()}
                          disabled={isLoading || isConnected}
                        >
                          {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
                          {isConnected ? 'Connecté' : isLoading ? 'Connexion...' : 'Se connecter'}
                        </Button>
                        
                        {isConnected && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={loadTables}
                            disabled={isLoadingTables}
                          >
                            <TableProperties className="h-4 w-4 mr-2" />
                            {isLoadingTables ? 'Chargement...' : 'Actualiser les tables'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {isConnected && (
                    <div>
                      <h3 className="font-medium mb-2">Statistiques</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-2xl font-bold">{tables.length}</div>
                            <div className="text-sm text-muted-foreground">Tables</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-2xl font-bold">MariaDB</div>
                            <div className="text-sm text-muted-foreground">Type</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-2xl font-bold">10.4</div>
                            <div className="text-sm text-muted-foreground">Version</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-2xl font-bold">Infomaniak</div>
                            <div className="text-sm text-muted-foreground">Hébergeur</div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tables">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Tables</CardTitle>
                  <CardDescription>
                    Liste des tables dans la base de données
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingTables ? (
                    <div className="flex justify-center py-4">
                      <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="max-h-[70vh] overflow-y-auto pr-2">
                      <ul className="space-y-1">
                        {tables.map((table) => (
                          <li key={table.table_name}>
                            <Button
                              variant={selectedTable === table.table_name ? 'default' : 'ghost'}
                              className="w-full justify-start text-left"
                              onClick={() => loadColumns(table.table_name)}
                            >
                              {table.table_name}
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>
                    {selectedTable ? `Structure de ${selectedTable}` : 'Sélectionnez une table'}
                  </CardTitle>
                  <CardDescription>
                    {selectedTable 
                      ? `Colonnes et types de données pour ${selectedTable}`
                      : 'Cliquez sur une table pour afficher sa structure'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedTable ? (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-4">Colonne</th>
                            <th className="text-left py-2 px-4">Type</th>
                            <th className="text-left py-2 px-4">Nullable</th>
                            <th className="text-left py-2 px-4">Clé</th>
                            <th className="text-left py-2 px-4">Défaut</th>
                            <th className="text-left py-2 px-4">Extra</th>
                          </tr>
                        </thead>
                        <tbody>
                          {columns.map((column) => (
                            <tr key={column.column_name} className="border-b hover:bg-muted/50">
                              <td className="py-2 px-4 font-medium">{column.column_name}</td>
                              <td className="py-2 px-4">{column.column_type}</td>
                              <td className="py-2 px-4">{column.is_nullable}</td>
                              <td className="py-2 px-4">{column.column_key}</td>
                              <td className="py-2 px-4">{column.column_default || '-'}</td>
                              <td className="py-2 px-4">{column.extra || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Database className="h-10 w-10 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        Sélectionnez une table pour afficher sa structure
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="query">
            <Card>
              <CardHeader>
                <CardTitle>Requêtes SQL</CardTitle>
                <CardDescription>
                  Exécutez des requêtes SQL sur la base de données Infomaniak
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Textarea
                    placeholder="SELECT * FROM information_schema.tables WHERE table_schema = 'rj8dl_topcenter_moderne' LIMIT 10;"
                    className="font-mono text-sm h-32"
                    value={sqlQuery}
                    onChange={(e) => setSqlQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button
                    disabled={!sqlQuery || isExecuting}
                    onClick={handleExecuteQuery}
                  >
                    {isExecuting ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Exécution...
                      </>
                    ) : (
                      'Exécuter'
                    )}
                  </Button>
                </div>
                
                {queryResults && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Résultats</h3>
                    <div className="border rounded overflow-x-auto max-h-96">
                      {Array.isArray(queryResults) && queryResults.length > 0 ? (
                        <table className="w-full text-sm">
                          <thead className="bg-muted">
                            <tr>
                              {Object.keys(queryResults[0]).map((key) => (
                                <th key={key} className="text-left p-2 font-medium">
                                  {key}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {queryResults.map((row, i) => (
                              <tr key={i} className="border-t">
                                {Object.values(row).map((value: any, j) => (
                                  <td key={j} className="p-2">
                                    {value === null ? <span className="text-muted-foreground">NULL</span> : 
                                     typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : queryResults && typeof queryResults === 'object' ? (
                        <div className="p-4">
                          <pre className="whitespace-pre-wrap">{JSON.stringify(queryResults, null, 2)}</pre>
                        </div>
                      ) : (
                        <div className="p-4 text-center text-muted-foreground">
                          Aucun résultat
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="migration">
            <Card>
              <CardHeader>
                <CardTitle>Migration de la base de données</CardTitle>
                <CardDescription>
                  Migration vers la base de données Infomaniak
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <DatabaseBackup className="h-4 w-4" />
                  <AlertTitle>Migration vers Infomaniak</AlertTitle>
                  <AlertDescription>
                    Cette opération va migrer la base de données vers "rj8dl_topcenter_moderne" sur Infomaniak.
                    Assurez-vous d'avoir fait une sauvegarde avant de continuer.
                  </AlertDescription>
                </Alert>
                
                {isMigrating && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progression de la migration</span>
                      <span>{migrationProgress}%</span>
                    </div>
                    <Progress value={migrationProgress} className="h-2" />
                  </div>
                )}
                
                <div className="flex justify-end">
                  <Button 
                    onClick={startMigration}
                    disabled={isMigrating}
                    className="w-full md:w-auto"
                  >
                    {isMigrating ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Migration en cours...
                      </>
                    ) : (
                      'Démarrer la migration'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default DatabaseMigration;
