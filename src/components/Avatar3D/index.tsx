
// @ts-nocheck
import { useState, useRef, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User } from 'lucide-react';
import { AvatarCreator } from '@readyplayerme/react-avatar-creator';
import { useToast } from "@/components/ui/use-toast";

const AvatarModel = ({ url }) => {
  const group = useRef();
  const { toast } = useToast();
  const { scene, animations } = useGLTF(url);
  const { actions, names } = useAnimations(animations, group);
  
  useEffect(() => {
    console.log("Loading model with URL:", url);
    try {
      if (scene) {
        console.log("Scene loaded successfully");
        scene.scale.set(1.5, 1.5, 1.5);
        scene.position.set(0, -1.5, 0);
        scene.rotation.set(0, 0.5, 0);
      }

      // Jouer l'animation d'idle si elle existe
      if (names.includes('idle') && actions) {
        console.log("Playing idle animation");
        actions['idle'].reset().fadeIn(0.5).play();
      }
    } catch (error) {
      console.error("Error in model setup:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du chargement du modèle 3D",
        variant: "destructive"
      });
    }
    
    return () => {
      if (actions) {
        Object.values(actions).forEach(action => action?.stop());
      }
    };
  }, [scene, actions, names, toast]);

  // Animation douce de rotation
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y += 0.005;
    }
  });

  if (!scene) {
    console.log("Scene not loaded yet");
    return null;
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
      console.log("Avatar creation event:", event);
      setIsLoading(true);
      const glbUrl = event.url.replace('/avatar', '/model.glb');
      console.log("GLB URL:", glbUrl);
      setAvatarUrl(glbUrl);
      setIsCreating(false);
      toast({
        title: "Succès",
        description: "Votre avatar a été créé avec succès !",
      });
    } catch (error) {
      console.error("Error in avatar creation:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de l'avatar",
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
            gl={{ preserveDrawingBuffer: true, antialias: true }}
          >
            <ambientLight intensity={0.5} />
            <directionalLight 
              position={[10, 10, 5]} 
              intensity={2}
              castShadow
            />
            <Suspense fallback={
              <mesh>
                <sphereGeometry args={[1, 16, 16]} />
                <meshStandardMaterial color="hotpink" />
              </mesh>
            }>
              <AvatarModel url={avatarUrl} />
              <OrbitControls
                enablePan={false}
                enableZoom={true}
                minPolarAngle={Math.PI/3}
                maxPolarAngle={Math.PI/1.5}
                maxDistance={4}
                minDistance={2}
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
