
import * as THREE from 'three';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      sphereGeometry: any;
      boxGeometry: any;
      meshStandardMaterial: any;
      meshBasicMaterial: any;
      ambientLight: any;
      pointLight: any;
      directionalLight: any;
      spotLight: any;
      hemisphereLight: any;
      primitive: any;
      scene: any;
      perspectiveCamera: any;
      orthographicCamera: any;
      canvas: any;
      extend: any;
    }
  }
}

export {};
