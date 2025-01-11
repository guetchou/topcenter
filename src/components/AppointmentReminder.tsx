import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bell, Calendar } from "lucide-react";
import { Appointment } from "@/types/appointment";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface AppointmentReminderProps {
  appointment: Appointment;
  onDismiss: () => void;
}

export const AppointmentReminder = ({
  appointment,
  onDismiss
}: AppointmentReminderProps) => {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const appointmentDate = new Date(appointment.date);
      appointmentDate.setHours(parseInt(appointment.time.split(":")[0]));
      
      const diff = appointmentDate.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}min`);
      } else if (minutes > 0) {
        setTimeLeft(`${minutes}min`);
      } else {
        setTimeLeft("Maintenant");
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);

    return () => clearInterval(timer);
  }, [appointment]);

  return (
    <Card className="p-4 bg-primary/5 animate-slide-in-bottom">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
          <Bell className="w-5 h-5 text-primary" />
        </div>

        <div className="flex-1">
          <h4 className="font-semibold">Rappel de rendez-vous</h4>
          <p className="text-sm text-muted-foreground">
            Dans {timeLeft} - {format(appointment.date, "d MMMM", { locale: fr })} à {appointment.time}
          </p>
        </div>

        <Button variant="ghost" size="sm" onClick={onDismiss}>
          Ignorer
        </Button>
      </div>
    </Card>
  );
};