import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export const WhatsAppChannel = () => {
  const whatsappNumber = "+24223456789"; // À remplacer par le vrai numéro

  return (
    <div className="flex-1 p-4">
      <div className="text-center space-y-4">
        <h4 className="font-semibold">WhatsApp Business</h4>
        <p className="text-muted-foreground">
          Connectez-vous avec nous sur WhatsApp pour un support instantané
        </p>
        <Button 
          className="w-full" 
          onClick={() => window.open(`https://wa.me/${whatsappNumber}`)}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Ouvrir WhatsApp
        </Button>
      </div>
    </div>
  );
};