
import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModelSelector } from "./ModelSelector";

export interface ChatHeaderProps {
  selectedModel: string;
  setSelectedModel: React.Dispatch<React.SetStateAction<string>>;
  onClose: () => void;
  activeTab?: string;
  isConnectedToAgent?: boolean;
  queuePosition?: number;
  useChatterPal?: boolean;
}

export const ChatHeader = ({
  selectedModel,
  setSelectedModel,
  onClose,
  activeTab,
  isConnectedToAgent,
  queuePosition,
  useChatterPal
}: ChatHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-2">
        <h3 className="font-semibold">
          {activeTab === "ai" ? "Assistant IA" : "Chat en direct"}
        </h3>
        {activeTab === "ai" && (
          <ModelSelector
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
          />
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Fermer</span>
      </Button>
    </div>
  );
};
