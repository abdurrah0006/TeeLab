import * as THREE from 'three'
import { ZONES } from '../data/constants'

const cache = new Map()

export function getPlacement(id) {
  const zone = ZONES.find((z) => z.id === id) ?? ZONES[0]
  const hit = cache.get(zone.id)
  if (hit) return { pos: [...hit.pos], normal: [...hit.normal] }
  const front = zone.side === 'front'
  return { pos: [zone.x, zone.y, front ? 0.125 : -0.115], normal: [0, 0, front ? 1 : -1] }
}

/** Interpolated vertex normal at a raycast hit (local space), facing the viewer. */
export function smoothNormal(hit, geometry, localPoint, rayDir) {
  const { a, b, c } = hit.face
  const pos = geometry.attributes.position
  const nor = geometry.attributes.normal
  const v = (attr, i) => new THREE.Vector3().fromBufferAttribute(attr, i)
  const out = new THREE.Vector3()
  THREE.Triangle.getInterpolation(localPoint, v(pos, a), v(pos, b), v(pos, c), v(nor, a), v(nor, b), v(nor, c), out)
  if (out.lengthSq() < 1e-8) out.copy(hit.face.normal)
  out.normalize()
  if (out.dot(rayDir) > 0) out.negate()
  return out
}

/** Finds the real surface point for each placement zone by ray-casting the shirt mesh. */
export function computeZones(geometry) {
  const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }))
  mesh.updateMatrixWorld()
  const ray = new THREE.Raycaster()
  for (const z of ZONES) {
    const front = z.side === 'front'
    const dir = new THREE.Vector3(0, 0, front ? -1 : 1)
    ray.set(new THREE.Vector3(z.x, z.y, front ? 2 : -2), dir)
    const hit = ray.intersectObject(mesh)[0]
    if (!hit) continue
    const normal = z.flat ? new THREE.Vector3(0, 0, front ? 1 : -1) : smoothNormal(hit, geometry, hit.point, dir)
    cache.set(z.id, { pos: hit.point.toArray(), normal: normal.toArray() })
  }
  mesh.material.dispose()
}
