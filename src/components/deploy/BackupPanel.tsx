
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Database, Download, Archive, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface Backup {
  id: string;
  name: string;
  type: 'auto' | 'manual';
  size: string;
  createdAt: Date;
}

export const BackupPanel: React.FC = () => {
  const [backups, setBackups] = useState<Backup[]>([
    {
      id: '1',
      name: 'backup-auto-20250330-120000',
      type: 'auto',
      size: '142.5 MB',
      createdAt: new Date(2025, 2, 30, 12, 0, 0)
    },
    {
      id: '2',
      name: 'backup-manual-20250329-153045',
      type: 'manual',
      size: '140.2 MB',
      createdAt: new Date(2025, 2, 29, 15, 30, 45)
    },
    {
      id: '3',
      name: 'backup-auto-20250328-120000',
      type: 'auto',
      size: '138.7 MB',
      createdAt: new Date(2025, 2, 28, 12, 0, 0)
    }
  ]);
  
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  
  const handleCreateBackup = () => {
    setIsCreatingBackup(true);
    
    // Simuler la création d'une sauvegarde
    setTimeout(() => {
      const newBackup: Backup = {
        id: Date.now().toString(),
        name: `backup-manual-${new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14)}`,
        type: 'manual',
        size: '143.1 MB',
        createdAt: new Date()
      };
      
      setBackups([newBackup, ...backups]);
      setIsCreatingBackup(false);
      
      toast.success('Sauvegarde créée avec succès');
    }, 2000);
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Sauvegardes
          </CardTitle>
          <Button 
            onClick={handleCreateBackup}
            disabled={isCreatingBackup}
          >
            {isCreatingBackup ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Création en cours...
              </>
            ) : (
              <>
                <Archive className="h-4 w-4 mr-2" />
                Créer une sauvegarde
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Taille</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {backups.map((backup) => (
              <TableRow key={backup.id}>
                <TableCell className="font-medium">{backup.name}</TableCell>
                <TableCell>
                  <Badge variant={backup.type === 'auto' ? 'default' : 'success'}>
                    {backup.type === 'auto' ? 'Automatique' : 'Manuelle'}
                  </Badge>
                </TableCell>
                <TableCell>{backup.size}</TableCell>
                <TableCell>
                  {backup.createdAt.toLocaleDateString()} {backup.createdAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
