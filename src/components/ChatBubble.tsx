
// @ts-nocheck
import { Bot, MessageSquareText, X, User, ArrowLeft, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const AIChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("perplexity");
  const [activeTab, setActiveTab] = useState("ai");
  const [chatterpalLoaded, setChatterpalLoaded] = useState(false);

  const systemContext = `Vous êtes l'assistant virtuel de TopCenter, une entreprise spécialisée dans la relation client et les centres d'appels.

Voici les informations clés sur TopCenter :
- Services principaux : Centre d'appel, service client 24/7, prise de rendez-vous, chat en direct, support multilingue
- Points forts : Technologies avancées (IA, analyses en temps réel), équipe professionnelle, disponibilité 24/7
- Valeurs : Excellence du service client, innovation technologique, satisfaction client
- Contact : Formulaire sur le site, chat en direct, téléphone
- Localisation : France

Si on vous pose des questions sur les prix, indiquez qu'ils varient selon les besoins spécifiques et recommandez de contacter l'équipe commerciale via le formulaire de contact.

Répondez de manière professionnelle, courtoise et engageante.`;

  // Initialiser ChatterPal
  useEffect(() => {
    if (activeTab === "chatterpal" && isOpen && !chatterpalLoaded) {
      // On s'assure que le script ChatterPal est chargé
      if (window.ChatPal) {
        try {
          // On réinitialise ChatterPal si nécessaire
          if (window.chatPal) {
            // Si chatPal existe déjà, on ne fait rien
          } else {
            window.chatPal = new window.ChatPal({
              embedId: '2yyMeBsp8GxX', 
              remoteBaseUrl: 'https://chatterpal.me/', 
              version: '8.3',
              containerSelector: '#chatterpal-container'
            });
          }
          setChatterpalLoaded(true);
        } catch (error) {
          console.error("Erreur lors de l'initialisation de ChatterPal:", error);
        }
      }
    }
  }, [activeTab, isOpen]);

  // Fonction pour gérer l'envoi de message à l'assistant IA
  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const newMessage = { text: message, isUser: true };
    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);
    
    try {
      let response;
      
      if (selectedModel === "perplexity") {
        response = await supabase.functions.invoke('ai-chat', {
          body: { 
            message,
            context: systemContext,
            previousMessages: messages
          }
        });
      } else {
        response = await supabase.functions.invoke('local-ai', {
          body: { 
            message,
            context: systemContext,
            model: selectedModel,
            previousMessages: messages
          }
        });
      }

      if (response.error) throw response.error;

      const botResponse = { 
        text: response.data.choices[0].message.content, 
        isUser: false 
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      setMessages(prev => [...prev, { 
        text: "Désolé, une erreur est survenue. Veuillez réessayer.", 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
      setMessage("");
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-background border rounded-lg shadow-lg w-[350px] max-h-[500px] flex flex-col animate-in slide-in-from-bottom-5">
          <div className="p-4 border-b flex items-center justify-between bg-primary/5 rounded-t-lg">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                {activeTab === "ai" ? (
                  <Bot className="w-5 h-5 text-primary" />
                ) : (
                  <User className="w-5 h-5 text-primary" />
                )}
              </div>
              <span className="font-medium">
                {activeTab === "ai" ? "Assistant IA" : "Support Client"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {activeTab === "ai" && (
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="w-24 h-8">
                    <SelectValue placeholder="Modèle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="perplexity">Perplexity</SelectItem>
                    <SelectItem value="llama2">Llama 2</SelectItem>
                    <SelectItem value="mistral">Mistral 7B</SelectItem>
                    <SelectItem value="bloom">BLOOM</SelectItem>
                  </SelectContent>
                </Select>
              )}
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Tabs defaultValue="ai" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid grid-cols-2 mx-4 my-2">
              <TabsTrigger value="ai">Assistant IA</TabsTrigger>
              <TabsTrigger value="chatterpal">Support Humain</TabsTrigger>
            </TabsList>
            
            <TabsContent value="ai" className="flex-1 flex flex-col data-[state=active]:flex data-[state=inactive]:hidden">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                  <div className="text-center text-muted-foreground">
                    Bonjour ! Je suis l'assistant virtuel de TopCenter. Comment puis-je vous aider aujourd'hui ?
                  </div>
                )}
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex",
                      msg.isUser ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-lg p-3",
                        msg.isUser
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg p-3 animate-pulse">
                      En train d'écrire...
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex gap-2"
                >
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Écrivez votre message..."
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" disabled={isLoading}>
                    <MessageSquareText className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </TabsContent>
            
            <TabsContent value="chatterpal" className="flex-1 data-[state=active]:flex data-[state=inactive]:hidden">
              <div id="chatterpal-container" className="w-full h-full flex-1 overflow-hidden">
                {!chatterpalLoaded && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full w-12 h-12 shadow-lg animate-bounce-subtle"
        >
          <MessageSquareText className="w-6 h-6" />
        </Button>
      )}
    </div>
  );
};
