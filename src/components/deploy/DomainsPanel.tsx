
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export const DomainsPanel: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [domains, setDomains] = useState<any[]>([]);

  const fetchDomainsFromInfomaniak = async () => {
    setIsLoading(true);
    
    try {
      // Vérifier la présence du token
      const infomaniakToken = import.meta.env.VITE_INFOMANIAK_TOKEN;
      if (!infomaniakToken) {
        throw new Error("VITE_INFOMANIAK_TOKEN n'est pas défini");
      }

      // Simulation de chargement
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Données simulées
      const simulatedDomains = [
        { id: 1, domain_name: "topcenter.cg", status: "active" },
        { id: 2, domain_name: "api.topcenter.cg", status: "active" },
        { id: 3, domain_name: "admin.topcenter.cg", status: "active" }
      ];
      
      setDomains(simulatedDomains);
      toast.success(`${simulatedDomains.length} domaines chargés`);
    } catch (error) {
      console.error("Erreur API Infomaniak:", error);
      toast.error("Échec de chargement des domaines");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Domaines</CardTitle>
        <Button 
          onClick={fetchDomainsFromInfomaniak} 
          disabled={isLoading} 
          variant="outline"
          size="sm"
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Chargement...
            </>
          ) : (
            <>
              <Globe2 className="mr-2 h-4 w-4" />
              Charger mes domaines
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        {domains.length > 0 ? (
          <div className="divide-y">
            {domains.map((domain) => (
              <div key={domain.id} className="py-3 flex justify-between items-center">
                <div className="flex items-center">
                  <Globe2 className="mr-2 h-4 w-4 text-primary" />
                  <div>
                    <div className="font-medium">{domain.domain_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {domain.status === 'active' ? (
                        <span className="text-green-600">Actif</span>
                      ) : (
                        <span className="text-amber-600">Inactif</span>
                      )}
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">Gérer</Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Cliquez sur "Charger mes domaines" pour voir vos domaines
          </div>
        )}
      </CardContent>
    </Card>
  );
};
