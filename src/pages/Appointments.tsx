
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Appointments = () => {
  const appointments = [
    { id: 1, date: '2025-05-15', time: '10:00', service: 'Consultation client' },
    { id: 2, date: '2025-05-22', time: '14:30', service: 'Suivi de projet' }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Vos rendez-vous</h1>
      
      {appointments.length > 0 ? (
        <div className="space-y-4">
          {appointments.map(appointment => (
            <Card key={appointment.id}>
              <CardHeader>
                <CardTitle>Rendez-vous #{appointment.id}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-sm font-medium">Date:</p>
                  <p>{appointment.date}</p>
                  <p className="text-sm font-medium">Heure:</p>
                  <p>{appointment.time}</p>
                  <p className="text-sm font-medium">Service:</p>
                  <p>{appointment.service}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p>Aucun rendez-vous programmé.</p>
      )}
    </div>
  );
};

export default Appointments;
