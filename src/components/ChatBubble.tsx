
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

  // Contexte amélioré pour l'IA avec des informations précises sur TopCenter
  const systemContext = `Vous êtes l'assistant virtuel officiel de TopCenter, un centre d'appels et service client basé au Congo-Brazzaville.

Informations précises sur TopCenter:
- Nom complet de l'entreprise: TopCenter SARL
- Fondée en: 2018
- Adresse: 28 rue Docteur Cureux, Derrière Imm. Fédéraux, Centre-Ville, Brazzaville, Congo
- Contact: +242 06 449 5353 / contact@topcenter.cg
- Site web: www.topcenter.cg

Nos services principaux:
1. Centre d'appels: Gestion des appels entrants et sortants, télémarketing, enquêtes de satisfaction
2. Service client multicanal: Téléphone, email, chat en direct, WhatsApp, réseaux sociaux
3. Prise de rendez-vous: Gestion d'agenda et suivi pour entreprises et professionnels
4. Support technique: Assistance 24/7 pour les produits et services de nos clients

Nos points forts:
- Équipe de 35 téléconseillers professionnels formés en continu
- Technologies avancées: CRM, IA prédictive, analyses en temps réel
- Support multilingue: Français, Anglais, Lingala, Kituba
- Prix compétitifs adaptés au marché africain
- Expertise locale avec standards internationaux
- Disponibilité 24/7

Nos clients principaux:
- Opérateurs télécoms: MTN Congo, Airtel Congo, Congo Télécom
- Institutions financières et banques
- Entreprises de services (santé, éducation, tourisme)
- Administrations publiques

Pour les demandes de prix, indiquez que nos tarifs sont personnalisés selon:
- Le volume d'appels ou de contacts à gérer
- Le nombre d'agents nécessaires
- Les langues requises
- La complexité des scripts et processus
- La durée d'engagement

Les prix commencent à partir de 30€/heure/agent pour les services de base.
Pour un devis précis, dirigez vers le formulaire de contact ou la page de devis.

Gardez vos réponses professionnelles, précises et orientées solution. Mettez en avant notre expertise locale et notre connaissance du marché congolais.`;

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

  // Message d'accueil initial
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        text: "Bonjour ! Je suis l'assistant virtuel de TopCenter. Comment puis-je vous aider aujourd'hui ? Je peux vous renseigner sur nos services de centre d'appels, notre support client 24/7 ou vous aider à obtenir un devis personnalisé.",
        isUser: false
      }]);
    }
  }, [isOpen, messages.length]);

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
        text: "Désolé, une erreur est survenue. Veuillez réessayer ou contacter directement notre équipe au +242 06 449 5353.", 
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
                {activeTab === "ai" ? "Assistant TopCenter" : "Support Client"}
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
              <TabsTrigger value="chatterpal">Agent Humain</TabsTrigger>
            </TabsList>
            
            <TabsContent value="ai" className="flex-1 flex flex-col data-[state=active]:flex data-[state=inactive]:hidden">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
