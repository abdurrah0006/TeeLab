export const clamp = (v, a, b) => Math.min(b, Math.max(a, v))

export function contrast(hex) {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 140 ? '#0a0a0a' : '#ffffff'
}

export function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}

export function layerLabel(l) {
  if (l.kind === 'text') return (l.text || 'Text').split('\n')[0].slice(0, 28) || 'Text'
  return l.name || (l.kind === 'image' ? 'Image' : 'Graphic')
}
