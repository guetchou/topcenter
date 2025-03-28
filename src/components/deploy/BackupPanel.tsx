
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Trash2, RotateCw } from "lucide-react";

interface Backup {
  id: string;
  date: Date;
  size: string;
  type: 'auto' | 'manual';
  status: 'complete' | 'in-progress' | 'failed';
}

export const BackupPanel: React.FC = () => {
  const [backups, setBackups] = useState<Backup[]>([
    { id: '1', date: new Date(2023, 5, 15, 8, 30), size: '1.2 GB', type: 'auto', status: 'complete' },
    { id: '2', date: new Date(2023, 5, 10, 14, 15), size: '1.1 GB', type: 'manual', status: 'complete' },
    { id: '3', date: new Date(2023, 5, 5, 22, 0), size: '1.0 GB', type: 'auto', status: 'complete' },
    { id: '4', date: new Date(2023, 4, 30, 9, 45), size: '1.3 GB', type: 'auto', status: 'complete' },
    { id: '5', date: new Date(2023, 4, 25, 12, 0), size: '1.1 GB', type: 'manual', status: 'complete' },
  ]);
  
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateBackup = async () => {
    setIsLoading(true);
    
    // Simuler la création d'une sauvegarde
    const newBackup: Backup = {
      id: Date.now().toString(),
      date: new Date(),
      size: '1.3 GB',
      type: 'manual',
      status: 'in-progress'
    };
    
    setBackups(prev => [newBackup, ...prev]);
    
    // Simuler un délai pour la sauvegarde
    setTimeout(() => {
      setBackups(prev => 
        prev.map(backup => 
          backup.id === newBackup.id 
            ? { ...backup, status: 'complete' } 
            : backup
        )
      );
      setIsLoading(false);
    }, 3000);
  };

  const handleDeleteBackup = (id: string) => {
    setBackups(prev => prev.filter(backup => backup.id !== id));
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Sauvegardes</CardTitle>
          <Button onClick={handleCreateBackup} disabled={isLoading}>
            {isLoading ? (
              <>
                <RotateCw className="w-4 h-4 mr-2 animate-spin" />
                Sauvegarde en cours...
              </>
            ) : (
              <>Créer une sauvegarde</>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Taille</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {backups.map((backup) => (
              <TableRow key={backup.id}>
                <TableCell>{backup.date.toLocaleString()}</TableCell>
                <TableCell>
                  <span className={`capitalize ${backup.type === 'manual' ? 'text-blue-500' : 'text-gray-500'}`}>
                    {backup.type}
                  </span>
                </TableCell>
                <TableCell>{backup.size}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    backup.status === 'complete' 
                      ? 'bg-green-100 text-green-800' 
                      : backup.status === 'in-progress'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                  }`}>
                    {backup.status === 'in-progress' && (
                      <RotateCw className="w-3 h-3 mr-1 animate-spin" />
                    )}
                    {backup.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button variant="outline" size="icon" disabled={backup.status === 'in-progress'}>
                      <Download className="w-4 h-4" />
                      <span className="sr-only">Télécharger</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteBackup(backup.id)}
                      disabled={backup.status === 'in-progress'}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="sr-only">Supprimer</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
