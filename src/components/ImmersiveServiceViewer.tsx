
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

/**
 * Composant temporairement désactivé pour éviter les erreurs Three.js
 * Nécessite une refactorisation complète pour corriger les types
 */
export const ImmersiveServiceViewer: React.FC = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          Visualisation 3D - En maintenance
        </CardTitle>
        <CardDescription>
          Ce composant nécessite une refactorisation pour corriger les types Three.js
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[400px] bg-muted rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground">Composant en cours de développement</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImmersiveServiceViewer;
