import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, Bot } from "lucide-react";

export const AIChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <div className="fixed bottom-20 right-4 z-50">
      {isOpen ? (
        <div className="w-80 bg-white rounded-lg shadow-xl animate-fade-in">
          <div className="p-4 bg-gradient-to-r from-primary to-secondary rounded-t-lg">
            <div className="flex items-center gap-2 text-white">
              <Bot className="w-6 h-6" />
              <h3 className="font-semibold">Assistant IA</h3>
            </div>
          </div>
          <div className="h-96 p-4 overflow-y-auto">
            {/* Messages would be displayed here */}
          </div>
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Posez votre question..."
                className="flex-1"
              />
              <Button size="icon" className="animate-pulse-glow">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-12 h-12 animate-bounce-subtle hover:scale-110 transition-transform"
        >
          <MessageSquare className="w-6 h-6" />
        </Button>
      )}
    </div>
  );
};