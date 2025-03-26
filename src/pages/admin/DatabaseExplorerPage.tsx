
import React from 'react';
import { Helmet } from 'react-helmet-async';
import DatabaseExplorer from '@/components/admin/DatabaseExplorer';

const DatabaseExplorerPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Explorateur de base de données - TopCenter</title>
      </Helmet>
      
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Explorateur de base de données</h1>
        <DatabaseExplorer />
      </div>
    </>
  );
};

export default DatabaseExplorerPage;
