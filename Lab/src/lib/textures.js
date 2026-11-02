import { useEffect, useState } from 'react'
import * as THREE from 'three'

const FS = 200 // font size used when rasterising text
export const TEXT_UNIT = 0.00022 // world units per text pixel at scale 1

function drawText(l) {
  const font = `${l.italic ? 'italic ' : ''}${l.bold ? 700 : 400} ${FS}px "${l.font}", sans-serif`
  const lines = String(l.text || ' ').split('\n')
  const spacing = `${l.spacing || 0}px`
  const m = document.createElement('canvas').getContext('2d')
  m.font = font
  if ('letterSpacing' in m) m.letterSpacing = spacing
  const stroke = (l.outlineWidth || 0) * 2
  const pad = FS * 0.1 + stroke
  const lh = FS * 1.15
  const w = Math.ceil(Math.max(...lines.map((t) => m.measureText(t).width)) + pad * 2)
  const h = Math.ceil(lines.length * lh + pad * 2)
  const k = Math.min(1, 4096 / Math.max(w, h))
  const c = document.createElement('canvas')
  c.width = Math.max(2, Math.round(w * k))
  c.height = Math.max(2, Math.round(h * k))
  const ctx = c.getContext('2d')
  ctx.scale(k, k)
  ctx.font = font
  if ('letterSpacing' in ctx) ctx.letterSpacing = spacing
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.lineJoin = 'round'
  lines.forEach((t, i) => {
    const y = pad + lh * (i + 0.5)
    if (stroke > 0) {
      ctx.lineWidth = stroke
      ctx.strokeStyle = l.outlineColor
      ctx.strokeText(t, w / 2, y)
    }
    ctx.fillStyle = l.color
    ctx.fillText(t, w / 2, y)
  })
  return { source: c, aspect: w / h, px: w }
}

function drawShape(l) {
  const S = 512
  const c = document.createElement('canvas')
  c.width = c.height = S
  const ctx = c.getContext('2d')
  const k = S / 30
  ctx.translate(3 * k, 3 * k)
  ctx.scale(k, k)
  const p = new Path2D(l.path)
  const rule = l.evenodd ? 'evenodd' : 'nonzero'
  if (l.outlineWidth > 0) {
    ctx.lineWidth = l.outlineWidth * 0.2
    ctx.lineJoin = 'round'
    ctx.strokeStyle = l.outlineColor
    ctx.stroke(p)
  }
  ctx.fillStyle = l.color
  ctx.fill(p, rule)
  return { source: c, aspect: 1, px: S }
}

/** Returns { texture, aspect, px } for any layer kind; re-rasterises when its look changes. */
export function useLayerTexture(layer) {
  const [res, setRes] = useState(null)
  const key =
    layer.kind === 'image'
      ? `img:${layer.src}`
      : JSON.stringify([layer.kind, layer.text, layer.font, layer.bold, layer.italic, layer.color, layer.outlineWidth, layer.outlineColor, layer.spacing, layer.path, layer.evenodd])

  useEffect(() => {
    let dead = false
    let tex
    const finish = ({ source, aspect, px }) => {
      if (dead) return
      tex = new THREE.Texture(source)
      tex.colorSpace = THREE.SRGBColorSpace
      tex.anisotropy = 8
      tex.needsUpdate = true
      setRes({ texture: tex, aspect, px })
    }
    if (layer.kind === 'text') {
      const spec = `${layer.italic ? 'italic ' : ''}${layer.bold ? 700 : 400} ${FS}px "${layer.font}"`
      Promise.resolve(document.fonts?.load(spec, layer.text || ' '))
        .catch(() => {})
        .then(() => !dead && finish(drawText(layer)))
    } else if (layer.kind === 'shape') {
      finish(drawShape(layer))
    } else {
      const img = new window.Image()
      img.onload = () => finish({ source: img, aspect: (img.naturalWidth || 1) / (img.naturalHeight || 1), px: img.naturalWidth })
      img.src = layer.src
    }
    return () => {
      dead = true
      tex?.dispose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return res
}

/** World-space width/height of a layer's decal. */
export function worldSize(layer, res) {
  const s = layer.scale
  if (layer.kind === 'text') {
    const w = res.px * TEXT_UNIT * s
    return { w, h: w / res.aspect }
  }
  const base = layer.kind === 'image' ? 0.2 : 0.14
  return res.aspect >= 1 ? { w: base * s, h: (base * s) / res.aspect } : { w: base * s * res.aspect, h: base * s }
}
