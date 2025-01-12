import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const AIAssistant = () => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<Array<{role: string, content: string}>>([]);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    const userMessage = { role: "user", content: message };
    setConversation(prev => [...prev, userMessage]);

    try {
      // Simulation de réponse IA (à remplacer par l'appel API réel)
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
    <div className="rounded-lg border bg-card shadow-lg">
      <div className="p-4 border-b bg-muted/50">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Assistant IA</h3>
        </div>
      </div>

      <div className="h-[400px] overflow-y-auto p-4 space-y-4">
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
    </div>
  );
};