import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, Loader2, MinusCircle, PlusCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const AIAssistant = () => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [conversation, setConversation] = useState<Array<{role: string, content: string}>>([]);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    const userMessage = { role: "user", content: message };
    setConversation(prev => [...prev, userMessage]);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const aiResponse = {
        role: "assistant",
        content: "Je suis l'assistant IA de Top Center. Comment puis-je vous aider aujourd'hui ?"
      };
      setConversation(prev => [...prev, aiResponse]);
      
      toast({
        title: "Message envoyé",
        description: "L'assistant IA a bien reçu votre message.",
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
            <h3 className="font-semibold">Assistant IA</h3>
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

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Posez votre question..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  disabled={isLoading}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={isLoading}
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