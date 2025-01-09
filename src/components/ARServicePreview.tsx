import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Phone3D } from "lucide-react";

export const ARServicePreview = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="relative">
      <Button
        onClick={() => setIsActive(!isActive)}
        className="fixed bottom-20 left-4 z-50 animate-pulse-glow"
      >
        <Camera className="w-4 h-4 mr-2" />
        Aperçu AR
      </Button>

      {isActive && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-8 bg-white rounded-lg shadow-xl">
              <h3 className="mb-4 text-xl font-semibold">
                Prévisualisation AR
              </h3>
              <p className="mb-4 text-muted-foreground">
                Pointez votre caméra vers un espace pour visualiser nos services en réalité augmentée.
              </p>
              <Button onClick={() => setIsActive(false)}>Fermer</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};