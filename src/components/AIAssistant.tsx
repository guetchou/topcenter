import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, Loader2, MinusCircle, PlusCircle, Phone, MessageSquare, Video, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const AIAssistant = () => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [conversation, setConversation] = useState<Array<{role: string, content: string}>>([]);
  const [activeChannel, setActiveChannel] = useState("ai");
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    const userMessage = { role: "user", content: message };
    setConversation(prev => [...prev, userMessage]);

    try {
      if (activeChannel === "ai") {
        const { data, error } = await supabase.functions.invoke('ai-assistant', {
          body: { messages: [...conversation, userMessage] }
        });

        if (error) throw error;

        const aiResponse = {
          role: "assistant",
          content: data.choices[0].message.content
        };
        
        setConversation(prev => [...prev, aiResponse]);
      } else {
        // Simulate response for other channels
        const response = {
          role: "assistant",
          content: `Un agent va vous répondre sur ${activeChannel} dans quelques instants...`
        };
        setConversation(prev => [...prev, response]);
      }
      
      toast({
        title: "Message envoyé",
        description: "Votre message a bien été transmis.",
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du message.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setMessage("");
    }
  };

  const handleCall = () => {
    toast({
      title: "Appel en cours",
      description: "Un agent va vous contacter dans quelques instants.",
    });
  };

  const handleVideoCall = () => {
    toast({
      title: "Appel vidéo",
      description: "Préparation de l'appel vidéo en cours...",
    });
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 w-96 transition-all duration-300 ${isCollapsed ? 'h-14' : 'h-[600px]'}`}>
      <div className="rounded-lg border bg-card shadow-lg h-full flex flex-col">
        <div 
          className="p-4 border-b bg-muted/50 cursor-pointer flex justify-between items-center"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Assistant Multi-Canal</h3>
          </div>
          <Button variant="ghost" size="icon">
            {isCollapsed ? (
              <PlusCircle className="w-4 h-4" />
            ) : (
              <MinusCircle className="w-4 h-4" />
            )}
          </Button>
        </div>

        {!isCollapsed && (
          <>
            <Tabs defaultValue="ai" className="flex-1 flex flex-col" onValueChange={setActiveChannel}>
              <TabsList className="grid grid-cols-4 p-2">
                <TabsTrigger value="ai">
                  <Bot className="w-4 h-4 mr-2" />
                  IA
                </TabsTrigger>
                <TabsTrigger value="whatsapp">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </TabsTrigger>
                <TabsTrigger value="chat">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="call">
                  <Phone className="w-4 h-4 mr-2" />
                  Appel
                </TabsTrigger>
              </TabsList>

              <TabsContent value="ai" className="flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {conversation.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="whatsapp" className="flex-1 p-4">
                <div className="text-center space-y-4">
                  <h4 className="font-semibold">WhatsApp Business</h4>
                  <p className="text-muted-foreground">
                    Connectez-vous avec nous sur WhatsApp pour un support instantané
                  </p>
                  <Button className="w-full" onClick={() => window.open("https://wa.me/1234567890")}>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Ouvrir WhatsApp
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="chat" className="flex-1 p-4">
                <div className="text-center space-y-4">
                  <h4 className="font-semibold">Chat en Direct</h4>
                  <p className="text-muted-foreground">
                    Discutez avec un agent en temps réel
                  </p>
                  <div className="space-y-2">
                    <Button className="w-full" onClick={handleVideoCall}>
                      <Video className="w-4 h-4 mr-2" />
                      Appel Vidéo
                    </Button>
                    <Button variant="outline" className="w-full" onClick={handleCall}>
                      <Phone className="w-4 h-4 mr-2" />
                      Appel Audio
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="call" className="flex-1 p-4">
                <div className="text-center space-y-4">
                  <h4 className="font-semibold">Appelez-nous</h4>
                  <p className="text-muted-foreground">
                    Notre équipe est disponible 24/7
                  </p>
                  <Button className="w-full" onClick={() => window.location.href = "tel:+1234567890"}>
                    <Phone className="w-4 h-4 mr-2" />
                    +123 456 7890
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Écrivez votre message..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  disabled={isLoading || activeChannel !== "ai"}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={isLoading || activeChannel !== "ai"}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};