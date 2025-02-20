
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
  const { actions, names } = useAnimations(animations, group);

  useEffect(() => {
    // On s'assure que la scène est bien chargée
    if (!scene || !animations.length) return;

    // Configuration de base de la scène
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });

    // Démarrage de l'animation Idle si disponible
    if (names.includes('Idle')) {
      const idleAction = actions['Idle'];
      idleAction?.reset().fadeIn(0.5).play();
    }

    return () => {
      // Nettoyage des animations
      Object.values(actions).forEach(action => action?.stop());
    };
  }, [scene, animations, actions, names]);

  return (
    <group ref={group}>
      <primitive 
        object={scene} 
        scale={2} 
        position={[0, -2, 0]}
        castShadow
        receiveShadow 
      />
    </group>
  );
};

const LoadingSpinner = () => (
  <mesh>
    <sphereGeometry args={[0.5, 32, 32]} />
    <meshStandardMaterial color="white" wireframe />
  </mesh>
);

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
            shadows
            camera={{ 
              position: [0, 1, 5], 
              fov: 50,
              near: 0.1,
              far: 1000
            }}
            style={{ width: '100%', height: '100%' }}
          >
            <Suspense fallback={<LoadingSpinner />}>
              <color attach="background" args={['#1a1a1a']} />
              <fog attach="fog" args={['#1a1a1a', 10, 20]} />
              
              {/* Éclairage */}
              <ambientLight intensity={0.5} />
              <directionalLight 
                position={[10, 10, 5]} 
                intensity={1}
                castShadow
                shadow-mapSize={[1024, 1024]}
              />
              <pointLight position={[-10, -10, -5]} intensity={0.5} />

              {/* Avatar */}
              <Avatar modelUrl={avatarUrl} />

              {/* Contrôles de caméra */}
              <OrbitControls 
                enableZoom={true}
                maxDistance={10}
                minDistance={2}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI / 2}
                enableDamping
                dampingFactor={0.05}
              />

              {/* Sol */}
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
                <planeGeometry args={[100, 100]} />
                <shadowMaterial transparent opacity={0.4} />
              </mesh>
            </Suspense>
          </Canvas>
        </div>
      )}
    </div>
  );
};
