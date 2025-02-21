
// @ts-nocheck
import { useState, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User } from 'lucide-react';
import { AvatarCreator } from '@readyplayerme/react-avatar-creator';

const AvatarModel = ({ url }) => {
  const group = useRef();
  const { scene, animations } = useGLTF(url);
  
  // Adapter l'échelle et la position de l'avatar
  scene.scale.set(1.5, 1.5, 1.5);
  scene.position.set(0, -1.5, 0);
  scene.rotation.set(0, 0.5, 0);

  return <primitive object={scene} />;
};

export const Avatar3DCreator = () => {
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleAvatarCreated = (event) => {
    // Convertir l'URL pour obtenir le modèle GLB au lieu du viewer
    const glbUrl = event.url.replace('/avatar', '/model.glb');
    setAvatarUrl(glbUrl);
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
            camera={{ position: [0, 0, 3], fov: 50 }}
            style={{ width: '100%', height: '100%' }}
          >
            <ambientLight intensity={0.5} />
            <directionalLight 
              position={[10, 10, 5]} 
              intensity={2}
              castShadow
            />
            <Suspense fallback={null}>
              <AvatarModel url={avatarUrl} />
              <OrbitControls
                enablePan={false}
                enableZoom={true}
                minPolarAngle={Math.PI/3}
                maxPolarAngle={Math.PI/1.5}
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
