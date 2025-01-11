export type AppointmentType = 'consultation' | 'support' | 'commercial' | 'technique';

export interface Appointment {
  id: string;
  type: AppointmentType;
  date: Date;
  time: string;
  duration: number; // en minutes
  name: string;
  email: string;
  phone: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}