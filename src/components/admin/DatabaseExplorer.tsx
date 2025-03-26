
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Database, Table as TableIcon, Search, FileText, Key, Copy, RefreshCw, List } from 'lucide-react';
import api from '@/services/api';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DatabaseInfo {
  name: string;
  numTables: number;
  numViews: number;
  size: string;
}

interface TableInfo {
  name: string;
  engine: string;
  rowCount: number;
  dataSize: string;
  type: 'BASE TABLE' | 'VIEW';
}

interface ColumnInfo {
  name: string;
  type: string;
  nullable: string;
  key: string;
  default: string | null;
  extra: string;
}

const DatabaseExplorer: React.FC = () => {
  const [databases, setDatabases] = useState<DatabaseInfo[]>([]);
  const [selectedDatabase, setSelectedDatabase] = useState<string>('');
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [columns, setColumns] = useState<ColumnInfo[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [view, setView] = useState<'tables' | 'columns'>('tables');

  // Charger les bases de données
  useEffect(() => {
    const fetchDatabases = async () => {
      setIsLoading(true);
      try {
        const response = await api.database.getDatabases();
        setDatabases(response.databases);
        
        // Sélectionner automatiquement la base de données TopCenter
        const tcDatabase = response.databases.find(
          (db: DatabaseInfo) => db.name.includes('topcenter') || db.name.includes('rj8dl')
        );
        if (tcDatabase) {
          setSelectedDatabase(tcDatabase.name);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des bases de données:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDatabases();
  }, []);

  // Charger les tables quand une base de données est sélectionnée
  useEffect(() => {
    if (!selectedDatabase) return;

    const fetchTables = async () => {
      setIsLoading(true);
      try {
        const response = await api.database.getTables(selectedDatabase);
        setTables(response.tables);
      } catch (error) {
        console.error(`Erreur lors du chargement des tables pour ${selectedDatabase}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTables();
  }, [selectedDatabase]);

  // Charger les colonnes quand une table est sélectionnée
  useEffect(() => {
    if (!selectedDatabase || !selectedTable) return;

    const fetchColumns = async () => {
      setIsLoading(true);
      try {
        const response = await api.database.getColumns(selectedDatabase, selectedTable);
        setColumns(response.columns);
        setView('columns');
      } catch (error) {
        console.error(`Erreur lors du chargement des colonnes pour ${selectedTable}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchColumns();
  }, [selectedDatabase, selectedTable]);

  // Filtrer les tables
  const filteredTables = tables.filter(table => 
    table.name.toLowerCase().includes(filter.toLowerCase())
  );

  // Retour à la vue des tables
  const handleBackToTables = () => {
    setSelectedTable('');
    setView('tables');
  };

  // Copier le nom de la table
  const handleCopyTableName = (tableName: string) => {
    navigator.clipboard.writeText(tableName)
      .then(() => {
        console.log(`Table ${tableName} copiée dans le presse-papier`);
      })
      .catch(err => {
        console.error('Erreur lors de la copie:', err);
      });
  };

  // Rafraîchir les données
  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      if (view === 'columns' && selectedTable) {
        const response = await api.database.getColumns(selectedDatabase, selectedTable);
        setColumns(response.columns);
      } else {
        const response = await api.database.getTables(selectedDatabase);
        setTables(response.tables);
      }
    } catch (error) {
      console.error('Erreur lors du rafraîchissement des données:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Explorateur de base de données</h1>

      <div className="grid md:grid-cols-[300px_1fr] gap-6">
        {/* Panneau de navigation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Bases de données</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && !databases.length ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <ul className="space-y-1">
                  {databases.map((db) => (
                    <li key={db.name}>
                      <Button
                        variant={selectedDatabase === db.name ? "default" : "ghost"}
                        className={`w-full justify-start ${selectedDatabase === db.name ? "bg-primary text-primary-foreground" : ""}`}
                        onClick={() => setSelectedDatabase(db.name)}
                      >
                        <Database className="mr-2 h-4 w-4" />
                        <span className="truncate">{db.name}</span>
                        {db.numTables > 0 && (
                          <span className="ml-auto text-xs opacity-70">{db.numTables}</span>
                        )}
                      </Button>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* Contenu principal */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">
              {view === 'tables' ? (
                <>
                  <span className="flex items-center">
                    <Database className="mr-2 h-5 w-5" />
                    {selectedDatabase || 'Sélectionnez une base de données'}
                  </span>
                </>
              ) : (
                <>
                  <div className="flex items-center">
                    <Button variant="ghost" className="mr-2 p-0 h-7 w-7" onClick={handleBackToTables}>
                      <List className="h-5 w-5" />
                    </Button>
                    <TableIcon className="mr-2 h-5 w-5" />
                    <span className="mr-2">{selectedTable}</span>
                    <Button variant="ghost" className="h-7 w-7 p-0" onClick={() => handleCopyTableName(selectedTable)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </CardTitle>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              {view === 'tables' && (
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Filtrer..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="pl-8 h-9"
                  />
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent>
            {!selectedDatabase ? (
              <div className="text-center py-8 text-muted-foreground">
                Sélectionnez une base de données pour afficher ses tables.
              </div>
            ) : isLoading && (!tables.length || view === 'columns' && !columns.length) ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <>
                {view === 'tables' ? (
                  <ScrollArea className="h-[500px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nom</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Moteur</TableHead>
                          <TableHead className="text-right">Lignes</TableHead>
                          <TableHead className="text-right">Taille</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTables.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                              Aucune table trouvée
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredTables.map((table) => (
                            <TableRow 
                              key={table.name} 
                              className="cursor-pointer hover:bg-muted"
                              onClick={() => setSelectedTable(table.name)}
                            >
                              <TableCell className="font-medium">{table.name}</TableCell>
                              <TableCell>
                                {table.type === 'BASE TABLE' ? (
                                  <span className="flex items-center">
                                    <TableIcon className="mr-1 h-3 w-3" />
                                    Table
                                  </span>
                                ) : (
                                  <span className="flex items-center">
                                    <FileText className="mr-1 h-3 w-3" />
                                    Vue
                                  </span>
                                )}
                              </TableCell>
                              <TableCell>{table.engine || '-'}</TableCell>
                              <TableCell className="text-right">{table.rowCount?.toLocaleString() || '-'}</TableCell>
                              <TableCell className="text-right">{table.dataSize || '-'}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                ) : (
                  <ScrollArea className="h-[500px]">
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
                        {columns.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                              Aucune colonne trouvée
                            </TableCell>
                          </TableRow>
                        ) : (
                          columns.map((column) => (
                            <TableRow key={column.name}>
                              <TableCell className="font-medium">{column.name}</TableCell>
                              <TableCell>{column.type}</TableCell>
                              <TableCell>{column.nullable === 'YES' ? 'Oui' : 'Non'}</TableCell>
                              <TableCell>
                                {column.key === 'PRI' ? (
                                  <span className="flex items-center text-amber-600">
                                    <Key className="mr-1 h-3 w-3" />
                                    PK
                                  </span>
                                ) : column.key === 'MUL' ? (
                                  <span className="flex items-center text-blue-600">FK</span>
                                ) : column.key === 'UNI' ? (
                                  <span className="flex items-center text-green-600">UQ</span>
                                ) : (
                                  '-'
                                )}
                              </TableCell>
                              <TableCell>{column.default !== null ? column.default : '-'}</TableCell>
                              <TableCell>{column.extra || '-'}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DatabaseExplorer;
