
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const ClientEvents = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendrier des événements</CardTitle>
        <CardDescription>Consultez vos rendez-vous et événements à venir</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center p-10">
          <p className="text-muted-foreground">Calendrier des événements en développement</p>
        </div>
      </CardContent>
    </Card>
  );
};
