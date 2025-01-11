import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fr } from 'date-fns/locale';
import { AppointmentType } from "@/types/appointment";
import { useToast } from "@/components/ui/use-toast";
import { calculateAvailableSlots, suggestOptimalSlot } from "@/utils/appointmentUtils";

export const AppointmentForm = ({ onSubmit, onCancel }: {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  const [type, setType] = useState<AppointmentType>('consultation');
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [preferences, setPreferences] = useState({ morning: false, afternoon: false });
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  useEffect(() => {
    if (date) {
      // Simuler des créneaux déjà réservés
      const bookedSlots = ["10:00", "14:00", "16:00"];
      const slots = calculateAvailableSlots(date, bookedSlots);
      setAvailableSlots(slots);

      // Suggérer un créneau optimal
      const suggestedSlot = suggestOptimalSlot(preferences, slots);
      if (suggestedSlot && !time) {
        setTime(suggestedSlot);
        toast({
          title: "Créneau suggéré",
          description: `Nous vous suggérons le créneau de ${suggestedSlot}`,
        });
      }
    }
  }, [date, preferences]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !time || !name || !email || !phone) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      date,
      time,
      type,
      name,
      email,
      phone,
      message,
      preferences,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label>Type de rendez-vous</Label>
          <Select value={type} onValueChange={(value: AppointmentType) => setType(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="consultation">Consultation</SelectItem>
              <SelectItem value="support">Support technique</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="technique">Service technique</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Préférences horaires</Label>
          <div className="flex gap-4 mt-2">
            <Button
              type="button"
              variant={preferences.morning ? "default" : "outline"}
              onClick={() => setPreferences(prev => ({ ...prev, morning: !prev.morning }))}
            >
              Matin
            </Button>
            <Button
              type="button"
              variant={preferences.afternoon ? "default" : "outline"}
              onClick={() => setPreferences(prev => ({ ...prev, afternoon: !prev.afternoon }))}
            >
              Après-midi
            </Button>
          </div>
        </div>

        <div>
          <Label>Date</Label>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            locale={fr}
            className="rounded-md border"
            disabled={(date) => date < new Date()}
          />
        </div>

        <div>
          <Label>Heure</Label>
          <Select value={time} onValueChange={setTime}>
            <SelectTrigger>
              <SelectValue placeholder="Choisissez une heure" />
            </SelectTrigger>
            <SelectContent>
              {availableSlots.map((slot) => (
                <SelectItem key={slot} value={slot}>
                  {slot}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Nom complet</Label>
          <Input 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Votre nom"
            required
          />
        </div>

        <div>
          <Label>Email</Label>
          <Input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            required
          />
        </div>

        <div>
          <Label>Téléphone</Label>
          <Input 
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+242 00 000 0000"
            required
          />
        </div>

        <div>
          <Label>Message (optionnel)</Label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Détails supplémentaires..."
            className="h-32"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          Confirmer le rendez-vous
        </Button>
      </div>
    </form>
  );
};