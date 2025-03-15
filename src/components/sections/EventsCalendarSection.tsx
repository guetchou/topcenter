import { useState } from 'react';
import { format, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale'; // Utilisation du français pour le formatage des dates
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon } from "lucide-react";

// Typage des événements
interface Event {
  id: number;
  title: string;
  date: Date;
  type: "formation" | "atelier" | "seminaire";
}

interface EventsCalendarSectionProps {
  events: Event[];
}

export const EventsCalendarSection = ({ events }: EventsCalendarSectionProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Filtrer les événements pour la date sélectionnée
  const selectedDateEvents = events.filter(
    event => date && isSameDay(event.date, date)
  );

  return (
    <section className="py-12 bg-background" aria-labelledby="calendar-section-title">
      <div className="container">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Calendrier */}
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2" id="calendar-section-title">
                <CalendarIcon className="w-5 h-5" aria-hidden="true" />
                Calendrier des Événements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                locale={fr} // Utilisation du français pour le calendrier
                aria-label="Calendrier des événements"
              />
            </CardContent>
          </Card>

          {/* Liste des événements du jour */}
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Événements du Jour</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDateEvents.length > 0 ? (
                <div className="space-y-4" role="list">
                  {selectedDateEvents.map(event => (
                    <div key={event.id} className="flex items-center gap-2" role="listitem">
                      <Badge variant="outline" aria-label={`Type: ${event.type}`}>
                        {event.type}
                      </Badge>
                      <span>{event.title}</span>
                      <span className="text-sm text-muted-foreground ml-auto">
                        {format(event.date, 'PP', { locale: fr })}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground" aria-live="polite">
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
