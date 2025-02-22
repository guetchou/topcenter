
import { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";

const AvatarModel = ({ modelUrl }) => {
  const { scene } = useGLTF(modelUrl);
  const group = useRef();

  return (
    <group ref={group}>
      <primitive object={scene} scale={[1.5, 1.5, 1.5]} position={[0, -1.5, 0]} />
    </group>
  );
};

const AVATAR_MODELS = {
  'business-man': '/models/business-man.glb',
  'business-woman': '/models/business-woman.glb',
  'casual-man': '/models/casual-man.glb',
  'casual-woman': '/models/casual-woman.glb',
};

export const SimpleAvatar = () => {
  const [selectedModel, setSelectedModel] = useState('business-man');

  return (
    <Card className="p-4 w-full max-w-2xl mx-auto">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Avatar 3D</h2>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Choisir un avatar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="business-man">Homme d'affaires</SelectItem>
              <SelectItem value="business-woman">Femme d'affaires</SelectItem>
              <SelectItem value="casual-man">Homme casual</SelectItem>
              <SelectItem value="casual-woman">Femme casual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full h-[400px] rounded-lg overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800">
          <Canvas
            camera={{ position: [0, 0, 3], fov: 50 }}
            style={{ width: '100%', height: '100%' }}
          >
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <AvatarModel modelUrl={AVATAR_MODELS[selectedModel]} />
            <OrbitControls
              enablePan={false}
              enableZoom={true}
              minPolarAngle={Math.PI/3}
              maxPolarAngle={Math.PI/1.5}
              maxDistance={5}
              minDistance={2}
            />
          </Canvas>
        </div>

        <div className="flex justify-center space-x-4">
          <Button variant="outline" onClick={() => console.log("Animation 1")}>
            Saluer
          </Button>
          <Button variant="outline" onClick={() => console.log("Animation 2")}>
            Sourire
          </Button>
          <Button variant="outline" onClick={() => console.log("Animation 3")}>
            Parler
          </Button>
        </div>
      </div>
    </Card>
  );
};
