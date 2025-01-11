import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { AppointmentForm } from "./AppointmentForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const AppointmentScheduler = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleSchedule = (data: any) => {
    console.log("Nouveau rendez-vous:", data);
    
    // Simuler l'envoi à une API
    setTimeout(() => {
      toast({
        title: "Rendez-vous confirmé !",
        description: "Nous vous avons envoyé un email de confirmation.",
      });
      setIsOpen(false);
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-24 right-4 z-40 shadow-lg hover-lift">
          <Calendar className="w-4 h-4 mr-2" />
          Prendre RDV
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Prendre rendez-vous</DialogTitle>
          <DialogDescription>
            Choisissez une date et une heure qui vous conviennent.
          </DialogDescription>
        </DialogHeader>

        <AppointmentForm 
          onSubmit={handleSchedule}
          onCancel={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};