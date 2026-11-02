import * as THREE from 'three'
import { SIZES } from '../data/constants'
import { downloadBlob } from './utils'

// Registered by components living inside the <Canvas>.
export const bridge = { get: null, settle: null }

const HIDE = new Set(['no-export', 'ui-only'])
const VIEW_LABEL = { front: 'Front view', back: 'Back view', current: 'Current view' }
const DIST = 1.9

// Chest / length anchor points (shirt-local space) used for dimension lines.
const ANCHORS = {
  chestL: [-0.154, -0.05, 0], chestR: [0.151, -0.05, 0],
  lenTop: [-0.325, 0.261, 0], lenBottom: [-0.325, -0.352, 0],
}

/** Renders the live 3D scene at px × px and returns { canvas, anchors } (anchors in pixels). */
function capture({ view, px }) {
  const { gl, scene, camera, controls, size } = bridge.get()
  bridge.settle?.()
  const root = scene.getObjectByName('shirt-root')
  const target = Math.min(px, gl.capabilities.maxTextureSize, 8192)
  const prev = { pos: camera.position.clone(), aspect: camera.aspect, pr: gl.getPixelRatio(), w: size.width, h: size.height, on: controls?.enabled }

  const hidden = []
  scene.traverse((o) => { if (HIDE.has(o.name) && o.visible) { o.visible = false; hidden.push(o) } })
  if (controls) controls.enabled = false
  if (view === 'front') camera.position.set(0, 0, DIST)
  if (view === 'back') camera.position.set(0, 0, -DIST)
  camera.aspect = 1
  camera.updateProjectionMatrix()
  camera.lookAt(0, 0, 0)
  camera.updateMatrixWorld()

  gl.setPixelRatio(1)
  gl.setSize(target, target, false)
  gl.render(scene, camera)

  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = px
  canvas.getContext('2d').drawImage(gl.domElement, 0, 0, px, px)

  let anchors = null
  if (view !== 'current' && root) {
    root.updateMatrixWorld(true)
    anchors = {}
    for (const [k, p] of Object.entries(ANCHORS)) {
      const v = new THREE.Vector3(...p).applyMatrix4(root.matrixWorld).project(camera)
      anchors[k] = [(v.x * 0.5 + 0.5) * px, (-v.y * 0.5 + 0.5) * px]
    }
  }

  gl.setPixelRatio(prev.pr)
  gl.setSize(prev.w, prev.h, false)
  camera.position.copy(prev.pos)
  camera.aspect = prev.aspect
  camera.updateProjectionMatrix()
  camera.lookAt(0, 0, 0)
  hidden.forEach((o) => { o.visible = true })
  if (controls) controls.enabled = prev.on
  return { canvas, anchors, view }
}

function pill(ctx, text, x, y, u, fill, ink) {
  ctx.font = `700 ${22 * u}px "Space Grotesk", Inter, sans-serif`
  const w = ctx.measureText(text).width + 28 * u
  const h = 40 * u
  ctx.fillStyle = fill
  ctx.beginPath()
  ctx.roundRect(x - w / 2, y - h / 2, w, h, h / 2)
  ctx.fill()
  ctx.fillStyle = ink
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, x, y + u)
}

function dimension(ctx, a, b, text, u, tone) {
  ctx.strokeStyle = tone.line
  ctx.lineWidth = 3 * u
  ctx.lineCap = 'round'
  ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.stroke()
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]) + Math.PI / 2
  const t = 14 * u
  for (const p of [a, b]) {
    ctx.beginPath()
    ctx.moveTo(p[0] - Math.cos(ang) * t, p[1] - Math.sin(ang) * t)
    ctx.lineTo(p[0] + Math.cos(ang) * t, p[1] + Math.sin(ang) * t)
    ctx.stroke()
  }
  pill(ctx, text, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, u, tone.line, tone.pill)
}

function compose({ shots, px, bg, size, color, spec, dims }) {
  const n = shots.length
  const F = spec ? Math.round(px * 0.22) : 0
  const W = px * n
  const H = px + F
  const u = px / 1000
  const dark = bg === 'black' || bg === 'gradient'
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const ctx = c.getContext('2d')

  if (bg === 'white') { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, px) }
  if (bg === 'black') { ctx.fillStyle = '#050505'; ctx.fillRect(0, 0, W, px) }
  if (bg === 'gradient') {
    const g = ctx.createLinearGradient(0, 0, W, px)
    g.addColorStop(0, '#050505'); g.addColorStop(1, '#4a4a4a')
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, px)
    const r = ctx.createRadialGradient(W / 2, px * 0.45, 0, W / 2, px * 0.45, px * 0.6 * n)
    r.addColorStop(0, 'rgba(255,255,255,.14)'); r.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = r; ctx.fillRect(0, 0, W, px)
  }

  const tone = bg === 'transparent'
    ? { line: '#0a0a0a', pill: '#ffffff' }
    : dark ? { line: '#ffffff', pill: '#0a0a0a' } : { line: '#0a0a0a', pill: '#ffffff' }

  shots.forEach((s, i) => {
    ctx.drawImage(s.canvas, i * px, 0, px, px)
    if (dims && s.anchors) {
      ctx.save()
      ctx.translate(i * px, 0)
      const a = s.anchors
      dimension(ctx, a.chestL, a.chestR, `CHEST ${size.chest} cm`, u, tone)
      dimension(ctx, a.lenTop, a.lenBottom, `LENGTH ${size.length} cm`, u, tone)
      ctx.restore()
    }
  })

  if (spec) {
    const bandDark = dark
    ctx.fillStyle = bandDark ? '#0a0a0a' : '#ffffff'
    ctx.fillRect(0, px, W, F)
    ctx.fillStyle = bandDark ? 'rgba(255,255,255,.14)' : 'rgba(0,0,0,.12)'
    ctx.fillRect(0, px, W, 2 * u)
    const ink = bandDark ? '#ffffff' : '#0a0a0a'
    const mute = bandDark ? '#9a9a9a' : '#6b6b6b'
    const bx = (W - px) / 2
    const cy = px + F / 2
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'left'

    ctx.fillStyle = ink
    ctx.font = `700 ${40 * u}px "Space Grotesk", Inter, sans-serif`
    ctx.fillText('TEELAB', bx + 50 * u, cy - 26 * u)
    ctx.fillStyle = color
    ctx.strokeStyle = mute
    ctx.lineWidth = 2 * u
    ctx.beginPath(); ctx.arc(bx + 66 * u, cy + 28 * u, 14 * u, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
    ctx.fillStyle = mute
    ctx.font = `500 ${21 * u}px Inter, sans-serif`
    const label = shots.length > 1 ? 'Front + back' : VIEW_LABEL[shots[0].view]
    ctx.fillText(`${color.toUpperCase()} · ${label}`, bx + 92 * u, cy + 29 * u)

    const bs = 124 * u
    const bxx = bx + 395 * u
    ctx.fillStyle = ink
    ctx.beginPath(); ctx.roundRect(bxx, cy - bs / 2, bs, bs, 24 * u); ctx.fill()
    ctx.fillStyle = bandDark ? '#0a0a0a' : '#ffffff'
    ctx.textAlign = 'center'
    ctx.font = `700 ${size.id.length > 2 ? 46 * u : 62 * u}px "Space Grotesk", Inter, sans-serif`
    ctx.fillText(size.id, bxx + bs / 2, cy + 3 * u)

    const cols = [['CHEST', size.chest], ['LENGTH', size.length], ['SLEEVE', size.sleeve]]
    cols.forEach(([k, v], i) => {
      const x = bx + 590 * u + i * 135 * u
      ctx.textAlign = 'left'
      ctx.fillStyle = ink
      ctx.font = `700 ${40 * u}px "Space Grotesk", Inter, sans-serif`
      ctx.fillText(`${v}`, x, cy - 10 * u)
      ctx.fillStyle = mute
      ctx.font = `500 ${17 * u}px Inter, sans-serif`
      ctx.fillText(`${k} · CM`, x, cy + 30 * u)
    })
  }
  return c
}

/** Public API: render, compose, download. */
export async function exportPng({ views, px, bg, sizeId, spec, dims, color }) {
  if (!bridge.get) throw new Error('The 3D scene is not ready yet.')
  const size = SIZES.find((s) => s.id === sizeId) ?? SIZES[2]
  await document.fonts?.ready
  const shots = views.map((view) => capture({ view, px }))
  const canvas = compose({ shots, px, bg, size, color, spec, dims })
  const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'))
  if (!blob) throw new Error('Your browser could not create the PNG (image too large?). Try a lower resolution.')
  const name = `teelab-${views.length > 1 ? 'front-back' : views[0]}-${size.id}-${px}px.png`
  downloadBlob(blob, name)
  return { name, w: canvas.width, h: canvas.height }
}
