import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment, Html, Lightformer, OrbitControls } from '@react-three/drei'
import { actions } from '../store'
import Shirt from './Shirt'
import CameraDirector from './CameraDirector'
import ExportBridge from './ExportBridge'

function Loader() {
  return (
    <Html center>
      <div className="flex items-center gap-2 whitespace-nowrap text-xs text-neutral-400">
        <span className="spinner" /> Loading shirt…
      </div>
    </Html>
  )
}

export default function Scene({ mode = 'editor' }) {
  const editor = mode === 'editor'
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0.05, 2.3], fov: 30, near: 0.1, far: 50 }}
      gl={{ preserveDrawingBuffer: true, antialias: true, alpha: true }}
      onPointerMissed={() => editor && actions.select(null)}
      style={{ touchAction: 'none' }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[2, 3, 4]} intensity={1.1} />
      <directionalLight position={[-3, 1, -3]} intensity={0.55} />
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={2.2} position={[0, 4, 4]} scale={[10, 4, 1]} />
        <Lightformer form="rect" intensity={1.2} position={[-5, 1, 2]} scale={[4, 6, 1]} />
        <Lightformer form="rect" intensity={1.2} position={[5, 1, -2]} scale={[4, 6, 1]} />
        <Lightformer form="rect" intensity={1.5} position={[0, 2, -5]} scale={[10, 4, 1]} />
      </Environment>

      <Suspense fallback={<Loader />}>
        <Shirt interactive={editor} />
      </Suspense>

      <group name="no-export">
        <ContactShadows position={[0, -0.46, 0]} opacity={0.45} scale={3} blur={2.6} far={0.9} />
      </group>

      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={editor}
        enableDamping
        dampingFactor={0.08}
        minDistance={0.9}
        maxDistance={3.5}
        autoRotate={!editor}
        autoRotateSpeed={1.6}
      />
      {editor && (
        <>
          <CameraDirector />
          <ExportBridge />
        </>
      )}
    </Canvas>
  )
}
