
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { MaterialCard } from "./MaterialCard";
import { SessionDetails } from "./SessionDetails";
import { EnrollButton } from "./EnrollButton";
import { useTrainingMaterials } from "@/hooks/useTrainingMaterials";
import type { TrainingSession } from "@/types/training";

interface SessionCardProps {
  session: TrainingSession;
  isEnrolled: boolean;
  onEnrollmentSuccess: (sessionId: string) => void;
  onStartMaterial: (materialId: string) => void;
}

export const SessionCard = ({ 
  session, 
  isEnrolled, 
  onEnrollmentSuccess,
  onStartMaterial 
}: SessionCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: materials } = useTrainingMaterials(isExpanded ? session.id : '');

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{session.title}</CardTitle>
          <Badge variant={session.status === 'scheduled' ? 'default' : 'secondary'}>
            {session.status === 'scheduled' ? 'Programmée' : 'Terminée'}
          </Badge>
        </div>
        <SessionDetails session={session} />
      </CardHeader>
      
      <CardContent className="flex-grow">
        {isExpanded && materials && (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {materials.map((material) => (
              <MaterialCard
                key={material.id}
                material={material}
                onStart={() => onStartMaterial(material.id)}
              />
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-4 pt-4">
        {isEnrolled && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4 mr-2" />
                Masquer le contenu
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-2" />
                Voir le contenu
              </>
            )}
          </Button>
        )}
        <EnrollButton
          sessionId={session.id}
          isEnrolled={isEnrolled}
          onEnrollmentSuccess={onEnrollmentSuccess}
        />
      </CardFooter>
    </Card>
  );
};
