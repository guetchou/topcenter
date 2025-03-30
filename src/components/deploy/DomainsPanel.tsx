
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Globe, Plus, RefreshCw, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

type DomainStatus = 'active' | 'pending' | 'error' | 'expired';

interface Domain {
  id: string;
  name: string;
  status: DomainStatus;
  expiresAt: Date | null;
  isCustom: boolean;
}

export const DomainsPanel: React.FC = () => {
  const [domains, setDomains] = useState<Domain[]>([
    {
      id: '1',
      name: 'topcenter.lovable.app',
      status: 'active',
      expiresAt: null,
      isCustom: false
    },
    {
      id: '2',
      name: 'hub.topcenter.cg',
      status: 'active',
      expiresAt: new Date(2025, 8, 15),
      isCustom: true
    },
    {
      id: '3',
      name: 'test.topcenter.cg',
      status: 'pending',
      expiresAt: new Date(2025, 8, 15),
      isCustom: true
    }
  ]);
  
  const [newDomain, setNewDomain] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefreshDomains = () => {
    setIsRefreshing(true);
    
    // Simuler un API call
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('Statut des domaines mis à jour');
    }, 1500);
  };
  
  const handleAddDomain = () => {
    if (!newDomain) return;
    
    // Validation simple du domaine
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
    if (!domainRegex.test(newDomain)) {
      toast.error('Format de domaine invalide');
      return;
    }
    
    // Vérifier si le domaine existe déjà
    if (domains.some(d => d.name === newDomain)) {
      toast.error('Ce domaine existe déjà');
      return;
    }
    
    // Ajouter le nouveau domaine
    setDomains([
      ...domains,
      {
        id: Date.now().toString(),
        name: newDomain,
        status: 'pending',
        expiresAt: null,
        isCustom: true
      }
    ]);
    
    setNewDomain('');
    toast.success('Domaine ajouté, en attente de vérification');
  };
  
  const getStatusBadge = (status: DomainStatus) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Actif</Badge>;
      case 'pending':
        return <Badge variant="default">En attente</Badge>;
      case 'error':
        return <Badge variant="destructive">Erreur</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expiré</Badge>;
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            Domaines
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefreshDomains}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            type="text"
            placeholder="exemple.com"
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
          />
          <Button onClick={handleAddDomain}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Domaine</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Expiration</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {domains.map((domain) => (
              <TableRow key={domain.id}>
                <TableCell>
                  <div className="font-medium">{domain.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {domain.isCustom ? 'Personnalisé' : 'Défaut'}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(domain.status)}</TableCell>
                <TableCell>
                  {domain.expiresAt ? domain.expiresAt.toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" asChild>
                    <a href={`https://${domain.name}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
