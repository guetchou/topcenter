
import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

// Loading spinner component
export const LoadingSpinner = () => (
  <div className="w-full h-full flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

interface AvatarModelProps {
  url: string;
}

export const AvatarModel = ({ url }: AvatarModelProps) => {
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
