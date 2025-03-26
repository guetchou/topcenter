
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import DatabaseStatus from '@/components/admin/DatabaseStatus';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Rocket, Save, Globe2 } from 'lucide-react';

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
          
          <Card>
            <CardHeader>
              <CardTitle>Déploiement</CardTitle>
              <CardDescription>Gestion des déploiements et sauvegardes</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-muted-foreground text-sm">
                Accédez aux tableaux de bord de déploiement pour gérer votre site
              </p>
              <div className="flex flex-wrap gap-2">
                <Link to="/deploy">
                  <Button variant="outline" size="sm">
                    <Rocket className="h-4 w-4 mr-2" />
                    Dashboard simple
                  </Button>
                </Link>
                <Link to="/deployment">
                  <Button variant="default" size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    Dashboard avancé
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
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
