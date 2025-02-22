
// @ts-nocheck
import { useState, useRef, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { User } from 'lucide-react';
import { AvatarCreator } from '@readyplayerme/react-avatar-creator';
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const LoadingSpinner = () => (
  <div className="w-full h-full flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const AvatarModel = ({ url }) => {
  const group = useRef();
  const { toast } = useToast();
  
  // Utilisation de useGLTF avec gestion d'erreur
  let modelData;
  try {
    modelData = useGLTF(url);
  } catch (error) {
    console.error("Error loading GLTF model:", error);
    toast({
      title: "Erreur de chargement",
      description: "Impossible de charger le modèle 3D. Veuillez réessayer.",
      variant: "destructive"
    });
    return <LoadingSpinner />;
  }

  const { scene, animations } = modelData;
  const { actions, names } = useAnimations(animations, group);
  
  useEffect(() => {
    try {
      if (scene) {
        scene.scale.set(2, 2, 2); // Augmenté la taille pour une meilleure visibilité
        scene.position.set(0, -1, 0);
        scene.rotation.set(0, 0, 0);

        if (names.includes('idle') && actions) {
          actions['idle'].reset().fadeIn(0.5).play();
        }
      }
    } catch (error) {
      console.error("Error in scene setup:", error);
      toast({
        title: "Erreur",
        description: "Problème lors de la configuration de l'avatar",
        variant: "destructive"
      });
    }
    
    return () => {
      if (actions) {
        Object.values(actions).forEach(action => action?.stop());
      }
    };
  }, [scene, actions, names, toast]);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y += 0.005;
    }
  });

  if (!scene) {
    return <LoadingSpinner />;
  }

  return <primitive ref={group} object={scene} dispose={null} />;
};

export const Avatar3DCreator = () => {
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAvatarCreated = (event) => {
    try {
      console.log("Avatar creation event received:", event);
      setIsLoading(true);
      
      if (!event?.url) {
        throw new Error("URL de l'avatar non reçue");
      }

      const glbUrl = event.url.replace('/avatar', '/model.glb');
      console.log("GLB URL generated:", glbUrl);
      setAvatarUrl(glbUrl);
      setIsCreating(false);
      
      toast({
        title: "Succès",
        description: "Avatar créé avec succès"
      });
    } catch (error) {
      console.error("Error in avatar creation:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'avatar. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const professionalConfig = {
    clearConfig: true,
    bodyType: "fullbody",
    quickStart: false,
    language: "fr",
    avatarConfig: {
      style: "realistic",
      outfit: "business",
      pose: "idle"
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
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <User className="w-4 h-4 mr-2" />
            )}
            {avatarUrl ? 'Modifier l\'avatar' : 'Créer un avatar'}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[900px] h-[80vh]">
          <DialogHeader>
            <DialogTitle>Créez votre avatar professionnel</DialogTitle>
            <DialogDescription>
              Personnalisez votre avatar selon vos préférences
            </DialogDescription>
          </DialogHeader>
          {isCreating && (
            <div className="w-full h-full min-h-[500px]">
              <AvatarCreator
                subdomain="topcenter"
                config={professionalConfig}
                onAvatarExported={handleAvatarCreated}
                className="w-full h-full"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="w-full h-full rounded-lg overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800">
        {avatarUrl ? (
          <Canvas
            camera={{ position: [0, 0, 4], fov: 50 }}
            style={{ width: '100%', height: '100%' }}
            gl={{ 
              preserveDrawingBuffer: true, 
              antialias: true,
              alpha: true 
            }}
          >
            <color attach="background" args={['transparent']} />
            <ambientLight intensity={0.6} />
            <directionalLight 
              position={[10, 10, 5]} 
              intensity={1.5}
              castShadow
            />
            <Suspense fallback={<LoadingSpinner />}>
              <AvatarModel url={avatarUrl} />
              <OrbitControls
                enablePan={false}
                enableZoom={true}
                minPolarAngle={Math.PI/3}
                maxPolarAngle={Math.PI/1.5}
                maxDistance={6}
                minDistance={2}
              />
            </Suspense>
          </Canvas>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-white text-lg text-center px-4">
              Cliquez sur le bouton en haut à droite pour créer votre avatar
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
