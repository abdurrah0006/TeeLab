import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { easing } from 'maath'
import { useSnapshot } from 'valtio'
import * as THREE from 'three'
import state, { actions } from '../store'
import { SIZES } from '../data/constants'
import { computeZones, smoothNormal } from '../lib/zones'
import { bridge } from '../lib/exporter'
import DecalMesh from './DecalMesh'

const URL = `${import.meta.env.BASE_URL}shirt_baked.glb`
useGLTF.preload(URL)

const sizeScale = () => SIZES.find((s) => s.id === state.size)?.scale ?? 1

export default function Shirt({ interactive }) {
  const snap = useSnapshot(state)
  const { nodes, materials } = useGLTF(URL)
  const get = useThree((s) => s.get)
  const geometry = nodes.T_Shirt_male.geometry
  const [mesh, setMesh] = useState(null)
  const root = useRef()
  const drag = useRef(null)

  const material = useMemo(() => {
    const m = materials.lambert1.clone()
    m.roughness = 0.95
    m.metalness = 0
    m.side = THREE.DoubleSide
    m.color.set(state.color)
    return m
  }, [materials])

  // Real surface placement for zones, then snap any zone-bound layers onto it.
  useEffect(() => {
    computeZones(geometry)
    actions.resnap()
  }, [geometry])

  // Lets the exporter jump straight to the final colour/scale (no easing mid-capture).
  useEffect(() => {
    bridge.settle = () => {
      material.color.set(state.color)
      root.current?.scale.setScalar(sizeScale())
    }
    return () => { bridge.settle = null }
  }, [material])

  useFrame((_, dt) => {
    easing.dampC(material.color, snap.color, 0.2, dt)
    const s = sizeScale()
    easing.damp3(root.current.scale, [s, s, s], 0.25, dt)
  })

  // Drag a selected design across the surface.
  useEffect(() => {
    if (!interactive || !mesh) return
    const el = get().gl.domElement
    const ray = new THREE.Raycaster()
    const ndc = new THREE.Vector2()
    let raf = 0
    let last = null

    const apply = () => {
      raf = 0
      if (!drag.current || !last) return
      const r = el.getBoundingClientRect()
      ndc.set(((last.x - r.left) / r.width) * 2 - 1, -((last.y - r.top) / r.height) * 2 + 1)
      ray.setFromCamera(ndc, get().camera)
      const hit = ray.intersectObject(mesh, false)[0]
      if (!hit) return
      const local = mesh.worldToLocal(hit.point.clone())
      const n = smoothNormal(hit, geometry, local, ray.ray.direction)
      actions.updateLayer(drag.current, { pos: local.toArray(), normal: n.toArray(), zone: null })
    }
    const move = (e) => {
      if (!drag.current) return
      last = { x: e.clientX, y: e.clientY }
      if (!raf) raf = requestAnimationFrame(apply)
    }
    const up = () => {
      if (!drag.current) return
      drag.current = null
      const c = get().controls
      if (c) c.enabled = true
      document.body.style.cursor = ''
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
      cancelAnimationFrame(raf)
    }
  }, [interactive, mesh, geometry, get])

  const onDown = (e, layer) => {
    e.stopPropagation()
    actions.select(layer.id)
    if (layer.locked) return
    drag.current = layer.id
    const c = get().controls
    if (c) c.enabled = false
    document.body.style.cursor = 'grabbing'
  }

  return (
    <group ref={root} name="shirt-root" position={[0, 0.0455, -0.0098]}>
      <mesh
        ref={setMesh}
        geometry={geometry}
        material={material}
        onClick={interactive ? (e) => { e.stopPropagation(); actions.select(null) } : undefined}
      />
      {mesh &&
        snap.layers.map((layer, i) => (
          <DecalMesh
            key={layer.id}
            mesh={mesh}
            layer={layer}
            index={i}
            selected={snap.selectedId === layer.id}
            onDown={onDown}
            interactive={interactive}
          />
        ))}
    </group>
  )
}
