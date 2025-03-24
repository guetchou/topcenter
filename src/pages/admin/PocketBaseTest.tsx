
import React from 'react';
import PocketBaseAdminTest from '@/components/admin/PocketBaseAdminTest';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const PocketBaseTestPage: React.FC = () => {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Test de l'API PocketBase</h1>
        <p className="text-muted-foreground">
          Cette page vous permet de tester la connexion à l'API PocketBase et l'authentification admin.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <PocketBaseAdminTest />
        
        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
            <CardDescription>
              Comment utiliser l'outil de test PocketBase
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">Test de connexion</h3>
              <p className="text-sm text-muted-foreground">
                Le test de connexion vérifie simplement si l'API PocketBase est accessible 
                et répond correctement aux requêtes. Ce test utilise l'endpoint "health" 
                de PocketBase qui ne nécessite pas d'authentification.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-1">Test d'authentification admin</h3>
              <p className="text-sm text-muted-foreground">
                Ce test tente d'authentifier un compte administrateur avec les identifiants 
                fournis. Si l'authentification réussit, vous verrez les informations du compte 
                admin et le token JWT généré.
              </p>
            </div>
            
            <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded dark:bg-amber-900/20 dark:border-amber-800">
              <h3 className="font-medium mb-1 text-amber-800 dark:text-amber-400">Important</h3>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Cette page est réservée aux tests et ne doit pas être utilisée en production. 
                Les identifiants d'authentification ne doivent pas être exposés dans le code client.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PocketBaseTestPage;
