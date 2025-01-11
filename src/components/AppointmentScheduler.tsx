import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { AppointmentForm } from "./AppointmentForm";
import { AppointmentConfirmation } from "./AppointmentConfirmation";
import { AppointmentReminder } from "./AppointmentReminder";
import { Appointment } from "@/types/appointment";
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
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState<Appointment | null>(null);

  const handleSchedule = (data: any) => {
    console.log("Nouveau rendez-vous:", data);
    
    const appointment: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      duration: 30,
      status: 'confirmed'
    };

    setCurrentAppointment(appointment);
    setShowConfirmation(true);
    
    // Simuler l'envoi à une API
    setTimeout(() => {
      toast({
        title: "Rendez-vous confirmé !",
        description: "Nous vous avons envoyé un email de confirmation.",
      });
      setIsOpen(false);

      // Programmer un rappel 24h avant
      const appointmentDate = new Date(appointment.date);
      const reminderDate = new Date(appointmentDate.getTime() - 24 * 60 * 60 * 1000);
      const now = new Date();
      
      if (reminderDate > now) {
        const timeoutId = setTimeout(() => {
          toast({
            title: "Rappel de rendez-vous",
            description: "Vous avez un rendez-vous demain !",
          });
        }, reminderDate.getTime() - now.getTime());

        // Cleanup timeout on component unmount
        return () => clearTimeout(timeoutId);
      }
    }, 1000);
  };

  return (
    <>
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

          {showConfirmation && currentAppointment ? (
            <AppointmentConfirmation
              appointment={currentAppointment}
              onClose={() => {
                setShowConfirmation(false);
                setIsOpen(false);
              }}
            />
          ) : (
            <AppointmentForm 
              onSubmit={handleSchedule}
              onCancel={() => setIsOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {currentAppointment && (
        <AppointmentReminder
          appointment={currentAppointment}
          onDismiss={() => setCurrentAppointment(null)}
        />
      )}
    </>
  );
};