
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Video, FileText } from "lucide-react";
import type { TrainingMaterial } from "@/types/training";

interface MaterialCardProps {
  material: TrainingMaterial;
  onStart: () => void;
}

export const MaterialCard = ({ material, onStart }: MaterialCardProps) => {
  const getIcon = () => {
    switch (material.content_type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'document':
        return <FileText className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{material.title}</h3>
            {material.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {material.description}
              </p>
            )}
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-4"
          onClick={onStart}
        >
          Commencer
        </Button>
      </CardContent>
    </Card>
  );
};
