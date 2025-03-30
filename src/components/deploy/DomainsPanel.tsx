
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, Check, RefreshCw } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const DomainsPanel: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Gestion des domaines</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Domaine</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Statut DNS</TableHead>
              <TableHead>SSL</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">example.com</TableCell>
              <TableCell>Principal</TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                  <Check className="h-3 w-3 mr-1" /> Actif
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                  <Check className="h-3 w-3 mr-1" /> Actif
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">
                  <RefreshCw className="h-4 w-4 mr-1" /> Vérifier
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">subdomain.example.com</TableCell>
              <TableCell>Sous-domaine</TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                  <Check className="h-3 w-3 mr-1" /> Actif
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                  <Check className="h-3 w-3 mr-1" /> Actif
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">
                  <RefreshCw className="h-4 w-4 mr-1" /> Vérifier
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        
        <div className="mt-4">
          <Button>
            <Globe className="h-4 w-4 mr-2" />
            Ajouter un domaine
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
