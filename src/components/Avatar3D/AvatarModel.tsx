
import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import * as SkeletonUtils from 'three-stdlib';

interface AvatarModelProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  modelPath: string;
  animate?: boolean;
}

// Définir un type pour le résultat de GLTF
interface GLTFResult {
  nodes: {
    [key: string]: THREE.Mesh;
  };
  materials: {
    [key: string]: THREE.Material;
  };
}

const AvatarModel: React.FC<AvatarModelProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  modelPath,
  animate = true
}) => {
  const group = useRef<THREE.Group>(null);
  
  // Typez correctement le résultat de useGLTF
  const { scene } = useGLTF(modelPath) as unknown as { scene: THREE.Group };
  
  useEffect(() => {
    if (scene) {
      // Clone la scène pour éviter les problèmes de partage d'instance
      // Utiliser directement THREE pour cloner la scène
      const clonedScene = scene.clone();
      
      // Nettoyage du groupe existant
      if (group.current) {
        while (group.current.children.length > 0) {
          group.current.remove(group.current.children[0]);
        }
        
        // Ajouter le clone au groupe
        group.current.add(clonedScene);
      }
    }
  }, [scene, modelPath]);

  useFrame(({ clock }) => {
    if (animate && group.current) {
      group.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.2 + rotation[1];
    }
  });

  return (
    <group
      ref={group}
      position={position as [number, number, number]}
      rotation={rotation as [number, number, number]}
      scale={[scale, scale, scale]}
    />
  );
};

export default AvatarModel;
