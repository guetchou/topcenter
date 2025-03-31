
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Rocket, Bot, Info, Plus, Trash2, Edit, Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useChatPal, ChatPalConfig } from "@/hooks/useChatPal";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ChatBotSettings extends ChatPalConfig {
  description?: string;
  script_id?: string;
}

const ChatBotsSettingsPage = () => {
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newChatbot, setNewChatbot] = useState<Partial<ChatBotSettings>>({
    name: '',
    embedId: '',
    enabled: true,
    remoteBaseUrl: 'https://chatappdemo.com/',
    version: '8.3',
    description: ''
  });
  
  const { data: chatbots, isLoading } = useQuery({
    queryKey: ["chatbots-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chatbots_settings")
        .select("*")
        .order("name");
        
      if (error) throw error;
      
      // Si aucun chatbot n'existe encore, initialiser avec les valeurs par défaut
      if (!data || data.length === 0) {
        const defaultChatbots: ChatBotSettings[] = [
          {
            id: "1",
            name: "ChatPal Primaire",
            enabled: true,
            embedId: "v8HfNRZjDyZ3",
            script_id: "v8HfNRZjDyZ3",
            description: "Chatbot principal intégré dans l'index.html",
            remoteBaseUrl: "https://chatappdemo.com/",
            version: "8.3"
          },
          {
            id: "2",
            name: "ChatPal Secondaire",
            enabled: false,
            embedId: "HSNNDA8bdXzs", 
            script_id: "HSNNDA8bdXzs",
            description: "Chatbot secondaire avec configuration alternative",
            remoteBaseUrl: "https://chatappdemo.com/",
            version: "8.3"
          }
        ];
        
        // Insérer les valeurs par défaut
        await supabase.from("chatbots_settings").insert(defaultChatbots);
        
        return defaultChatbots;
      }
      
      return data as ChatBotSettings[];
    }
  });
  
  const updateChatbotMutation = useMutation({
    mutationFn: async (chatbot: Partial<ChatBotSettings>) => {
      const { id, ...updateData } = chatbot;
      const { error } = await supabase
        .from("chatbots_settings")
        .update(updateData)
        .eq("id", id);
        
      if (error) throw error;
      
      return chatbot;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatbots-settings"] });
      toast.success("Configuration du chatbot mise à jour");
      setEditMode(null);
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour du chatbot:", error);
      toast.error("Erreur lors de la mise à jour");
    }
  });
  
  const addChatbotMutation = useMutation({
    mutationFn: async (chatbot: Partial<ChatBotSettings>) => {
      const { error, data } = await supabase
        .from("chatbots_settings")
        .insert(chatbot)
        .select();
        
      if (error) throw error;
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatbots-settings"] });
      toast.success("Nouveau chatbot ajouté");
      setIsAddDialogOpen(false);
      setNewChatbot({
        name: '',
        embedId: '',
        enabled: true,
        remoteBaseUrl: 'https://chatappdemo.com/',
        version: '8.3',
        description: ''
      });
    },
    onError: (error) => {
      console.error("Erreur lors de l'ajout du chatbot:", error);
      toast.error("Erreur lors de l'ajout");
    }
  });
  
  const deleteChatbotMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("chatbots_settings")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatbots-settings"] });
      toast.success("Chatbot supprimé");
    },
    onError: (error) => {
      console.error("Erreur lors de la suppression du chatbot:", error);
      toast.error("Erreur lors de la suppression");
    }
  });
  
  const handleToggle = (id: string, enabled: boolean) => {
    updateChatbotMutation.mutate({ id, enabled: !enabled });
  };
  
  const handleEdit = (chatbot: ChatBotSettings) => {
    setEditMode(chatbot.id);
  };
  
  const handleSave = (chatbot: ChatBotSettings) => {
    updateChatbotMutation.mutate(chatbot);
  };
  
  const handleCancel = () => {
    setEditMode(null);
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce chatbot ?")) {
      deleteChatbotMutation.mutate(id);
    }
  };
  
  const handleAddChatbot = () => {
    addChatbotMutation.mutate(newChatbot);
  };
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Chargement des configurations...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Chatbots</h1>
          <p className="text-muted-foreground">Configurez et gérez les assistants conversationnels sur votre site</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Ajouter un chatbot
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau chatbot</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du chatbot</Label>
                <Input 
                  id="name" 
                  value={newChatbot.name} 
                  onChange={(e) => setNewChatbot({...newChatbot, name: e.target.value})}
                  placeholder="Ex: Support client"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="embedId">ID d'intégration</Label>
                <Input 
                  id="embedId" 
                  value={newChatbot.embedId} 
                  onChange={(e) => setNewChatbot({...newChatbot, embedId: e.target.value})}
                  placeholder="Ex: HSNNDA8bdXzs"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="remoteBaseUrl">URL de base</Label>
                <Input 
                  id="remoteBaseUrl" 
                  value={newChatbot.remoteBaseUrl} 
                  onChange={(e) => setNewChatbot({...newChatbot, remoteBaseUrl: e.target.value})}
                  placeholder="https://chatappdemo.com/"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="version">Version</Label>
                <Input 
                  id="version" 
                  value={newChatbot.version} 
                  onChange={(e) => setNewChatbot({...newChatbot, version: e.target.value})}
                  placeholder="8.3"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={newChatbot.description} 
                  onChange={(e) => setNewChatbot({...newChatbot, description: e.target.value})}
                  placeholder="Description du chatbot et son utilisation..."
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="enabled" 
                  checked={newChatbot.enabled}
                  onCheckedChange={(checked) => setNewChatbot({...newChatbot, enabled: checked})}
                />
                <Label htmlFor="enabled">Activer immédiatement</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Annuler</Button>
              <Button onClick={handleAddChatbot}>Ajouter</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="list">
        <TabsList className="mb-6">
          <TabsTrigger value="list">Liste des chatbots</TabsTrigger>
          <TabsTrigger value="settings">Paramètres globaux</TabsTrigger>
          <TabsTrigger value="test">Tester les chatbots</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {chatbots?.map((chatbot) => (
              <Card key={chatbot.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Bot className="h-5 w-5 text-primary" />
                      {editMode === chatbot.id ? (
                        <Input 
                          value={chatbot.name} 
                          onChange={(e) => {
                            const updated = chatbots.map(c => 
                              c.id === chatbot.id ? {...c, name: e.target.value} : c
                            );
                            queryClient.setQueryData(["chatbots-settings"], updated);
                          }}
                          className="h-7 py-1"
                        />
                      ) : (
                        chatbot.name
                      )}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {editMode === chatbot.id ? (
                        <>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleSave(chatbot)}
                            className="h-8 w-8 p-0"
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={handleCancel}
                            className="h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Switch 
                            checked={chatbot.enabled} 
                            onCheckedChange={() => handleToggle(chatbot.id, chatbot.enabled)}
                            aria-label={`Activer ${chatbot.name}`}
                          />
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEdit(chatbot)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDelete(chatbot.id)}
                            className="h-8 w-8 p-0 text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  <CardDescription>
                    {editMode === chatbot.id ? (
                      <Textarea 
                        value={chatbot.description} 
                        onChange={(e) => {
                          const updated = chatbots.map(c => 
                            c.id === chatbot.id ? {...c, description: e.target.value} : c
                          );
                          queryClient.setQueryData(["chatbots-settings"], updated);
                        }}
                        className="mt-2"
                      />
                    ) : (
                      chatbot.description
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`embed-id-${chatbot.id}`}>ID d'intégration</Label>
                      {editMode === chatbot.id ? (
                        <Input 
                          id={`embed-id-${chatbot.id}`}
                          value={chatbot.embedId} 
                          onChange={(e) => {
                            const updated = chatbots.map(c => 
                              c.id === chatbot.id ? {...c, embedId: e.target.value} : c
                            );
                            queryClient.setQueryData(["chatbots-settings"], updated);
                          }}
                        />
                      ) : (
                        <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                          {chatbot.embedId}
                        </div>
                      )}
                    </div>
                    
                    {editMode === chatbot.id && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor={`remote-url-${chatbot.id}`}>URL de base</Label>
                          <Input 
                            id={`remote-url-${chatbot.id}`}
                            value={chatbot.remoteBaseUrl} 
                            onChange={(e) => {
                              const updated = chatbots.map(c => 
                                c.id === chatbot.id ? {...c, remoteBaseUrl: e.target.value} : c
                              );
                              queryClient.setQueryData(["chatbots-settings"], updated);
                            }}
                            placeholder="https://chatappdemo.com/"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`version-${chatbot.id}`}>Version</Label>
                          <Input 
                            id={`version-${chatbot.id}`}
                            value={chatbot.version} 
                            onChange={(e) => {
                              const updated = chatbots.map(c => 
                                c.id === chatbot.id ? {...c, version: e.target.value} : c
                              );
                              queryClient.setQueryData(["chatbots-settings"], updated);
                            }}
                            placeholder="8.3"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t px-6 py-4">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Info className="mr-1 h-3 w-3" />
                    {chatbot.enabled ? (
                      <Badge variant="success" className="bg-green-100 text-green-800">Actif</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-100 text-gray-800">Inactif</Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ID: {chatbot.id}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres globaux des chatbots</CardTitle>
              <CardDescription>
                Configurez les paramètres qui s'appliquent à tous les chatbots du site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="default-script">Script par défaut</Label>
                <Textarea 
                  id="default-script" 
                  readOnly
                  value={`<script type="text/javascript" src="https://chatappdemo.com/build/js/chatpal.js?8.3" integrity="sha384-+YIWcPZjPZYuhrEm13vJJg76TIO/g7y5B14VE35zhQdrojfD9dPemo7q6vnH44FR" crossorigin="anonymous" data-cfasync="false"></script>`}
                  className="font-mono text-xs"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="default-init">Exemple d'initialisation</Label>
                <Textarea 
                  id="default-init" 
                  readOnly
                  value={`<script>
var chatPal = new ChatPal({
  embedId: 'HSNNDA8bdXzs', 
  remoteBaseUrl: 'https://chatappdemo.com/', 
  version: '8.3'
});
</script>`}
                  className="font-mono text-xs"
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center space-x-2">
                <Switch id="global-enable" />
                <Label htmlFor="global-enable">Activer tous les chatbots</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="collect-analytics" />
                <Label htmlFor="collect-analytics">Collecter les statistiques d'utilisation</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="test">
          <Card>
            <CardHeader>
              <CardTitle>Tester les chatbots</CardTitle>
              <CardDescription>
                Visualisez et testez vos chatbots dans un environnement contrôlé
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <Label>Sélectionner un chatbot à tester</Label>
                  <Select defaultValue={chatbots?.[0]?.id}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner un chatbot" />
                    </SelectTrigger>
                    <SelectContent>
                      {chatbots?.map((chatbot) => (
                        <SelectItem key={chatbot.id} value={chatbot.id}>{chatbot.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <div className="mt-4">
                    <Button className="w-full">Initialiser le chatbot</Button>
                  </div>
                  
                  <div className="mt-6 space-y-2">
                    <Label>Message de test</Label>
                    <div className="flex gap-2">
                      <Input placeholder="Entrez un message de test..." />
                      <Button variant="outline">Envoyer</Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label className="mb-2 block">Aperçu du chatbot</Label>
                  <div className="h-[400px] border rounded-md bg-background/50 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <Bot className="mx-auto h-10 w-10 mb-2" />
                      <p>Sélectionnez et initialisez un chatbot pour le tester</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChatBotsSettingsPage;
