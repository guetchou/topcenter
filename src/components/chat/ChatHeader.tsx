
import { X, Bot, User, Settings, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ModelSelector } from "./ModelSelector";
import { cn } from "@/lib/utils";

interface ChatHeaderProps {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  isConnectedToAgent: boolean;
  queuePosition: number;
  useChatterPal: boolean;
  activeTab?: string; // Ajout de cette prop qui manquait
  useWebSocket?: boolean;
  onClose: () => void;
}

export const ChatHeader = ({
  selectedModel,
  setSelectedModel,
  isConnectedToAgent,
  queuePosition,
  useChatterPal,
  activeTab, // Nouvelle prop
  useWebSocket = false,
  onClose
}: ChatHeaderProps) => {
  const isWaiting = queuePosition > 0 && !isConnectedToAgent;
  
  return (
    <div className="p-3 border-b flex items-center justify-between bg-gradient-to-r from-muted/50 to-white">
      <div className="flex items-center gap-2">
        {useChatterPal || (activeTab === "chatterpal") ? (
          <>
            <Bot size={18} className="text-primary animate-pulse" />
            <span className="font-medium">ChatterPal</span>
          </>
        ) : useWebSocket ? (
          <>
            <Wifi size={18} className={cn(
              isConnectedToAgent ? "text-green-500" : "text-orange-500",
              "animate-pulse"
            )} />
            <span className="font-medium">
              {isConnectedToAgent 
                ? "Chat en temps réel" 
                : "Connexion en cours..."}
            </span>
          </>
        ) : (
          <>
            <User size={18} />
            <span className="font-medium">
              {isConnectedToAgent ? "Agent connecté" : isWaiting 
                ? `En attente (#${queuePosition})` 
                : "Support client"}
            </span>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        {(useChatterPal || activeTab === "chatterpal") && (
          <ModelSelector
            value={selectedModel}
            onChange={setSelectedModel}
            options={[
              { value: "gemini", label: "Gemini" },
              { value: "perplexity", label: "Perplexity" },
              { value: "llama", label: "Llama 3" }
            ]}
          />
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              Options de chat
            </DropdownMenuItem>
            <DropdownMenuItem>
              Télécharger historique
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" onClick={onClose}>
          <X size={18} />
        </Button>
      </div>
    </div>
  );
};
