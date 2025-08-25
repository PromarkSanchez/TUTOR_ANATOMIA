// src/Corazon.jsx
import React, { useRef, useEffect, useState } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// El componente del marcador que se desvanece no necesita cambios
function HighlightMarker({ position }) {
    const markerRef = useRef();
    const materialRef = useRef();
  
    useEffect(() => {
        markerRef.current.scale.set(1, 1, 1);
        materialRef.current.opacity = 1.0;
        materialRef.current.emissiveIntensity = 5.0;
    }, [position]);

    useFrame(() => {
        if (materialRef.current.opacity > 0) {
            materialRef.current.opacity -= 0.02; 
            materialRef.current.emissiveIntensity -= 0.1;
        }
        if (markerRef.current.scale.x > 0.3) {
            markerRef.current.scale.lerp(new THREE.Vector3(0.3, 0.3, 0.3), 0.1);
        }
    });

    return (
        <mesh ref={markerRef} position={position}>
            <sphereGeometry args={[0.03, 32, 32]} />
            <meshStandardMaterial ref={materialRef} color="#00ffff" emissive="#aaffff" transparent toneMapped={false} />
        </mesh>
    );
}

export function Corazon({ scale = 1, selectedBoneInfo, isAnimating, controlsRef }) {
  const group = useRef();
  // ¡Asegúrate de que el archivo se llame corazon_final.glb en tu carpeta /public!
  const { scene, animations } = useGLTF('corazon_final.glb');
  const { actions } = useAnimations(animations, group);
  
  const [targetBone, setTargetBone] = useState(null); 
  const targetPosition = useRef(new THREE.Vector3());
  const lookAtPosition = useRef(new THREE.Vector3());
  const shouldAnimateCamera = useRef(false);

  // --- ¡LÓGICA DE ANIMACIÓN CORREGIDA! ---
  useEffect(() => {
    // Al cargar, reproduce la primera animación disponible.
    const firstAnim = actions[Object.keys(actions)[0]];
    if (firstAnim) {
      firstAnim.play();
    }
  }, [actions]);

  useEffect(() => {
    // Este efecto reacciona al botón de pausa/play
    const firstAnim = actions[Object.keys(actions)[0]];
    if (firstAnim) {
      firstAnim.paused = !isAnimating;
    }
  }, [isAnimating, actions]);

  // --- LÓGICA DE ZOOM Y SELECCIÓN (La que ya tenías y funcionaba) ---
  useEffect(() => {
    shouldAnimateCamera.current = false;
    let boneFound = null;
    if (selectedBoneInfo?.boneName && scene) {
      scene.traverse((obj) => {
        if (obj.isBone && obj.name === selectedBoneInfo.boneName) {
          boneFound = obj;
        }
      });
    }
    
    setTargetBone(boneFound); 
    
    if (boneFound) {
      const bonePos = new THREE.Vector3();
      boneFound.getWorldPosition(bonePos);
      lookAtPosition.current.copy(bonePos);
      const offset = new THREE.Vector3(0, 0.1, 0.4); 
      targetPosition.current.copy(bonePos).add(offset);
      shouldAnimateCamera.current = true;
    } else if (controlsRef.current) {
        lookAtPosition.current.set(0, 0, 0);
        // Regresa a la posición inicial de la cámara suavemente
        targetPosition.current.set(0, 0.5, 3);
        shouldAnimateCamera.current = true; 
    }
  }, [selectedBoneInfo, scene, controlsRef]);

  // --- LÓGICA DE MOVIMIENTO DE CÁMARA (La que ya tenías y funcionaba) ---
  useFrame((state, delta) => {
    if (shouldAnimateCamera.current && controlsRef.current) {
      // Usamos delta para que la animación sea suave y consistente en diferentes velocidades de refresco
      const speed = delta * 4;
      state.camera.position.lerp(targetPosition.current, speed);
      controlsRef.current.target.lerp(lookAtPosition.current, speed);
      
      // Detiene la animación de la cámara una vez que llega a su destino
      if (state.camera.position.distanceTo(targetPosition.current) < 0.01) {
        shouldAnimateCamera.current = false;
      }
    }
  });

  return (
    <group scale={scale} ref={group} dispose={null}>
      <primitive object={scene} />
      {targetBone && <HighlightMarker position={lookAtPosition.current} />}
    </group>
  );
}

useGLTF.preload('corazon_final.glb');