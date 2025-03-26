
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Database, TableProperties, FileSearch } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import DatabaseStatus from '@/components/admin/DatabaseStatus';

interface Table {
  name: string;
  rows: number;
}

interface Column {
  Field: string;
  Type: string;
  Null: string;
  Key: string;
  Default: string | null;
  Extra: string;
}

const DatabaseExplorerPage: React.FC = () => {
  const [databases, setDatabases] = useState<string[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [sampleData, setSampleData] = useState<any[]>([]);
  const [selectedDatabase, setSelectedDatabase] = useState<string>('rj8dl_topcenter_moderne');
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [sqlQuery, setSqlQuery] = useState<string>('');
  const [queryResults, setQueryResults] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Charger les bases de données au montage
  useEffect(() => {
    loadDatabases();
  }, []);

  // Charger les tables lorsqu'une base de données est sélectionnée
  useEffect(() => {
    if (selectedDatabase) {
      loadTables(selectedDatabase);
    }
  }, [selectedDatabase]);

  const loadDatabases = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/db-explorer/databases');
      if (response.data.status === 'success') {
        setDatabases(response.data.databases);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des bases de données:', error);
      toast.error('Impossible de charger les bases de données');
    } finally {
      setIsLoading(false);
    }
  };

  const loadTables = async (database: string) => {
    setIsLoading(true);
    setTables([]);
    setSelectedTable('');
    
    try {
      const response = await axios.get(`/api/db-explorer/databases/${database}/tables`);
      if (response.data.status === 'success') {
        const tableList = response.data.tables.map((name: string) => ({
          name,
          rows: 0 // On pourrait charger ce nombre plus tard si nécessaire
        }));
        setTables(tableList);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des tables:', error);
      toast.error('Impossible de charger les tables');
    } finally {
      setIsLoading(false);
    }
  };

  const loadTableDetails = async (table: string) => {
    setIsLoading(true);
    setColumns([]);
    setSampleData([]);
    
    try {
      const response = await axios.get(`/api/db-explorer/databases/${selectedDatabase}/tables/${table}/columns`);
      if (response.data.status === 'success') {
        setColumns(response.data.columns);
        setSampleData(response.data.sampleData);
        setSelectedTable(table);
        
        // Générer une requête SELECT de base
        setSqlQuery(`SELECT * FROM \`${table}\` LIMIT 10;`);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des détails de la table:', error);
      toast.error('Impossible de charger les détails de la table');
    } finally {
      setIsLoading(false);
    }
  };

  const executeQuery = async () => {
    if (!sqlQuery) return;
    
    setIsLoading(true);
    setQueryResults(null);
    
    try {
      const response = await axios.post('/api/db-explorer/query', { query: sqlQuery });
      if (response.data.status === 'success') {
        setQueryResults(response.data.results);
        toast.success('Requête exécutée avec succès');
      }
    } catch (error) {
      console.error('Erreur lors de l\'exécution de la requête:', error);
      toast.error('Erreur lors de l\'exécution de la requête');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Explorateur de base de données - TopCenter</title>
      </Helmet>
      
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Explorateur de base de données</h1>
        
        <DatabaseStatus />
        
        <Tabs defaultValue="tables" className="mt-6">
          <TabsList>
            <TabsTrigger value="tables">Tables</TabsTrigger>
            <TabsTrigger value="query">Requêtes SQL</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tables" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <TableProperties className="h-5 w-5 mr-2" />
                    Tables
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center p-4">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-2">
                      {tables.length > 0 ? (
                        tables.map((table) => (
                          <Button
                            key={table.name}
                            variant={selectedTable === table.name ? 'default' : 'ghost'}
                            className="w-full justify-start text-left"
                            onClick={() => loadTableDetails(table.name)}
                          >
                            {table.name}
                          </Button>
                        ))
                      ) : (
                        <p className="text-center text-muted-foreground py-4">
                          Aucune table disponible
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <FileSearch className="h-5 w-5 mr-2" />
                    {selectedTable ? `Structure de ${selectedTable}` : 'Sélectionnez une table'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center p-4">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : selectedTable ? (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Structure</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2 px-4">Colonne</th>
                                <th className="text-left py-2 px-4">Type</th>
                                <th className="text-left py-2 px-4">Null</th>
                                <th className="text-left py-2 px-4">Clé</th>
                                <th className="text-left py-2 px-4">Défaut</th>
                                <th className="text-left py-2 px-4">Extra</th>
                              </tr>
                            </thead>
                            <tbody>
                              {columns.map((column, index) => (
                                <tr key={index} className="border-b hover:bg-muted/50">
                                  <td className="py-2 px-4 font-medium">{column.Field}</td>
                                  <td className="py-2 px-4">{column.Type}</td>
                                  <td className="py-2 px-4">{column.Null}</td>
                                  <td className="py-2 px-4">{column.Key}</td>
                                  <td className="py-2 px-4">{column.Default || '-'}</td>
                                  <td className="py-2 px-4">{column.Extra || '-'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      
                      {sampleData.length > 0 && (
                        <div>
                          <h3 className="text-sm font-medium mb-2">Aperçu des données</h3>
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-sm">
                              <thead>
                                <tr className="border-b">
                                  {Object.keys(sampleData[0]).map((key) => (
                                    <th key={key} className="text-left py-2 px-4">{key}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {sampleData.map((row, rowIndex) => (
                                  <tr key={rowIndex} className="border-b hover:bg-muted/50">
                                    {Object.values(row).map((value: any, valueIndex) => (
                                      <td key={valueIndex} className="py-2 px-4">
                                        {value === null ? (
                                          <span className="text-muted-foreground">NULL</span>
                                        ) : (
                                          String(value)
                                        )}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Database className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        Sélectionnez une table pour afficher sa structure et un aperçu des données
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="query" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Exécuter une requête SQL</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={sqlQuery}
                  onChange={(e) => setSqlQuery(e.target.value)}
                  placeholder="SELECT * FROM nom_table LIMIT 10;"
                  className="font-mono h-32"
                />
                
                <div className="flex justify-end">
                  <Button 
                    onClick={executeQuery}
                    disabled={!sqlQuery || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Exécution...
                      </>
                    ) : (
                      'Exécuter la requête'
                    )}
                  </Button>
                </div>
                
                {queryResults && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Résultats</h3>
                    <div className="overflow-x-auto border rounded-md">
                      {Array.isArray(queryResults) && queryResults.length > 0 ? (
                        <table className="w-full border-collapse text-sm">
                          <thead>
                            <tr className="border-b bg-muted/50">
                              {Object.keys(queryResults[0]).map((key) => (
                                <th key={key} className="text-left py-2 px-4">{key}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {queryResults.map((row, rowIndex) => (
                              <tr key={rowIndex} className="border-b last:border-0 hover:bg-muted/30">
                                {Object.values(row).map((value: any, valueIndex) => (
                                  <td key={valueIndex} className="py-2 px-4">
                                    {value === null ? (
                                      <span className="text-muted-foreground">NULL</span>
                                    ) : typeof value === 'object' ? (
                                      JSON.stringify(value)
                                    ) : (
                                      String(value)
                                    )}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="p-4 text-center text-muted-foreground">
                          Aucun résultat ou opération réussie sans résultat à afficher
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default DatabaseExplorerPage;
