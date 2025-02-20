
// @ts-nocheck
import { useState, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { AvatarCreator } from '@readyplayerme/react-avatar-creator';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User } from 'lucide-react';
import * as THREE from 'three';

const Avatar = ({ modelUrl }) => {
  const group = useRef();
  const { scene } = useGLTF(modelUrl);

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
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleAvatarCreated = (event) => {
    setAvatarUrl(event.url);
    setIsCreating(false);
  };

  const professionalConfig = {
    clearConfig: true,
    bodyType: "fullbody",
    quickStart: false,
    language: "fr",
    avatarConfig: {
      style: "realistic",
      outfit: "business"
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
          >
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <Suspense fallback={null}>
              <Avatar modelUrl={avatarUrl} />
              <OrbitControls 
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
