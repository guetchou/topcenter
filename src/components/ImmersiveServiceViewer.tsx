
import { useRef, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { 
  OrbitControls, 
  PerspectiveCamera,
  Text, 
  Environment,
  Html
} from "@react-three/drei";
import { Phone, Globe, Shield, Headphones, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import * as THREE from "three";

// Services nodes data
const services = [
  {
    icon: Phone,
    title: "Centre d'Appels",
    description: "Service client professionnel 24/7",
    position: [-4, 0, 0],
    color: "#FF6B35"
  },
  {
    icon: Globe,
    title: "Support Multilingue",
    description: "Communication sans frontières",
    position: [-2, 2, 2],
    color: "#1089FF"
  },
  {
    icon: Shield,
    title: "Sécurité Garantie",
    description: "Protection des données assurée",
    position: [0, 4, -2],
    color: "#36AE7C"
  },
  {
    icon: Headphones,
    title: "Support Multicanal",
    description: "Communication sur tous les canaux",
    position: [3, 1, 2],
    color: "#8B5CF6"
  },
  {
    icon: Users,
    title: "Équipe Dédiée",
    description: "Agents qualifiés à votre service",
    position: [5, -1, -1],
    color: "#F59E0B"
  },
  {
    icon: Clock,
    title: "Disponibilité 24/7",
    description: "Service continu sans interruption",
    position: [1, -2, 3],
    color: "#EC4899"
  }
];

// Node component representing a service
const ServiceNode = ({ position, color, title, description, isActive, onClick }) => {
  const sphereRef = useRef<THREE.Mesh>(null);
  const textRef = useRef();
  
  useFrame((state) => {
    if (sphereRef.current) {
      // Gentle floating animation
      sphereRef.current.position.y += Math.sin(state.clock.getElapsedTime() * 0.5) * 0.002;
      // Slow rotation
      sphereRef.current.rotation.y += 0.002;
    }
  });

  const scale = isActive ? 1.3 : 1;
  const intensity = isActive ? 1.5 : 1;

  return (
    <group position={position} onClick={onClick}>
      {/* Service node sphere */}
      <mesh
        ref={sphereRef}
        scale={scale}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial 
          color={color}
          roughness={0.4}
          metalness={0.2} 
          emissive={color}
          emissiveIntensity={intensity}
        />
      </mesh>
      
      {/* Service title text */}
      <Text
        ref={textRef}
        position={[0, 1.2, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#00000090"
      >
        {title}
      </Text>
      
      {/* Information panel that appears when active */}
      {isActive && (
        <Html
          position={[0, 0, 1]}
          className="pointer-events-none"
          center
          distanceFactor={10}
        >
          <div className="bg-black/80 backdrop-blur-md p-4 rounded-lg w-64 border border-white/20 text-white transform translate-x-8">
            <h3 className="text-lg font-bold mb-2">{title}</h3>
            <p className="text-sm opacity-80">{description}</p>
          </div>
        </Html>
      )}
    </group>
  );
};

// Background elements
const BackgroundElements = () => {
  const { viewport } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });
  
  return (
    <group ref={groupRef}>
      {/* Create some floating particles in the background */}
      {[...Array(40)].map((_, i) => {
        const radius = 15 + Math.random() * 15;
        const angle = Math.random() * Math.PI * 2;
        const y = (Math.random() - 0.5) * 10;
        
        return (
          <mesh 
            key={i}
            position={[
              Math.cos(angle) * radius,
              y,
              Math.sin(angle) * radius
            ]}
          >
            <sphereGeometry args={[0.05 + Math.random() * 0.1, 8, 8]} />
            <meshStandardMaterial 
              color={`hsl(${Math.floor(Math.random() * 360)}, 70%, 70%)`} 
              emissive={`hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`}
              emissiveIntensity={1}
            />
          </mesh>
        );
      })}
    </group>
  );
};

// Connection lines between services
const ConnectionLines = () => {
  return (
    <group>
      {services.map((service, i) => {
        // Connect to the next 2 services in the array
        return [...Array(2)].map((_, j) => {
          const nextIndex = (i + j + 1) % services.length;
          const startPos = service.position;
          const endPos = services[nextIndex].position;
          
          const points = [
            new THREE.Vector3(startPos[0], startPos[1], startPos[2]),
            new THREE.Vector3(endPos[0], endPos[1], endPos[2])
          ];
          
          const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
          
          return (
            <line key={`${i}-${nextIndex}`} geometry={lineGeometry}>
              <lineBasicMaterial 
                color="#ffffff" 
                opacity={0.15} 
                transparent 
                linewidth={1} 
              />
            </line>
          );
        });
      })}
    </group>
  );
};

// Main 3D scene component
const Scene = ({ onSelectService }) => {
  const [activeService, setActiveService] = useState(null);
  
  const handleNodeClick = (index) => {
    setActiveService(index);
    if (onSelectService) {
      onSelectService(services[index]);
    }
  };
  
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={60} />
      
      {/* Background environment */}
      <Environment preset="sunset" />
      <BackgroundElements />
      
      {/* Ambient and key lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#3b82f6" />
      
      {/* Connection lines between services */}
      <ConnectionLines />
      
      {/* Service nodes */}
      {services.map((service, index) => (
        <ServiceNode
          key={index}
          position={service.position}
          color={service.color}
          title={service.title}
          description={service.description}
          isActive={activeService === index}
          onClick={() => handleNodeClick(index)}
        />
      ))}
      
      {/* Camera controls */}
      <OrbitControls 
        enablePan={false}
        enableZoom={true}
        minDistance={6}
        maxDistance={20}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
};

// Loading component
const Loader = () => (
  <Html center>
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-lg">Chargement de l'univers 3D...</p>
    </div>
  </Html>
);

// Main exported component
export const ImmersiveServiceViewer = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Handle service selection
  const handleSelectService = (service) => {
    setSelectedService(service);
  };
  
  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'h-[600px] rounded-xl overflow-hidden'}`}>
      {/* Fullscreen toggle button */}
      <Button
        variant="outline"
        size="sm"
        className="absolute top-4 right-4 z-10 bg-black/30 backdrop-blur-sm"
        onClick={toggleFullscreen}
      >
        {isFullscreen ? 'Quitter le mode immersif' : 'Mode immersif'}
      </Button>
      
      {/* Canvas for 3D rendering */}
      <Canvas shadows className="w-full h-full">
        <Suspense fallback={<Loader />}>
          <Scene onSelectService={handleSelectService} />
        </Suspense>
      </Canvas>
      
      {/* Service information overlay */}
      {selectedService && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute left-4 bottom-4 z-10 p-4 bg-black/50 backdrop-blur-md rounded-lg max-w-md border border-white/10"
        >
          <h2 className="text-xl font-bold text-white mb-2">{selectedService.title}</h2>
          <p className="text-white/80">{selectedService.description}</p>
          <Button variant="default" size="sm" className="mt-4">
            En savoir plus
          </Button>
        </motion.div>
      )}
    </div>
  );
};
