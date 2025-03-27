
import React, { useRef } from 'react';

interface AvatarModelProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  modelPath: string;
  animate?: boolean;
}

const AvatarModel: React.FC<AvatarModelProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  modelPath,
  animate = true
}) => {
  const group = useRef<any>(null);
  
  // Version temporaire simplifiée pendant la résolution des problèmes de dépendances
  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
      <div className="text-center p-4">
        <div className="text-lg font-medium mb-2">Avatar 3D</div>
        <p className="text-sm text-muted-foreground">
          Modèle: {modelPath.split('/').pop()}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Position: [{position.join(', ')}]<br />
          Rotation: [{rotation.join(', ')}]<br />
          Scale: {scale}
        </p>
      </div>
    </div>
  );
};

export default AvatarModel;
