import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* =======================
   PARTICLE FIELD
======================= */
function ParticleField() {
  const ref = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const arr = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.getElapsedTime() * 0.02;
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.03;
    }
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#6366f1"
        transparent
        opacity={0.6}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

/* =======================
   CONNECTION LINES
======================= */
function ConnectionLines() {
  const ref = useRef<THREE.LineSegments>(null!);

  const { positions, colors } = useMemo(() => {
    const nodes: THREE.Vector3[] = [];
    const nodeCount = 50;
    const maxDistance = 4;

    for (let i = 0; i < nodeCount; i++) {
      nodes.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 5
        )
      );
    }

    const linePositions: number[] = [];
    const lineColors: number[] = [];

    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dist = nodes[i].distanceTo(nodes[j]);
        if (dist < maxDistance) {
          const opacity = 1 - dist / maxDistance;

          linePositions.push(
            nodes[i].x, nodes[i].y, nodes[i].z,
            nodes[j].x, nodes[j].y, nodes[j].z
          );

          lineColors.push(
            0.39, 0.4, 0.95, opacity * 0.3,
            0.39, 0.4, 0.95, opacity * 0.3
          );
        }
      }
    }

    return {
      positions: new Float32Array(linePositions),
      colors: new Float32Array(lineColors),
    };
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <lineSegments ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          array={colors}
          count={colors.length / 4}
          itemSize={4}
        />
      </bufferGeometry>
      <lineBasicMaterial
        vertexColors
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}

/* =======================
   FLOATING ORBS
======================= */
function FloatingOrbs() {
  const ref = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      ref.current.children.forEach((child, i) => {
        child.position.y =
          Math.sin(state.clock.getElapsedTime() * 0.5 + i * 0.5) * 0.5;
      });
    }
  });

  return (
    <group ref={ref}>
      {[...Array(5)].map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / 5) * Math.PI * 2) * 6,
            0,
            Math.sin((i / 5) * Math.PI * 2) * 6 - 3,
          ]}
        >
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshBasicMaterial color="#6366f1" transparent opacity={0.4} />
        </mesh>
      ))}
    </group>
  );
}

/* =======================
   MAIN BACKGROUND
======================= */
const ParticleBackground = () => {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <ParticleField />
        <ConnectionLines />
        <FloatingOrbs />
      </Canvas>
    </div>
  );
};

export default ParticleBackground;
