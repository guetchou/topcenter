
import React from 'react';
import { Helmet } from 'react-helmet-async';

const DatabaseExplorerPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Explorateur de base de données - TopCenter</title>
      </Helmet>
      
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Explorateur de base de données</h1>
        
        <div className="p-6 bg-slate-50 border rounded-md dark:bg-slate-900">
          <p className="text-muted-foreground">
            L'explorateur de base de données est en cours de développement. 
            Cette fonctionnalité vous permettra d'explorer et de manipuler vos données directement 
            depuis l'interface d'administration.
          </p>
        </div>
      </div>
    </>
  );
};

export default DatabaseExplorerPage;
