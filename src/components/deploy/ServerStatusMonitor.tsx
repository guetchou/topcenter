
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export const ServerStatusMonitor: React.FC = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">État des services</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-950/20 rounded border border-green-200 dark:border-green-900">
            <span className="font-medium">Serveur Web</span>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600 dark:text-green-400 text-sm">Opérationnel</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-950/20 rounded border border-green-200 dark:border-green-900">
            <span className="font-medium">Base de données</span>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600 dark:text-green-400 text-sm">Opérationnel</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-950/20 rounded border border-green-200 dark:border-green-900">
            <span className="font-medium">DNS</span>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600 dark:text-green-400 text-sm">Opérationnel</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-950/20 rounded border border-green-200 dark:border-green-900">
            <span className="font-medium">GitHub Actions</span>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600 dark:text-green-400 text-sm">Opérationnel</span>
            </div>
          </div>
          
          <div className="mt-2 text-xs text-muted-foreground text-center">
            Dernière vérification: il y a 2 minutes
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
