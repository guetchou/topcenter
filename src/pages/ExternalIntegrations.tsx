
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Settings, 
  Zap, 
  Database, 
  Brain, 
  Mail, 
  CreditCard, 
  Check, 
  X, 
  AlertCircle 
} from 'lucide-react';
import { externalServicesManager, ExternalIntegration } from '@/services/integrations/externalServices';
import { pythonConnector } from '@/services/python/pythonConnector';
import { toast } from 'sonner';

export default function ExternalIntegrations() {
  const [integrations, setIntegrations] = useState<ExternalIntegration[]>([]);
  const [selectedIntegration, setSelectedIntegration] = useState<ExternalIntegration | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = () => {
    const allIntegrations = externalServicesManager.getIntegrations();
    setIntegrations(allIntegrations);
  };

  const handleTestConnection = async (integration: ExternalIntegration) => {
    setIsTestingConnection(true);
    try {
      const success = await externalServicesManager.testIntegration(integration.id);
      if (success) {
        loadIntegrations(); // Refresh status
      }
    } catch (error) {
      toast.error('Erreur lors du test de connexion');
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleConfigureIntegration = (integration: ExternalIntegration) => {
    setSelectedIntegration(integration);
    setApiKey(integration.config.apiKey || '');
    setIsConfigDialogOpen(true);
  };

  const handleSaveConfiguration = () => {
    if (selectedIntegration && apiKey) {
      externalServicesManager.updateIntegrationApiKey(selectedIntegration.id, apiKey);
      toast.success('Configuration sauvegardée');
      setIsConfigDialogOpen(false);
      loadIntegrations();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getIntegrationIcon = (id: string) => {
    if (id.includes('python-data')) return <Database className="w-5 h-5" />;
    if (id.includes('python-ai')) return <Brain className="w-5 h-5" />;
    if (id.includes('openai')) return <Brain className="w-5 h-5" />;
    if (id.includes('stripe')) return <CreditCard className="w-5 h-5" />;
    if (id.includes('sendgrid')) return <Mail className="w-5 h-5" />;
    return <Zap className="w-5 h-5" />;
  };

  const pythonServices = integrations.filter(i => i.id.startsWith('python-'));
  const externalApis = integrations.filter(i => !i.id.startsWith('python-'));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Intégrations Externes</h1>
        <p className="text-muted-foreground">
          Gérez les connexions avec les services Python et les API externes
        </p>
      </div>

      <Tabs defaultValue="python" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="python">Services Python</TabsTrigger>
          <TabsTrigger value="external">API Externes</TabsTrigger>
        </TabsList>

        <TabsContent value="python" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pythonServices.map((integration) => (
              <Card key={integration.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center space-x-2">
                    {getIntegrationIcon(integration.id)}
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`${getStatusColor(integration.status)} text-white`}
                  >
                    {integration.status}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    {integration.description}
                  </CardDescription>
                  
                  <div className="text-sm text-muted-foreground mb-4">
                    <p>URL: {integration.config.baseUrl}</p>
                    {integration.lastSync && (
                      <p>Dernière sync: {new Date(integration.lastSync).toLocaleString()}</p>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleTestConnection(integration)}
                      disabled={isTestingConnection}
                    >
                      {integration.status === 'active' ? (
                        <Check className="w-4 h-4 mr-2" />
                      ) : (
                        <AlertCircle className="w-4 h-4 mr-2" />
                      )}
                      Tester
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleConfigureIntegration(integration)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Configurer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="external" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {externalApis.map((integration) => (
              <Card key={integration.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center space-x-2">
                    {getIntegrationIcon(integration.id)}
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`${getStatusColor(integration.status)} text-white`}
                  >
                    {integration.status}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    {integration.description}
                  </CardDescription>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm">Activé</span>
                    <Switch checked={integration.status === 'active'} />
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleConfigureIntegration(integration)}
                    className="w-full"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Configurer
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Configurer {selectedIntegration?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="apiKey" className="text-right">
                Clé API
              </Label>
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="col-span-3"
                placeholder="Saisissez votre clé API"
              />
            </div>
            
            {selectedIntegration && (
              <div className="text-sm text-muted-foreground">
                <p>URL de base: {selectedIntegration.config.baseUrl}</p>
                <p>Timeout: {selectedIntegration.config.timeout}ms</p>
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsConfigDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveConfiguration}>
              Sauvegarder
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
