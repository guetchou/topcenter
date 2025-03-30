
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Download } from "lucide-react";

export const BackupPanel: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Sauvegardes du site</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex flex-col gap-2">
            <Button className="w-full" variant="outline">
              <Database className="h-4 w-4 mr-2" />
              Créer une sauvegarde manuelle
            </Button>
            
            <p className="text-sm text-muted-foreground mt-2">
              Les sauvegardes sont créées automatiquement avant chaque déploiement et conservées pendant 30 jours.
            </p>
          </div>
          
          <div className="border rounded-md p-4">
            <h3 className="font-medium mb-3">Sauvegardes récentes</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 hover:bg-accent rounded-md">
                <div>
                  <p className="font-medium">backup-2023-07-25-120035.zip</p>
                  <p className="text-xs text-muted-foreground">25/07/2023 12:00:35 - 24.5 MB</p>
                </div>
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex justify-between items-center p-2 hover:bg-accent rounded-md">
                <div>
                  <p className="font-medium">backup-2023-07-22-093015.zip</p>
                  <p className="text-xs text-muted-foreground">22/07/2023 09:30:15 - 23.8 MB</p>
                </div>
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex justify-between items-center p-2 hover:bg-accent rounded-md">
                <div>
                  <p className="font-medium">backup-2023-07-18-143212.zip</p>
                  <p className="text-xs text-muted-foreground">18/07/2023 14:32:12 - 23.5 MB</p>
                </div>
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
