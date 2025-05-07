
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const BookAppointment = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [service, setService] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simuler la réservation d'un rendez-vous
    console.log('Réservation:', { date, time, service });
    toast.success('Rendez-vous réservé avec succès!');
    navigate('/appointments');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Réserver un rendez-vous</h1>
      <div className="max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium mb-1">
              Date
            </label>
            <Input 
              id="date"
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-medium mb-1">
              Heure
            </label>
            <Input 
              id="time"
              type="time" 
              value={time} 
              onChange={(e) => setTime(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label htmlFor="service" className="block text-sm font-medium mb-1">
              Service
            </label>
            <Select value={service} onValueChange={setService}>
              <SelectTrigger id="service">
                <SelectValue placeholder="Sélectionnez un service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="consultation">Consultation client</SelectItem>
                <SelectItem value="support">Support technique</SelectItem>
                <SelectItem value="devis">Demande de devis</SelectItem>
                <SelectItem value="suivi">Suivi de projet</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">
            Réserver
          </Button>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
