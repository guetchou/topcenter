
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface AppointmentFormProps {
  onSubmit: (data: AppointmentData) => void;
  onCancel: () => void;
}

interface AppointmentData {
  name: string;
  email: string;
  date: string;
  time: string;
  service: string;
}

export const AppointmentForm = ({ onSubmit, onCancel }: AppointmentFormProps) => {
  const [formData, setFormData] = useState<AppointmentData>({
    name: "",
    email: "",
    date: "",
    time: "",
    service: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof AppointmentData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Nom complet</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="service">Service</Label>
          <Select
            value={formData.service}
            onValueChange={(value) => handleChange("service", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="consultation">Consultation</SelectItem>
              <SelectItem value="support">Support technique</SelectItem>
              <SelectItem value="formation">Formation</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => handleChange("date", e.target.value)}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="time">Heure</Label>
          <Input
            id="time"
            type="time"
            value={formData.time}
            onChange={(e) => handleChange("time", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
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
