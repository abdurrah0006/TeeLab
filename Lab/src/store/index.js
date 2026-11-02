import { proxy, subscribe } from 'valtio'
import { TEMPLATES } from '../data/constants'
import { getPlacement } from '../lib/zones'
import { contrast } from '../lib/utils'

const KEY = 'teelab:design:v2'
const uid = () => Math.random().toString(36).slice(2, 9)

function load() {
  try {
    const d = JSON.parse(localStorage.getItem(KEY))
    return d && Array.isArray(d.layers) ? d : null
  } catch {
    return null
  }
}
const saved = load()

const state = proxy({
  page: 'landing', // 'landing' | 'editor'
  color: saved?.color ?? '#f2f2f2',
  size: saved?.size ?? 'M',
  layers: saved?.layers ?? [],
  selectedId: null,
  tool: 'shirt', // shirt | text | graphics | upload | templates
  zone: 'front-center', // where new items are placed
  view: { name: 'front', nonce: 0 },
  exportOpen: false,
})

function makeLayer(spec) {
  const { zone = state.zone, ...rest } = spec
  const pl = getPlacement(zone)
  return {
    id: uid(), visible: true, locked: false, opacity: 1, rotation: 0, scale: 1,
    outlineWidth: 0, outlineColor: '#000000', spacing: 0, bold: false, italic: false,
    zone, pos: pl.pos, normal: pl.normal, ...rest,
  }
}

const find = (id) => state.layers.find((l) => l.id === id)

export const actions = {
  go: (page) => { state.page = page; state.selectedId = null },
  start(blank) {
    if (blank) { state.layers = []; state.color = '#f2f2f2' }
    state.page = 'editor'
  },
  setTool: (t) => { state.tool = t },
  setZone: (z) => { state.zone = z },
  select: (id) => { state.selectedId = id },
  look: (name) => { state.view = { name, nonce: state.view.nonce + 1 } },

  addLayer(spec) {
    const layer = makeLayer(spec)
    state.layers.push(layer)
    state.selectedId = layer.id
    return layer
  },
  addText: (text, font) => actions.addLayer({ kind: 'text', text, font, color: contrast(state.color) }),
  addShape: (s) => actions.addLayer({ kind: 'shape', name: s.name, path: s.path, evenodd: !!s.evenodd, color: contrast(state.color) }),
  addImage: (img) => actions.addLayer({ kind: 'image', ...img }),

  updateLayer(id, patch) {
    const l = find(id)
    if (l) Object.assign(l, patch)
  },
  placeLayer(id, zone) {
    const l = find(id)
    if (!l) return
    Object.assign(l, { zone, ...getPlacement(zone) })
    state.zone = zone
  },
  removeLayer(id) {
    state.layers = state.layers.filter((l) => l.id !== id)
    if (state.selectedId === id) state.selectedId = null
  },
  duplicateLayer(id) {
    const l = find(id)
    if (!l) return
    const copy = JSON.parse(JSON.stringify(l))
    copy.id = uid()
    copy.zone = null
    copy.pos = [l.pos[0] + 0.03, l.pos[1] - 0.03, l.pos[2]]
    state.layers.push(copy)
    state.selectedId = copy.id
  },
  moveLayer(id, dir) {
    const i = state.layers.findIndex((l) => l.id === id)
    const j = i + dir
    if (i < 0 || j < 0 || j >= state.layers.length) return
    const arr = [...state.layers]
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
    state.layers = arr
  },
  applyTemplate(t) {
    state.color = t.shirt
    state.layers = t.layers.map(makeLayer)
    state.selectedId = null
  },
  /** Re-snap zone-bound layers once real surface positions are known. */
  resnap() {
    state.layers.forEach((l) => { if (l.zone) Object.assign(l, getPlacement(l.zone)) })
  },
  reset() {
    state.layers = []
    state.color = '#f2f2f2'
    state.size = 'M'
    state.selectedId = null
  },
}

if (!saved) actions.applyTemplate(TEMPLATES[0])

let timer
subscribe(state, () => {
  clearTimeout(timer)
  timer = setTimeout(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ color: state.color, size: state.size, layers: state.layers }))
    } catch { /* storage full or unavailable */ }
  }, 400)
})

export default state
