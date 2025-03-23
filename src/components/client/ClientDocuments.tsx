
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const ClientDocuments = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents</CardTitle>
        <CardDescription>Accédez à vos documents importants</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center p-10">
          <p className="text-muted-foreground">Liste des documents en développement</p>
        </div>
      </CardContent>
    </Card>
  );
};
