import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Perf } from 'r3f-perf';
import {
  FirstPersonControls,
  MapControls,
  PerspectiveCamera,
  PresentationControls,
} from '@react-three/drei';
import * as THREE from 'three';

const temp = new THREE.Object3D();
const material = new THREE.MeshPhongMaterial({ color: 'red' });
const geometry = new THREE.SphereGeometry(1.0);
const Balls = ({ locations }: { locations: [number, number][] }) => {
  const ref = useRef<THREE.InstancedMesh>();

  useFrame(() => {
    let counter = 0;
    for (const [x, y] of locations) {
      const id = counter++;
      temp.position.set(x, y, 0);
      temp.rotation.set(0, 0, 0);
      temp.updateMatrix();
      ref.current.setMatrixAt(id, temp.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[geometry, material, locations.length]} />
  );
};

export function AppCanvas({ locations }: { locations: [number, number][] }) {
  return (
    <Canvas style={{ background: 'black' }}>
      <Perf />
      {/* <PerspectiveCamera makeDefault /> */}
      {/* <PresentationControls> */}
      <MapControls screenSpacePanning />

      <ambientLight intensity={0.5} />
      <directionalLight color='red' position={[0, 0, 5]} />
      <directionalLight color='red' position={[0, 5, 5]} />
      <mesh>
        <boxGeometry />
        <meshStandardMaterial />
      </mesh>
      <Balls locations={locations} />

      {/* </PresentationControls> */}
    </Canvas>
  );
}
