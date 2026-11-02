import * as THREE from 'three'
import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry.js'

const UP = new THREE.Vector3(0, 1, 0)
export const DECAL_DEPTH = 0.12

/** Quaternion that points a decal's +Z along `normal`, keeps +Y "up", then spins by `deg`. */
export function orientation(normal, deg = 0) {
  const z = new THREE.Vector3(...normal).normalize()
  const x = new THREE.Vector3().crossVectors(UP, z)
  if (x.lengthSq() < 1e-6) x.set(1, 0, 0)
  x.normalize()
  const y = new THREE.Vector3().crossVectors(z, x)
  const q = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z))
  return q.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), THREE.MathUtils.degToRad(deg)))
}

/** Builds a decal geometry in the mesh's local space. */
export function buildDecal(mesh, layer, size) {
  const euler = new THREE.Euler().setFromQuaternion(orientation(layer.normal, layer.rotation))
  mesh.updateWorldMatrix(true, false)
  const saved = mesh.matrixWorld.clone()
  mesh.matrixWorld.identity()
  const geo = new DecalGeometry(mesh, new THREE.Vector3(...layer.pos), euler, new THREE.Vector3(size.w, size.h, DECAL_DEPTH))
  mesh.matrixWorld.copy(saved)
  return geo
}

/** Four corners of the layer rectangle, lifted slightly off the surface. */
export function frameCorners(layer, size) {
  const q = orientation(layer.normal, layer.rotation)
  const ax = new THREE.Vector3(1, 0, 0).applyQuaternion(q)
  const ay = new THREE.Vector3(0, 1, 0).applyQuaternion(q)
  const az = new THREE.Vector3(0, 0, 1).applyQuaternion(q).multiplyScalar(0.008)
  const c = new THREE.Vector3(...layer.pos).add(az)
  return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([sx, sy]) =>
    c.clone().addScaledVector(ax, (sx * size.w) / 2).addScaledVector(ay, (sy * size.h) / 2),
  )
}
