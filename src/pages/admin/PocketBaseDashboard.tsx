
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import usePocketBaseStatus from '@/hooks/usePocketBaseStatus';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const PocketBaseDashboard = () => {
  const { isConnected, isChecking } = usePocketBaseStatus();

  return (
    <>
      <Helmet>
        <title>PocketBase Dashboard - TopCenter</title>
      </Helmet>
      
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">PocketBase Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>État de la connexion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-3 h-3 rounded-full bg-gray-300">
                  {isChecking && <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></div>}
                  {!isChecking && isConnected && <div className="w-3 h-3 rounded-full bg-green-500"></div>}
                  {!isChecking && !isConnected && <div className="w-3 h-3 rounded-full bg-red-500"></div>}
                </div>
                <span>
                  {isChecking && "Vérification de la connexion..."}
                  {!isChecking && isConnected && "Connecté à PocketBase"}
                  {!isChecking && !isConnected && "Non connecté à PocketBase"}
                </span>
              </div>
              
              <div className="space-y-2 mt-4">
                <p className="text-sm text-muted-foreground">
                  URL: {import.meta.env.VITE_POCKETBASE_URL || 'Non configurée'}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to="/admin/database-explorer">
                <Button className="w-full">Explorateur de base de données</Button>
              </Link>
              <Link to="/admin/pocketbase-test">
                <Button variant="outline" className="w-full">Tester PocketBase</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PocketBaseDashboard;
