
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const ClientRequests = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des demandes</CardTitle>
        <CardDescription>Suivez l'avancement de vos demandes de service</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center p-10">
          <p className="text-muted-foreground">Contenu des demandes en développement</p>
        </div>
      </CardContent>
    </Card>
  );
};
