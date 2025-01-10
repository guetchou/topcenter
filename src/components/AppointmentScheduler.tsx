import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const AppointmentScheduler = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleSchedule = () => {
    toast({
      title: "Demande envoyée !",
      description: "Nous vous contacterons rapidement pour confirmer le rendez-vous.",
    });
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-24 right-4 z-40">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="shadow-lg hover-lift"
      >
        <Calendar className="w-4 h-4 mr-2" />
        Prendre RDV
      </Button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 w-80 p-4 bg-white rounded-lg shadow-xl border animate-fade-in">
          <h3 className="font-semibold mb-4">Prendre rendez-vous</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Choisissez une date et nous vous recontacterons pour confirmer.
          </p>
          <Button onClick={handleSchedule} className="w-full">
            Demander un rendez-vous
          </Button>
        </div>
      )}
    </div>
  );
};