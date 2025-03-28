
import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text, Line, Sphere } from "@react-three/drei";
import * as THREE from "three";
import { Spinner } from "@/components/ui/spinner";

interface Node {
  id: string;
  name: string;
  description: string;
  position: [number, number, number];
  connections: string[];
}

interface ServiceNodeProps {
  node: Node;
  active: boolean;
  onClick: () => void;
  connectedTo?: Node[];
}

const ServiceNode: React.FC<ServiceNodeProps> = ({ node, active, onClick, connectedTo = [] }) => {
  const nodeRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // Animation for the node
  useFrame(() => {
    if (nodeRef.current) {
      nodeRef.current.rotation.y += 0.01;
      if (active || hovered) {
        nodeRef.current.scale.setScalar(1.2);
      } else {
        nodeRef.current.scale.setScalar(1);
      }
    }
  });

  return (
    <>
      <Sphere
        ref={nodeRef}
        args={[0.5, 32, 32]}
        position={node.position}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial 
          color={active ? "#00ff00" : hovered ? "#aaffaa" : "#aaaaff"} 
          emissive={active ? "#003300" : hovered ? "#001100" : "#000033"}
          emissiveIntensity={0.5}
          roughness={0.3}
        />
      </Sphere>
      
      <Text
        position={[node.position[0], node.position[1] + 0.8, node.position[2]]}
        fontSize={0.2}
        color={active ? "#ffffff" : "#cccccc"}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#000000"
      >
        {node.name}
      </Text>
      
      {/* Draw connections to other nodes */}
      {active && connectedTo.map((connectedNode) => {
        // Create points for the line
        const points = [
          new THREE.Vector3(...node.position),
          new THREE.Vector3(...connectedNode.position)
        ];
        
        return (
          <Line
            key={`line-${node.id}-${connectedNode.id}`}
            points={points}
            color="#ffffff"
            lineWidth={1}
            dashed={false}
          />
        );
      })}
    </>
  );
};

// Camera controls component
const CameraController = () => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (controlsRef.current) {
      camera.position.set(0, 5, 10);
      camera.lookAt(0, 0, 0);
    }
  }, [camera]);

  return <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.1} />;
};

// The main 3D scene component
const Scene: React.FC<{
  services: Node[];
  activeNode: string | null;
  onSelectNode: (id: string) => void;
}> = ({ services, activeNode, onSelectNode }) => {
  // Find active node object
  const activeNodeObj = services.find(s => s.id === activeNode);
  
  // Find connected nodes
  const connectedNodes = activeNodeObj
    ? services.filter(s => activeNodeObj.connections.includes(s.id))
    : [];

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <CameraController />
      
      {/* Service nodes */}
      {services.map((service) => (
        <ServiceNode
          key={service.id}
          node={service}
          active={service.id === activeNode}
          onClick={() => onSelectNode(service.id)}
          connectedTo={service.id === activeNode ? connectedNodes : []}
        />
      ))}
      
      {/* Info panel for active node */}
      {activeNodeObj && (
        <group position={[0, -3, 0]}>
          <Text
            position={[0, 0, 0]}
            fontSize={0.3}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            maxWidth={5}
          >
            {activeNodeObj.description}
          </Text>
        </group>
      )}
    </>
  );
};

// Mock service data
const serviceNodes: Node[] = [
  {
    id: "call-center",
    name: "Centre d'Appel",
    description: "Des solutions de centre d'appel professionnelles avec une équipe formée pour répondre aux besoins de vos clients.",
    position: [0, 0, 0],
    connections: ["online-sales", "telephony"]
  },
  {
    id: "online-sales",
    name: "Ventes en Ligne",
    description: "Augmentez vos ventes avec nos stratégies de vente en ligne et nos experts en conversion.",
    position: [-3, 1, -2],
    connections: ["call-center", "telephony"]
  },
  {
    id: "telephony",
    name: "Systèmes Téléphoniques",
    description: "Solutions téléphoniques avancées adaptées aux entreprises de toutes tailles.",
    position: [3, 1, -2],
    connections: ["call-center", "online-sales"]
  },
  {
    id: "training",
    name: "Formation",
    description: "Programmes de formation pour vos équipes de vente et de service client.",
    position: [0, 2, -4],
    connections: ["call-center"]
  }
];

// Main component
export const ImmersiveServiceViewer: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  
  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-black/5 rounded-lg">
        <Spinner size="lg" className="text-primary" />
        <span className="ml-2 text-lg font-medium">Chargement de l'environnement 3D...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden border">
      <Canvas shadows>
        <Scene 
          services={serviceNodes} 
          activeNode={activeNode} 
          onSelectNode={setActiveNode} 
        />
      </Canvas>
      <div className="absolute bottom-4 left-4 bg-black/70 text-white p-3 rounded-md text-sm">
        <p>👆 Cliquez sur un nœud pour explorer</p>
        <p>👆 Cliquez et déplacez pour faire pivoter</p>
        <p>🖱️ Molette pour zoomer</p>
      </div>
    </div>
  );
};
