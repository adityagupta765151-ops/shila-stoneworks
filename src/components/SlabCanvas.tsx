import { useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { IMG } from "../data";

/* C014: one 3D slab whose rotation follows scroll. Loaded lazily as its own chunk. */
function backMesh() {
  const c = document.createElement("canvas"); c.width = c.height = 256; const g = c.getContext("2d")!;
  g.fillStyle = "#cfc9bd"; g.fillRect(0, 0, 256, 256); g.strokeStyle = "rgba(60,60,60,.45)"; g.lineWidth = 2;
  for (let i = 0; i <= 256; i += 16) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 256); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(256, i); g.stroke(); }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(6, 4); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function Slab({ id, progress }: { id: string; progress: { current: number } }) {
  const ref = useRef<THREE.Mesh>(null), light = useRef<THREE.PointLight>(null);
  const tex = useLoader(THREE.TextureLoader, IMG(id));
  tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  const back = useMemo(backMesh, []);
  const edge = useMemo(() => { const t = tex.clone(); t.repeat.set(1, 0.03); t.needsUpdate = true; return t; }, [tex]);
  const mats = useMemo(() => {
    const face = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.12, metalness: 0.05 });
    const side = new THREE.MeshStandardMaterial({ map: edge, roughness: 0.25 });
    const rear = new THREE.MeshStandardMaterial({ map: back, roughness: 0.9 });
    return [side, side, side, side, face, rear];
  }, [tex, edge, back]);
  useFrame((st, dt) => {
    const p = progress.current, m = ref.current; if (!m) return;
    const ry = -0.5 + p * 3.6, rx = -0.25 + Math.sin(p * Math.PI) * 0.35;
    m.rotation.y += (ry - m.rotation.y) * Math.min(1, dt * 6);
    m.rotation.x += (rx - m.rotation.x) * Math.min(1, dt * 6);
    const wide = st.viewport.aspect > 1.15, base = wide ? 1 : 0.62;
    const z = base * (1 + Math.sin(p * Math.PI * 2) * 0.1); m.scale.setScalar(m.scale.x + (z - m.scale.x) * Math.min(1, dt * 4));
    const px = wide ? 0.85 : 0, py = wide ? 0 : 0.05;
    m.position.x += (px - m.position.x) * Math.min(1, dt * 5); m.position.y += (py - m.position.y) * Math.min(1, dt * 5);
    if (light.current) { light.current.position.x = Math.sin(st.clock.elapsedTime * 0.6) * 3; }
  });
  return (
    <>
      <mesh ref={ref} material={mats}><boxGeometry args={[2.9, 1.8, 0.07]} /></mesh>
      <pointLight ref={light} position={[2, 1.5, 2.5]} intensity={18} color="#fff6ea" />
    </>
  );
}
export default function SlabCanvas({ id, progress }: { id: string; progress: { current: number } }) {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 4.2], fov: 38 }} gl={{ antialias: true, powerPreference: "low-power" }}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[-3, 3, 4]} intensity={1.6} />
      <Slab id={id} progress={progress} />
    </Canvas>
  );
}
