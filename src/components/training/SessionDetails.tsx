
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarDays, Users, BookOpen } from "lucide-react";
import { CardDescription } from "@/components/ui/card";
import type { TrainingSession } from "@/types/training";

interface SessionDetailsProps {
  session: TrainingSession;
}

export const SessionDetails = ({ session }: SessionDetailsProps) => {
  return (
    <div className="space-y-4">
      <CardDescription>{session.description}</CardDescription>
      
      <div className="flex items-center gap-2">
        <CalendarDays className="h-5 w-5 text-muted-foreground" />
        <span>
          {format(new Date(session.start_date), "d MMMM yyyy 'à' HH'h'mm", { locale: fr })}
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5 text-muted-foreground" />
        <span>
          {session._count.enrollments}/{session.max_participants || '∞'} participants
        </span>
      </div>

      {session.materials_url && session.materials_url.length > 0 && (
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-muted-foreground" />
          <span>{session.materials_url.length} ressources disponibles</span>
        </div>
      )}
    </div>
  );
};
