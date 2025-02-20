
import { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations, SpotLight, Environment } from '@react-three/drei';
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
          if (object.material) {
            object.material.roughness = 0.5;
            object.material.metalness = 0.5;
          }
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

  const professionalConfig = {
    clearConfig: true,
    bodyType: 'fullbody',
    quickStart: false,
    language: 'fr',
    avatarConfig: {
      outfitVersion: 2,
      pose: 'A',
      textureAtlas: true,
      quality: 'high',
      morphTargets: true,
      useHands: true,
      useDefaultStylePreset: true,
      stylePreset: 'business',
      faceExpression: 'neutral',
      lighting: {
        environment: 'office',
        intensity: 1.2
      }
    }
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
            {avatarUrl ? 'Modifier l\'avatar professionnel' : 'Créer un avatar professionnel'}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[900px] h-[80vh]">
          <DialogHeader>
            <DialogTitle>Créez votre avatar professionnel</DialogTitle>
          </DialogHeader>
          {isCreating && (
            <AvatarCreator
              subdomain="topcenter"
              config={professionalConfig}
              onAvatarExported={handleAvatarCreated}
              className="w-full h-full"
            />
          )}
        </DialogContent>
      </Dialog>

      {avatarUrl ? (
        <div className="w-full h-full rounded-lg overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800">
          <Canvas
            camera={{ position: [0, 0, 4], fov: 45 }}
            shadows
          >
            <color attach="background" args={['#1a1a1a']} />
            <fog attach="fog" args={['#1a1a1a', 5, 15]} />
            
            <ambientLight intensity={0.4} />
            <SpotLight
              position={[0, 5, 5]}
              angle={0.5}
              penumbra={0.5}
              intensity={1}
              castShadow
            />
            <SpotLight
              position={[-5, 2, 0]}
              angle={0.5}
              penumbra={0.5}
              intensity={0.8}
              castShadow
            />
            
            <Suspense fallback={null}>
              <Avatar modelUrl={avatarUrl} />
              <Environment preset="city" />
              <OrbitControls
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI / 2}
                enableZoom={true}
                enablePan={false}
              />
            </Suspense>
          </Canvas>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 rounded-lg">
          <p className="text-white text-lg">
            Créez votre avatar professionnel pour le visualiser ici
          </p>
        </div>
      )}
    </div>
  );
};
