
import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
  nodes: {
    [key: string]: THREE.Mesh;
  };
  materials: {
    [key: string]: THREE.Material;
  };
};

interface AvatarModelProps {
  url: string;
  position?: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
  animate?: boolean;
}

export function AvatarModel({
  url,
  position = [0, 0, 0],
  scale = 1,
  rotation = [0, 0, 0],
  animate = true
}: AvatarModelProps) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF(url) as GLTFResult;
  
  // Clone the scene to avoid modifying the cached original
  const clonedScene = React.useMemo(() => {
    return scene.clone();
  }, [scene]);

  useEffect(() => {
    if (!clonedScene) return;
    
    // Apply materials or modifications to the cloned scene if needed
    clonedScene.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        const mesh = node as THREE.Mesh;
        // Example: You could modify materials here
        if (mesh.material) {
          // Apply material modifications if needed
        }
      }
    });
    
    // Add the cloned scene to our group
    if (group.current) {
      // Clear previous children
      while (group.current.children.length > 0) {
        group.current.remove(group.current.children[0]);
      }
      
      // Add new scene
      group.current.add(clonedScene);
    }
    
    return () => {
      // Cleanup
      clonedScene.traverse((node) => {
        if ((node as THREE.Mesh).isMesh) {
          const mesh = node as THREE.Mesh;
          mesh.geometry.dispose();
          
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach(material => material.dispose());
          } else if (mesh.material) {
            mesh.material.dispose();
          }
        }
      });
    };
  }, [clonedScene]);

  // Animate the model
  useFrame((_, delta) => {
    if (animate && group.current) {
      // Using type assertion to fix rotation property error
      (group.current.rotation as THREE.Euler).y += delta * 0.5;
    }
  });

  return (
    <group 
      ref={group} 
      position={new THREE.Vector3(...position)}
      scale={scale}
      rotation={new THREE.Euler(...rotation)}
    />
  );
}

useGLTF.preload('/models/default-avatar.glb'); // Preload a default model
