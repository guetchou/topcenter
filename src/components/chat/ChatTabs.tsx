
import { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Bot, User, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: ReactNode;
  chatterpalLoaded: boolean;
}

export const ChatTabs = ({ 
  activeTab, 
  setActiveTab, 
  children,
  chatterpalLoaded 
}: ChatTabsProps) => {
  return (
    <Tabs defaultValue="ai" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
      <TabsList className="grid grid-cols-2 mx-4 my-2">
        <TabsTrigger value="ai" className="flex items-center gap-2">
          <Bot className="w-4 h-4" />
          <div className="flex flex-col items-start text-xs">
            <span>Assistant IA</span>
            <span className="text-muted-foreground">Réponse immédiate 24/7</span>
          </div>
        </TabsTrigger>
        <TabsTrigger value="chatterpal" className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <div className="flex flex-col items-start text-xs">
            <span>Agent Humain</span>
            <span className="text-muted-foreground">Pour questions complexes</span>
          </div>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="ai" className="flex-1 flex flex-col data-[state=active]:flex data-[state=inactive]:hidden">
        {children}
      </TabsContent>
      
      <TabsContent value="chatterpal" className="flex-1 data-[state=active]:flex data-[state=inactive]:hidden">
        {activeTab === "chatterpal" && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute top-14 left-2 z-10 text-xs flex items-center gap-1"
            onClick={() => setActiveTab("ai")}
          >
            <ArrowLeft className="w-3 h-3" />
            Retour à l'IA
          </Button>
        )}
        <div className="absolute top-20 left-4 right-4 bg-amber-50 rounded-lg p-3 mb-4 text-sm">
          <p className="flex items-center gap-2 text-amber-800">
            <MessageSquare className="w-4 h-4" />
            Un agent vous répondra dans les plus brefs délais. Temps d'attente estimé : 2-5 minutes.
          </p>
        </div>
        <div id="chatterpal-container" className="w-full h-full flex-1 overflow-hidden mt-16">
          {!chatterpalLoaded && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};
