
import { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei';
import { AvatarCreator } from '@readyplayerme/react-avatar-creator';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User } from 'lucide-react';
import * as THREE from 'three';

const Avatar = ({ modelUrl }: { modelUrl: string }) => {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(modelUrl);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (scene) {
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.castShadow = true;
          object.receiveShadow = true;
        }
      });
    }
  }, [scene]);

  return (
    <group ref={group}>
      <primitive 
        object={scene} 
        scale={2} 
        position={[0, -2, 0]}
      />
    </group>
  );
};

export const Avatar3DCreator = () => {
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [isCreating, setIsCreating] = useState(false);

  const handleAvatarCreated = (url: string) => {
    setAvatarUrl(url);
    setIsCreating(false);
  };

  return (
    <div className="relative w-full h-[500px]">
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            className="absolute top-4 right-4 z-10"
            onClick={() => setIsCreating(true)}
          >
            <User className="w-4 h-4 mr-2" />
            {avatarUrl ? 'Modifier l\'avatar' : 'Créer un avatar'}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[900px] h-[80vh]">
          <DialogHeader>
            <DialogTitle>Personnalisez votre avatar</DialogTitle>
          </DialogHeader>
          {isCreating && (
            <AvatarCreator
              subdomain="topcenter"
              onAvatarExported={handleAvatarCreated}
              className="w-full h-full"
            />
          )}
        </DialogContent>
      </Dialog>

      {avatarUrl ? (
        <div className="w-full h-full rounded-lg overflow-hidden bg-background/50 backdrop-blur-sm">
          <Canvas
            camera={{ position: [0, 1, 5], fov: 50 }}
            shadows
          >
            <ambientLight intensity={0.5} />
            <directionalLight 
              position={[10, 10, 5]} 
              intensity={1}
              castShadow 
            />
            <Suspense fallback={null}>
              <Avatar modelUrl={avatarUrl} />
              <OrbitControls />
            </Suspense>
          </Canvas>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-lg">
          <p className="text-muted-foreground">
            Créez votre avatar pour le voir apparaître ici
          </p>
        </div>
      )}
    </div>
  );
};
