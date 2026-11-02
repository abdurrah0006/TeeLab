import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useLayerTexture, worldSize } from '../lib/textures'
import { buildDecal, frameCorners } from '../lib/decal'

function Frame({ layer, size }) {
  const geo = useMemo(
    () => new THREE.BufferGeometry().setFromPoints(frameCorners(layer, size)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [layer.pos[0], layer.pos[1], layer.pos[2], layer.normal[0], layer.normal[1], layer.normal[2], layer.rotation, size.w, size.h],
  )
  useEffect(() => () => geo.dispose(), [geo])
  return (
    <lineLoop name="ui-only" geometry={geo} renderOrder={999}>
      <lineBasicMaterial color="#ffffff" depthTest={false} transparent opacity={0.9} />
    </lineLoop>
  )
}

export default function DecalMesh({ mesh, layer, index, selected, onDown, interactive }) {
  const res = useLayerTexture(layer)
  const size = res ? worldSize(layer, res) : null

  const geometry = useMemo(
    () => (res && mesh ? buildDecal(mesh, layer, size) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mesh, res, layer.pos[0], layer.pos[1], layer.pos[2], layer.normal[0], layer.normal[1], layer.normal[2], layer.rotation, layer.scale],
  )
  useEffect(() => () => geometry?.dispose(), [geometry])

  if (!geometry || !layer.visible) return null
  const cursor = (v) => interactive && (document.body.style.cursor = v)

  return (
    <>
      <mesh
        geometry={geometry}
        renderOrder={10 + index}
        onPointerDown={interactive ? (e) => onDown(e, layer) : undefined}
        onPointerOver={(e) => { e.stopPropagation(); cursor(layer.locked ? 'pointer' : 'grab') }}
        onPointerOut={() => cursor('')}
      >
        <meshStandardMaterial
          map={res.texture}
          transparent
          opacity={layer.opacity}
          roughness={0.9}
          metalness={0}
          depthWrite={false}
          polygonOffset
          polygonOffsetFactor={-4 - index}
          polygonOffsetUnits={-4 - index}
        />
      </mesh>
      {interactive && selected && <Frame layer={layer} size={size} />}
    </>
  )
}
