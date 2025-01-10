import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, X } from "lucide-react";

export const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const estimatedWait = "2-3 minutes";

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="shadow-lg hover-lift"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Chat en direct
        </Button>
      ) : (
        <div className="w-80 h-96 bg-white rounded-lg shadow-xl border animate-fade-in">
          <div className="p-4 border-b flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Chat en direct</h3>
              <p className="text-sm text-muted-foreground">
                Temps d'attente estimé : {estimatedWait}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="p-4 h-full">
            <p className="text-center text-muted-foreground">
              Un conseiller va bientôt vous répondre...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};