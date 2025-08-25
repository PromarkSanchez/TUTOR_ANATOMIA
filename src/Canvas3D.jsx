// src/Canvas3D.jsx
import React, { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Center, Environment } from '@react-three/drei';
import { Corazon } from './Corazon';

export default function Canvas3D({ selectedBoneInfo, isRotating, isAnimating }) {
  const controlsRef = useRef();

  return (
    <Canvas camera={{ position: [0, 0.5, 3], fov: 35 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 5, 5]} intensity={1.5} />
      <Suspense fallback={null}>
        <Center>
            <Corazon
              scale={8}
              selectedBoneInfo={selectedBoneInfo}
              isAnimating={isAnimating}
              controlsRef={controlsRef}
            />
        </Center>
      </Suspense>
      <Environment preset="studio" />
      <OrbitControls
        ref={controlsRef}
        autoRotate={isRotating}
        autoRotateSpeed={0.5}
        enablePan={false}
        minDistance={0.5}
        maxDistance={5}
      />
    </Canvas>
  );
}