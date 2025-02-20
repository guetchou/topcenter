
import { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei';
import AvatarCreator from '@readyplayerme/react-avatar-creator';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User } from 'lucide-react';

const Avatar = ({ modelUrl }: { modelUrl: string }) => {
  const group = useRef();
  const { scene, animations } = useGLTF(modelUrl);
  const { actions, names } = useAnimations(animations, group);

  useEffect(() => {
    // Jouer l'animation de base (idle)
    if (names.includes('Idle')) {
      actions['Idle'].reset().fadeIn(0.5).play();
    }
    
    return () => {
      // Nettoyer les animations
      Object.values(actions).forEach(action => action.stop());
    };
  }, [actions, names]);

  return (
    <group ref={group}>
      <primitive object={scene} scale={2} position={[0, -2, 0]} />
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
    <div className="relative">
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => setIsCreating(true)}
          >
            <User className="w-4 h-4" />
            {avatarUrl ? 'Modifier l\'avatar' : 'Créer un avatar'}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[900px] h-[80vh]">
          <DialogHeader>
            <DialogTitle>Personnalisez votre avatar</DialogTitle>
          </DialogHeader>
          {isCreating ? (
            <AvatarCreator
              subdomain="topcenter"
              onAvatarExported={handleAvatarCreated}
              className="w-full h-full"
            />
          ) : null}
        </DialogContent>
      </Dialog>

      {avatarUrl && (
        <div className="w-full h-[400px] rounded-lg overflow-hidden border bg-background/50 backdrop-blur-sm">
          <Canvas
            camera={{ position: [0, 0, 5], fov: 50 }}
            style={{ width: '100%', height: '100%' }}
          >
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <Avatar modelUrl={avatarUrl} />
            <OrbitControls 
              enableZoom={false}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 2}
            />
          </Canvas>
        </div>
      )}
    </div>
  );
};
