import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Calendar, Clock, User } from "lucide-react";
import { Appointment } from "@/types/appointment";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface AppointmentConfirmationProps {
  appointment: Appointment;
  onClose: () => void;
}

export const AppointmentConfirmation = ({
  appointment,
  onClose
}: AppointmentConfirmationProps) => {
  return (
    <Card className="p-6 max-w-md mx-auto">
      <div className="flex items-center justify-center mb-6">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <Check className="w-6 h-6 text-primary" />
        </div>
      </div>

      <h3 className="text-xl font-semibold text-center mb-6">
        Rendez-vous confirmé !
      </h3>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-muted-foreground" />
          <span>
            {format(appointment.date, "EEEE d MMMM yyyy", { locale: fr })}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-muted-foreground" />
          <span>{appointment.time}</span>
        </div>

        <div className="flex items-center gap-3">
          <User className="w-5 h-5 text-muted-foreground" />
          <span>{appointment.name}</span>
        </div>
      </div>

      <div className="mt-8">
        <Button onClick={onClose} className="w-full">
          Fermer
        </Button>
      </div>
    </Card>
  );
};