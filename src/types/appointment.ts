
export interface Appointment {
  id: string;
  name: string;
  date: Date;
  time: string;
  description?: string;
  status: "pending" | "confirmed" | "cancelled";
}
