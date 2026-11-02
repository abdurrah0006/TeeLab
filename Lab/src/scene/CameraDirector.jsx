import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { easing } from 'maath'
import { useSnapshot } from 'valtio'
import state from '../store'

const AZIMUTH = { front: 0, back: Math.PI, left: -Math.PI / 2, right: Math.PI / 2 }

/** Smoothly swings the orbit camera to Front / Back / Left / Right when requested. */
export default function CameraDirector() {
  const { view } = useSnapshot(state)
  const goal = useRef(null)

  useEffect(() => {
    if (view.nonce === 0) return
    const a = AZIMUTH[view.name] ?? 0
    goal.current = { a, t: 0 }
  }, [view])

  useFrame(({ camera, controls }, dt) => {
    const g = goal.current
    if (!g) return
    g.t += dt
    const d = 2.3
    const target = [Math.sin(g.a) * d, 0.05, Math.cos(g.a) * d]
    easing.damp3(camera.position, target, 0.2, dt)
    controls?.update()
    if (g.t > 1.4) goal.current = null
  })
  return null
}
