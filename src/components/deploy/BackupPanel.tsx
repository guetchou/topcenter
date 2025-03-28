
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, DownloadCloud, Clock } from "lucide-react";
import { toast } from "sonner";

export const BackupPanel: React.FC = () => {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backups, setBackups] = useState([
    { id: 1, date: "2023-10-20 14:30", size: "245 MB", status: "success" },
    { id: 2, date: "2023-10-19 09:15", size: "240 MB", status: "success" },
    { id: 3, date: "2023-10-18 19:45", size: "238 MB", status: "success" }
  ]);

  const handleBackup = async () => {
    setIsBackingUp(true);
    
    // Simuler une sauvegarde
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Ajouter une nouvelle sauvegarde à la liste
      const newBackup = {
        id: backups.length + 1,
        date: new Date().toLocaleString(),
        size: `${240 + Math.floor(Math.random() * 10)} MB`,
        status: "success"
      };
      
      setBackups([newBackup, ...backups]);
      toast.success("Sauvegarde effectuée avec succès");
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setIsBackingUp(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Sauvegardes</CardTitle>
        <Button onClick={handleBackup} disabled={isBackingUp} size="sm">
          {isBackingUp ? (
            <>
              <Clock className="mr-2 h-4 w-4 animate-spin" />
              Sauvegarde en cours...
            </>
          ) : (
            <>
              <DownloadCloud className="mr-2 h-4 w-4" />
              Créer une sauvegarde
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {backups.length > 0 ? (
            <div className="divide-y">
              {backups.map((backup) => (
                <div key={backup.id} className="py-3 flex justify-between items-center">
                  <div className="flex items-center">
                    <Database className="mr-2 h-4 w-4 text-primary" />
                    <div>
                      <div className="font-medium">{backup.date}</div>
                      <div className="text-sm text-muted-foreground">{backup.size}</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Restaurer</Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              Aucune sauvegarde disponible
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
