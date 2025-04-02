
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Rocket, Bot, Info } from "lucide-react";

interface ChatBotSettings {
  id: string;
  name: string;
  enabled: boolean;
  script_id: string;
  embed_id: string;
  description: string;
}

const ChatBotsSettingsPage = () => {
  const queryClient = useQueryClient();
  
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
            script_id: "v8HfNRZjDyZ3",
            embed_id: "v8HfNRZjDyZ3",
            description: "Chatbot principal intégré dans l'index.html"
          },
          {
            id: "2",
            name: "ChatPal Secondaire",
            enabled: false,
            script_id: "HSNNDA8bdXzs", 
            embed_id: "HSNNDA8bdXzs",
            description: "Chatbot secondaire avec configuration alternative"
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
    mutationFn: async ({ id, enabled }: { id: string; enabled: boolean }) => {
      const { error } = await supabase
        .from("chatbots_settings")
        .update({ enabled })
        .eq("id", id);
        
      if (error) throw error;
      
      return { id, enabled };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatbots-settings"] });
      toast.success("Configuration du chatbot mise à jour");
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour du chatbot:", error);
      toast.error("Erreur lors de la mise à jour");
    }
  });
  
  const handleToggle = (id: string, enabled: boolean) => {
    updateChatbotMutation.mutate({ id, enabled: !enabled });
  };
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Chargement des configurations...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestion des Chatbots</h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {chatbots?.map((chatbot) => (
          <Card key={chatbot.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  {chatbot.name}
                </CardTitle>
                <Switch 
                  checked={chatbot.enabled} 
                  onCheckedChange={() => handleToggle(chatbot.id, chatbot.enabled)}
                  aria-label={`Activer ${chatbot.name}`}
                />
              </div>
              <CardDescription>{chatbot.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`embed-id-${chatbot.id}`}>ID d'intégration</Label>
                  <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    {chatbot.embed_id}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t px-6 py-4">
              <div className="flex items-center text-xs text-muted-foreground">
                <Info className="mr-1 h-3 w-3" />
                {chatbot.enabled ? "Actif sur le site" : "Désactivé"}
              </div>
              <div className="text-xs text-muted-foreground">
                ID: {chatbot.id}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ChatBotsSettingsPage;
