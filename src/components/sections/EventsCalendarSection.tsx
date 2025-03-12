
import { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon } from "lucide-react";

const events = [
  {
    id: 1,
    title: "Formation Service Client",
    date: new Date(2024, 3, 15),
    type: "formation"
  },
  {
    id: 2,
    title: "Atelier Gestion des Appels",
    date: new Date(2024, 3, 20),
    type: "atelier"
  },
  {
    id: 3,
    title: "Séminaire Relation Client",
    date: new Date(2024, 3, 25),
    type: "seminaire"
  }
];

export const EventsCalendarSection = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const selectedDateEvents = events.filter(
    event => date && event.date.toDateString() === date.toDateString()
  );

  return (
    <section className="py-12 bg-background">
      <div className="container">
        <div className="flex flex-col md:flex-row gap-8">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                Calendrier des Événements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Événements du Jour</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDateEvents.length > 0 ? (
                <div className="space-y-4">
                  {selectedDateEvents.map(event => (
                    <div key={event.id} className="flex items-center gap-2">
                      <Badge variant="outline">{event.type}</Badge>
                      <span>{event.title}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Aucun événement prévu pour cette date
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
