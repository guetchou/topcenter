
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Copy, Info } from "lucide-react";
import { toast } from "sonner";

export const CredentialsDocPage = () => {
  const credentials = [
    { role: 'master_admin', email: 'master@topcenter.app', password: 'password123', description: 'Accès complet à toutes les fonctionnalités' },
    { role: 'super_admin', email: 'super@topcenter.app', password: 'password123', description: 'Accès à la gestion des utilisateurs et configurations' },
    { role: 'admin', email: 'admin@topcenter.app', password: 'password123', description: 'Accès au CMS et tableaux de bord' },
    { role: 'commercial_agent', email: 'commercial@topcenter.app', password: 'password123', description: 'Gestion des clients et ventes' },
    { role: 'support_agent', email: 'support@topcenter.app', password: 'password123', description: 'Assistance client et tickets' },
    { role: 'client', email: 'client@topcenter.app', password: 'password123', description: 'Accès restreint au portail client' },
  ];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copié dans le presse-papier');
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-2 mb-6">
        <h1 className="text-3xl font-bold">Identifiants par défaut</h1>
        <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium inline-flex items-center">
          <Info className="w-3 h-3 mr-1" />
          Pour tests uniquement
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Comment utiliser ces identifiants</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Ces identifiants vous permettent de tester les différents rôles utilisateur dans le système. Pour des environnements de production, 
            assurez-vous de modifier les mots de passe ou de supprimer ces comptes.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste des identifiants</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rôle</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Mot de passe</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[150px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {credentials.map((cred) => (
                <TableRow key={cred.role}>
                  <TableCell className="font-medium">{cred.role}</TableCell>
                  <TableCell>{cred.email}</TableCell>
                  <TableCell>{cred.password}</TableCell>
                  <TableCell>{cred.description}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleCopy(cred.email)}>
                        <Copy className="h-3 w-3 mr-1" /> Email
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleCopy(cred.password)}>
                        <Copy className="h-3 w-3 mr-1" /> MDP
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CredentialsDocPage;
