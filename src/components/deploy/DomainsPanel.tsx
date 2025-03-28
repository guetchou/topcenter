
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ExternalLink, RefreshCw, ShieldCheck, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Domain {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'error';
  ssl: 'valid' | 'expiring' | 'expired' | 'none';
  expirationDate?: Date;
  isPrimary: boolean;
}

export const DomainsPanel: React.FC = () => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDomains = async () => {
      setIsLoading(true);
      try {
        // Simuler un appel API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setDomains([
          { 
            id: '1', 
            name: 'topcenter.com', 
            status: 'active', 
            ssl: 'valid',
            expirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90), // 90 jours dans le futur
            isPrimary: true
          },
          { 
            id: '2', 
            name: 'topcenter.net', 
            status: 'active', 
            ssl: 'valid',
            expirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 jours dans le futur 
            isPrimary: false
          },
          { 
            id: '3', 
            name: 'topcenter.org', 
            status: 'active', 
            ssl: 'expiring',
            expirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10), // 10 jours dans le futur
            isPrimary: false
          },
          { 
            id: '4', 
            name: 'topcenter.dev', 
            status: 'pending', 
            ssl: 'none',
            isPrimary: false
          }
        ]);
      } catch (error) {
        console.error("Erreur lors de la récupération des domaines:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDomains();
  }, []);

  const refreshDomains = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const getSSLBadge = (ssl: Domain['ssl']) => {
    switch (ssl) {
      case 'valid':
        return <Badge className="bg-green-500"><ShieldCheck className="w-3 h-3 mr-1" /> Valide</Badge>;
      case 'expiring':
        return <Badge className="bg-yellow-500"><AlertTriangle className="w-3 h-3 mr-1" /> Expirant</Badge>;
      case 'expired':
        return <Badge className="bg-red-500"><AlertTriangle className="w-3 h-3 mr-1" /> Expiré</Badge>;
      case 'none':
        return <Badge className="bg-gray-500">Non configuré</Badge>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: Domain['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Actif</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">En attente</Badge>;
      case 'error':
        return <Badge className="bg-red-500">Erreur</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Domaines</CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={refreshDomains}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Rafraîchir
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Domaine</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>SSL</TableHead>
                <TableHead>Expiration</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {domains.map((domain) => (
                <TableRow key={domain.id}>
                  <TableCell>
                    <div className="flex items-center">
                      {domain.name}
                      {domain.isPrimary && (
                        <Badge variant="outline" className="ml-2">Principal</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(domain.status)}</TableCell>
                  <TableCell>{getSSLBadge(domain.ssl)}</TableCell>
                  <TableCell>
                    {domain.expirationDate ? (
                      <span className={`
                        ${domain.ssl === 'expiring' ? 'text-yellow-600' : ''}
                        ${domain.ssl === 'expired' ? 'text-red-600' : ''}
                      `}>
                        {domain.expirationDate.toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visiter
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
