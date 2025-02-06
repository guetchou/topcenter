import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

export const PhoneChannel = () => {
  const phoneNumber = "+24223456789"; // À remplacer par le vrai numéro

  return (
    <div className="flex-1 p-4">
      <div className="text-center space-y-4">
        <h4 className="font-semibold">Appelez-nous</h4>
        <p className="text-muted-foreground">
          Notre équipe est disponible 24/7
        </p>
        <Button 
          className="w-full" 
          onClick={() => window.location.href = `tel:${phoneNumber}`}
        >
          <Phone className="w-4 h-4 mr-2" />
          {phoneNumber}
        </Button>
      </div>
    </div>
  );
};