
import * as THREE from 'three';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        children?: React.ReactNode;
        position?: [number, number, number];
        rotation?: [number, number, number];
        scale?: [number, number, number];
        ref?: React.Ref<THREE.Group>;
      };
      mesh: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        children?: React.ReactNode;
        position?: [number, number, number];
        rotation?: [number, number, number];
        scale?: [number, number, number];
        ref?: React.Ref<THREE.Mesh>;
      };
      sphereGeometry: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        args?: [number, number?, number?];
      };
      boxGeometry: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        args?: [number, number?, number?];
      };
      meshStandardMaterial: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        color?: string | number;
        metalness?: number;
        roughness?: number;
      };
      meshBasicMaterial: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        color?: string | number;
      };
      ambientLight: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        intensity?: number;
        color?: string | number;
      };
      pointLight: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        intensity?: number;
        distance?: number;
        decay?: number;
        color?: string | number;
        position?: [number, number, number];
      };
      directionalLight: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        intensity?: number;
        color?: string | number;
        position?: [number, number, number];
      };
      spotLight: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        intensity?: number;
        distance?: number;
        angle?: number;
        penumbra?: number;
        decay?: number;
        color?: string | number;
        position?: [number, number, number];
      };
      hemisphereLight: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        skyColor?: string | number;
        groundColor?: string | number;
        intensity?: number;
      };
      primitive: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        object?: any;
      };
      scene: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      perspectiveCamera: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        fov?: number;
        aspect?: number;
        near?: number;
        far?: number;
        position?: [number, number, number];
      };
      orthographicCamera: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        left?: number;
        right?: number;
        top?: number;
        bottom?: number;
        near?: number;
        far?: number;
        position?: [number, number, number];
      };
      canvas: React.DetailedHTMLProps<React.CanvasHTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement>;
      extend: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

export {};
