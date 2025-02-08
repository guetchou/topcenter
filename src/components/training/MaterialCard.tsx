
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle, PlayCircle } from "lucide-react";
import type { TrainingMaterial, TrainingProgress } from "@/types/training";

interface MaterialCardProps {
  material: TrainingMaterial;
  progress?: TrainingProgress;
  onStart: () => void;
}

export const MaterialCard = ({ material, progress, onStart }: MaterialCardProps) => {
  const isCompleted = progress?.completion_status === 'completed';
  const isInProgress = progress?.completion_status === 'in_progress';

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{material.title}</span>
          {isCompleted && <CheckCircle className="text-green-500 w-5 h-5" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          {material.description}
        </p>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">
              {progress?.last_accessed_at ? new Date(progress.last_accessed_at).toLocaleDateString() : 'Non commencé'}
            </span>
          </div>
          {(isInProgress || isCompleted) && (
            <Progress value={isCompleted ? 100 : 50} className="w-full" />
          )}
          <Button 
            className="w-full"
            variant={isCompleted ? "secondary" : "default"}
            onClick={onStart}
          >
            <PlayCircle className="w-4 h-4 mr-2" />
            {isCompleted ? 'Revoir' : isInProgress ? 'Continuer' : 'Commencer'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
