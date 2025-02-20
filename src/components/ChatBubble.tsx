
import { Bot, MessageSquareText, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type AIModel = "perplexity" | "llama2" | "mistral" | "bloom";

export const AIChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModel>("perplexity");

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const newMessage = { text: message, isUser: true };
    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);
    
    try {
      let response;
      
      if (selectedModel === "perplexity") {
        response = await supabase.functions.invoke('ai-chat', {
          body: { message }
        });
      } else {
        response = await supabase.functions.invoke('local-ai', {
          body: { message, model: selectedModel }
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
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <span className="font-medium">Assistant TopCenter</span>
            </div>
            <Select defaultValue={selectedModel} onValueChange={(value) => setSelectedModel(value as AIModel)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Modèle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="perplexity">Perplexity</SelectItem>
                <SelectItem value="llama2">Llama 2</SelectItem>
                <SelectItem value="mistral">Mistral 7B</SelectItem>
                <SelectItem value="bloom">BLOOM</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground">
                Comment puis-je vous aider aujourd'hui ?
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
        </div>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full w-12 h-12 shadow-lg animate-bounce-subtle"
        >
          <Bot className="w-6 h-6" />
        </Button>
      )}
    </div>
  );
};
