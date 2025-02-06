import { useState } from "react";
import { Bot, MinusCircle, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AIChannel } from "@/components/chat/AIChannel";
import { WhatsAppChannel } from "@/components/chat/WhatsAppChannel";
import { LiveChatChannel } from "@/components/chat/LiveChatChannel";
import { PhoneChannel } from "@/components/chat/PhoneChannel";

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
              <AIChannel
                conversation={conversation}
                message={message}
                setMessage={setMessage}
                handleSendMessage={handleSendMessage}
                isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value="whatsapp" className="flex-1">
              <WhatsAppChannel />
            </TabsContent>

            <TabsContent value="chat" className="flex-1">
              <LiveChatChannel />
            </TabsContent>

            <TabsContent value="call" className="flex-1">
              <PhoneChannel />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};