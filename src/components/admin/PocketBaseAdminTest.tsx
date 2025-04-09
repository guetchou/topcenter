
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { testPocketBaseConnection } from '@/integrations/pocketbase/client';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface AdminAuthResponse {
  admin: {
    id: string;
    created: string;
    updated: string;
    avatar: number;
    email: string;
  };
  token: string;
}

export const PocketBaseAdminTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<'idle' | 'success' | 'error'>('idle');
  const [adminData, setAdminData] = useState<AdminAuthResponse | null>(null);
  
  const testPocketBaseHealth = async () => {
    setIsLoading(true);
    setTestResult('idle');
    
    try {
      const result = await testPocketBaseConnection('https://api.topcenter.cg');
      if (result.success) {
        setTestResult('success');
      } else {
        setTestResult('error');
      }
    } catch (error) {
      console.error('Test error:', error);
      setTestResult('error');
    } finally {
      setIsLoading(false);
    }
  };
  
  const testAdminAuth = async () => {
    setIsLoading(true);
    setAdminData(null);
    
    try {
      const response = await fetch('https://api.topcenter.cg/api/admins/auth-with-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          identity: 'admin@topcenter.cg',
          password: 'Admin2013-'
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      
      const data = await response.json();
      setAdminData(data);
      toast.success('Authentification admin réussie', {
        description: `Admin: ${data.admin.email}`
      });
    } catch (error) {
      console.error('Admin auth error:', error);
      toast.error('Échec de l\'authentification admin', {
        description: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Test de PocketBase</CardTitle>
        <CardDescription>
          Vérifiez la connexion à l'API PocketBase et l'authentification admin
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={testPocketBaseHealth} 
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Test en cours...
              </>
            ) : (
              'Tester la connexion'
            )}
          </Button>
          
          <Button 
            onClick={testAdminAuth} 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Auth en cours...
              </>
            ) : (
              'Tester auth admin'
            )}
          </Button>
        </div>
        
        {testResult !== 'idle' && (
          <div className="mt-4 p-3 border rounded">
            <h3 className="font-medium mb-2 flex items-center">
              Résultat du test:
              {testResult === 'success' ? (
                <CheckCircle className="ml-2 h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="ml-2 h-5 w-5 text-red-500" />
              )}
            </h3>
            <Badge variant={testResult === 'success' ? "secondary" : "destructive"} className={testResult === 'success' ? "bg-green-100 text-green-800" : ""}>
              {testResult === 'success' ? 'Connecté' : 'Échec de connexion'}
            </Badge>
          </div>
        )}
        
        {adminData && (
          <div className="mt-4 p-3 border rounded bg-slate-50 dark:bg-slate-900">
            <h3 className="font-medium mb-2">Données Admin:</h3>
            <div className="text-sm space-y-1">
              <p><span className="font-medium">ID:</span> {adminData.admin.id}</p>
              <p><span className="font-medium">Email:</span> {adminData.admin.email}</p>
              <p><span className="font-medium">Créé le:</span> {new Date(adminData.admin.created).toLocaleString()}</p>
              <p className="truncate"><span className="font-medium">Token:</span> {adminData.token.substring(0, 20)}...</p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        URL de l'API: https://api.topcenter.cg
      </CardFooter>
    </Card>
  );
};

export default PocketBaseAdminTest;
