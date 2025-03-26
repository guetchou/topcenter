
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertCircle, Database, Eye, Table as TableIcon, Key, RefreshCw, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';

interface DatabaseInfo {
  database_name: string;
  charset: string;
  collation: string;
}

interface TableInfo {
  table_name: string;
  table_type: string;
  engine: string;
  row_count: number;
  created_at: string;
  updated_at: string;
  comment: string;
}

interface ColumnInfo {
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_key: string;
  default_value: string | null;
  extra: string;
  comment: string;
}

interface IndexInfo {
  index_name: string;
  column_name: string;
  non_unique: number;
  seq_in_index: number;
  index_type: string;
  comment: string;
}

const DatabaseExplorer: React.FC = () => {
  const { toast } = useToast();
  const [databases, setDatabases] = useState<DatabaseInfo[]>([]);
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [columns, setColumns] = useState<ColumnInfo[]>([]);
  const [indexes, setIndexes] = useState<IndexInfo[]>([]);
  const [viewDefinition, setViewDefinition] = useState<string | null>(null);
  
  const [selectedDatabase, setSelectedDatabase] = useState<string>('');
  const [selectedTable, setSelectedTable] = useState<string>('');
  
  const [loadingDatabases, setLoadingDatabases] = useState(false);
  const [loadingTables, setLoadingTables] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDatabases();
  }, []);

  useEffect(() => {
    if (selectedDatabase) {
      fetchTables(selectedDatabase);
    }
  }, [selectedDatabase]);

  useEffect(() => {
    if (selectedDatabase && selectedTable) {
      fetchColumns(selectedDatabase, selectedTable);
      fetchIndexes(selectedDatabase, selectedTable);
      
      if (tables.find(t => t.table_name === selectedTable)?.table_type === 'VIEW') {
        fetchViewDefinition(selectedDatabase, selectedTable);
      } else {
        setViewDefinition(null);
      }
    }
  }, [selectedDatabase, selectedTable, tables]);

  const fetchDatabases = async () => {
    setLoadingDatabases(true);
    setError(null);
    try {
      const response = await axios.get('/api/db-explorer/databases');
      setDatabases(response.data.databases);
      
      // Si information_schema est disponible, le sélectionner par défaut
      const infoSchema = response.data.databases.find((db: DatabaseInfo) => 
        db.database_name === 'information_schema'
      );
      
      if (infoSchema) {
        setSelectedDatabase('information_schema');
      } else if (response.data.databases.length > 0) {
        setSelectedDatabase(response.data.databases[0].database_name);
      }
      
    } catch (err) {
      console.error("Erreur lors de la récupération des bases de données:", err);
      setError("Impossible de récupérer les bases de données");
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: "Impossible de récupérer les bases de données. Vérifiez les logs pour plus de détails."
      });
    } finally {
      setLoadingDatabases(false);
    }
  };

  const fetchTables = async (database: string) => {
    if (!database) return;
    
    setLoadingTables(true);
    setTables([]);
    setSelectedTable('');
    setError(null);
    
    try {
      const response = await axios.get(`/api/db-explorer/databases/${database}/tables`);
      setTables(response.data.tables);
      
      if (response.data.tables.length > 0) {
        setSelectedTable(response.data.tables[0].table_name);
      }
    } catch (err) {
      console.error(`Erreur lors de la récupération des tables pour ${database}:`, err);
      setError(`Impossible de récupérer les tables pour ${database}`);
    } finally {
      setLoadingTables(false);
    }
  };

  const fetchColumns = async (database: string, table: string) => {
    if (!database || !table) return;
    
    setLoadingDetails(true);
    setColumns([]);
    
    try {
      const response = await axios.get(`/api/db-explorer/databases/${database}/tables/${table}/columns`);
      setColumns(response.data.columns);
    } catch (err) {
      console.error(`Erreur lors de la récupération des colonnes pour ${database}.${table}:`, err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: `Impossible de récupérer les colonnes pour ${table}`
      });
    } finally {
      setLoadingDetails(false);
    }
  };

  const fetchIndexes = async (database: string, table: string) => {
    if (!database || !table) return;
    
    setIndexes([]);
    
    try {
      const response = await axios.get(`/api/db-explorer/databases/${database}/tables/${table}/indexes`);
      setIndexes(response.data.indexes);
    } catch (err) {
      console.error(`Erreur lors de la récupération des index pour ${database}.${table}:`, err);
    }
  };

  const fetchViewDefinition = async (database: string, view: string) => {
    if (!database || !view) return;
    
    setViewDefinition(null);
    
    try {
      const response = await axios.get(`/api/db-explorer/databases/${database}/views/${view}/definition`);
      setViewDefinition(response.data.definition);
    } catch (err) {
      console.error(`Erreur lors de la récupération de la définition de la vue ${database}.${view}:`, err);
    }
  };

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
            onClick={fetchDatabases} 
            className="mt-2"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Réessayer
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Explorateur de base de données</h2>
        <Button onClick={fetchDatabases} variant="outline" disabled={loadingDatabases}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loadingDatabases ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      {loadingDatabases ? (
        <div className="flex justify-center items-center h-48">
          <Spinner size="lg" />
          <span className="ml-2">Chargement des bases de données...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Liste des bases de données */}
          <Card className="md:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Bases de données</CardTitle>
              <CardDescription>Sélectionnez une base de données</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {databases.map((db) => (
                  <Button
                    key={db.database_name}
                    variant={selectedDatabase === db.database_name ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setSelectedDatabase(db.database_name)}
                  >
                    <Database className="mr-2 h-4 w-4" />
                    <span className="truncate">{db.database_name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Liste des tables */}
          <Card className="md:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Tables</CardTitle>
              <CardDescription>
                {selectedDatabase ? `Tables de ${selectedDatabase}` : 'Sélectionnez une base de données'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingTables ? (
                <div className="flex justify-center items-center h-48">
                  <Spinner />
                  <span className="ml-2">Chargement des tables...</span>
                </div>
              ) : (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {tables.map((table) => (
                      <Button
                        key={table.table_name}
                        variant={selectedTable === table.table_name ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => setSelectedTable(table.table_name)}
                      >
                        {table.table_type === 'VIEW' ? (
                          <Eye className="mr-2 h-4 w-4" />
                        ) : (
                          <TableIcon className="mr-2 h-4 w-4" />
                        )}
                        <span className="truncate">{table.table_name}</span>
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>

          {/* Détails de la table */}
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                {selectedTable ? (
                  <>
                    {tables.find(t => t.table_name === selectedTable)?.table_type === 'VIEW' ? (
                      <Eye className="mr-2 h-5 w-5" />
                    ) : (
                      <TableIcon className="mr-2 h-5 w-5" />
                    )}
                    {selectedTable}
                  </>
                ) : (
                  'Détails de la table'
                )}
              </CardTitle>
              <CardDescription>
                {selectedTable ? (
                  <>
                    {tables.find(t => t.table_name === selectedTable)?.table_type || 'TABLE'} 
                    {tables.find(t => t.table_name === selectedTable)?.engine && 
                      ` - ${tables.find(t => t.table_name === selectedTable)?.engine}`
                    }
                  </>
                ) : (
                  'Sélectionnez une table pour voir ses détails'
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingDetails ? (
                <div className="flex justify-center items-center h-48">
                  <Spinner />
                  <span className="ml-2">Chargement des détails...</span>
                </div>
              ) : selectedTable ? (
                <Tabs defaultValue="columns">
                  <TabsList className="mb-4">
                    <TabsTrigger value="columns">Colonnes</TabsTrigger>
                    <TabsTrigger value="indexes">Index</TabsTrigger>
                    {viewDefinition && (
                      <TabsTrigger value="definition">Définition</TabsTrigger>
                    )}
                  </TabsList>
                  
                  <TabsContent value="columns">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nom</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Nullable</TableHead>
                          <TableHead>Clé</TableHead>
                          <TableHead>Défaut</TableHead>
                          <TableHead>Extra</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {columns.map((column) => (
                          <TableRow key={column.column_name}>
                            <TableCell className="font-medium">{column.column_name}</TableCell>
                            <TableCell>{column.data_type}</TableCell>
                            <TableCell>
                              {column.is_nullable === 'YES' ? 'Oui' : 'Non'}
                            </TableCell>
                            <TableCell>
                              {column.column_key && (
                                <Badge variant={column.column_key === 'PRI' ? 'default' : 'secondary'}>
                                  {column.column_key === 'PRI' && <Key className="mr-1 h-3 w-3" />}
                                  {column.column_key}
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>{column.default_value !== null ? column.default_value : ''}</TableCell>
                            <TableCell>{column.extra}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  
                  <TabsContent value="indexes">
                    {indexes.length > 0 ? (
                      <Accordion type="single" collapsible className="w-full">
                        {Array.from(new Set(indexes.map(idx => idx.index_name))).map(indexName => (
                          <AccordionItem key={indexName} value={indexName || 'unknown'}>
                            <AccordionTrigger>
                              <div className="flex items-center">
                                <Key className="mr-2 h-4 w-4" />
                                <span>{indexName}</span>
                                <Badge variant="outline" className="ml-2">
                                  {indexes.find(idx => idx.index_name === indexName)?.non_unique === 0 ? 'Unique' : 'Non-unique'}
                                </Badge>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Colonne</TableHead>
                                    <TableHead>Séquence</TableHead>
                                    <TableHead>Type</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {indexes
                                    .filter(idx => idx.index_name === indexName)
                                    .sort((a, b) => a.seq_in_index - b.seq_in_index)
                                    .map((idx, i) => (
                                      <TableRow key={`${idx.index_name}-${idx.column_name}-${i}`}>
                                        <TableCell>{idx.column_name}</TableCell>
                                        <TableCell>{idx.seq_in_index}</TableCell>
                                        <TableCell>{idx.index_type}</TableCell>
                                      </TableRow>
                                    ))
                                  }
                                </TableBody>
                              </Table>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    ) : (
                      <div className="flex items-center justify-center h-48 border rounded-md bg-muted/20">
                        <div className="text-center">
                          <Info className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                          <p>Aucun index trouvé pour cette table</p>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                  
                  {viewDefinition && (
                    <TabsContent value="definition">
                      <div className="border p-4 rounded-md bg-muted/20">
                        <h4 className="font-medium mb-2">Définition de la vue:</h4>
                        <pre className="whitespace-pre-wrap text-sm p-4 bg-secondary/20 rounded overflow-auto max-h-[400px]">
                          {viewDefinition}
                        </pre>
                      </div>
                    </TabsContent>
                  )}
                </Tabs>
              ) : (
                <div className="flex items-center justify-center h-48 border rounded-md bg-muted/20">
                  <div className="text-center">
                    <TableIcon className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p>Sélectionnez une table pour voir ses détails</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DatabaseExplorer;
