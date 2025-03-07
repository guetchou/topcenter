
import { Button } from "@/components/ui/button";
import { X, Bot, User } from "lucide-react";
import { ModelSelector } from "./ModelSelector";

interface ChatHeaderProps {
  activeTab: string;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  onClose: () => void;
}

export const ChatHeader = ({ 
  activeTab, 
  selectedModel, 
  setSelectedModel, 
  onClose 
}: ChatHeaderProps) => {
  return (
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
          <ModelSelector 
            selectedModel={selectedModel} 
            onModelChange={setSelectedModel} 
          />
        )}
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
