import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { bridge } from '../lib/exporter'

/** Exposes the live R3F state to the exporter. */
export default function ExportBridge() {
  const get = useThree((s) => s.get)
  useEffect(() => {
    bridge.get = get
    return () => { bridge.get = null }
  }, [get])
  return null
}
