
import React from 'react';
import { Helmet } from 'react-helmet-async';
import DatabaseStatus from '@/components/admin/DatabaseStatus';

const Dashboard: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Dashboard - TopCenter</title>
      </Helmet>
      
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Tableau de bord administrateur</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <DatabaseStatus />
        </div>
        
        <div className="p-6 bg-slate-50 border rounded-md dark:bg-slate-900">
          <p className="text-muted-foreground">
            Bienvenue dans l'interface d'administration TopCenter. 
            Vous pouvez gérer vos contenus, utilisateurs et paramètres à partir de ce tableau de bord.
          </p>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
