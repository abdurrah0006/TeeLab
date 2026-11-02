export const SIZES = [
  { id: 'XS', scale: 0.9, chest: 46, length: 66, sleeve: 18.5 },
  { id: 'S', scale: 0.95, chest: 49, length: 69, sleeve: 19.5 },
  { id: 'M', scale: 1, chest: 52, length: 72, sleeve: 20.5 },
  { id: 'L', scale: 1.06, chest: 55, length: 74, sleeve: 21.5 },
  { id: 'XL', scale: 1.12, chest: 58, length: 76, sleeve: 22.5 },
  { id: '2XL', scale: 1.18, chest: 61, length: 78, sleeve: 23.5 },
  { id: '3XL', scale: 1.24, chest: 64, length: 80, sleeve: 24.5 },
]

export const FONTS = [
  'Anton', 'Bebas Neue', 'Oswald', 'Inter', 'Space Grotesk', 'Playfair Display',
  'Pacifico', 'Permanent Marker', 'Orbitron', 'Press Start 2P',
]

export const SWATCHES = [
  '#ffffff', '#f2f2f2', '#d4d4d4', '#9ca3af', '#525252', '#262626', '#0a0a0a',
  '#f5deb3', '#fca5a5', '#e11d48', '#7f1d1d', '#f59e0b', '#14532d', '#22c55e',
  '#38bdf8', '#2563eb', '#1e3a8a', '#7c3aed',
]

export const INK = ['#ffffff', '#d4d4d4', '#737373', '#0a0a0a', '#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#ec4899']

// x/y are positions on the shirt (model units). side = which face the ray is cast at.
export const ZONES = [
  { id: 'front-center', label: 'Front', group: 'Front', side: 'front', x: 0, y: 0.02, flat: true },
  { id: 'chest-left', label: 'Left chest', group: 'Front', side: 'front', x: 0.075, y: 0.085, flat: true },
  { id: 'chest-right', label: 'Right chest', group: 'Front', side: 'front', x: -0.075, y: 0.085, flat: true },
  { id: 'front-lower', label: 'Lower', group: 'Front', side: 'front', x: 0, y: -0.17, flat: true },
  { id: 'back-center', label: 'Back', group: 'Back', side: 'back', x: 0, y: 0.0, flat: true },
  { id: 'back-upper', label: 'Upper back', group: 'Back', side: 'back', x: 0, y: 0.12, flat: true },
  { id: 'back-lower', label: 'Lower back', group: 'Back', side: 'back', x: 0, y: -0.17, flat: true },
  { id: 'sleeve-left', label: 'Left sleeve', group: 'Sleeves', side: 'front', x: 0.225, y: 0.115 },
  { id: 'sleeve-right', label: 'Right sleeve', group: 'Sleeves', side: 'front', x: -0.225, y: 0.115 },
]
export const ZONE_GROUPS = ['Front', 'Back', 'Sleeves']

// 24x24 filled paths
export const SHAPES = [
  { id: 'star', name: 'Star', path: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
  { id: 'heart', name: 'Heart', path: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' },
  { id: 'bolt', name: 'Bolt', path: 'M13 2L3 14h8l-1 8 10-12h-8l1-8z' },
  { id: 'sparkle', name: 'Sparkle', path: 'M12 1c.8 6 3.2 9 11 11-7.8 2-10.2 5-11 11-.8-6-3.2-9-11-11 7.8-2 10.2-5 11-11z' },
  { id: 'moon', name: 'Moon', path: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' },
  { id: 'smile', name: 'Smile', evenodd: true, path: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM8.5 8.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM15.5 8.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM7 14h10a5 5 0 0 1-10 0z' },
  { id: 'ring', name: 'Ring', evenodd: true, path: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12z' },
  { id: 'circle', name: 'Circle', path: 'M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20z' },
  { id: 'square', name: 'Square', path: 'M3 3h18v18H3z' },
  { id: 'triangle', name: 'Triangle', path: 'M12 2L22 21H2z' },
  { id: 'diamond', name: 'Diamond', path: 'M12 1L23 12L12 23L1 12z' },
  { id: 'hexagon', name: 'Hexagon', path: 'M12 2l9 5v10l-9 5-9-5V7z' },
  { id: 'plus', name: 'Plus', path: 'M9 2h6v7h7v6h-7v7H9v-7H2V9h7z' },
  { id: 'arrow', name: 'Arrow', path: 'M12 2l9 10h-6v10H9V12H3z' },
]

const T = (text, font, color, zone, scale = 1, extra = {}) => ({ kind: 'text', text, font, color, zone, scale, ...extra })
const S = (shapeId, color, zone, scale = 1, extra = {}) => {
  const s = SHAPES.find((x) => x.id === shapeId)
  return { kind: 'shape', name: s.name, path: s.path, evenodd: !!s.evenodd, color, zone, scale, ...extra }
}

export const TEMPLATES = [
  {
    id: 'high-voltage', name: 'High Voltage', tag: 'Front + back', shirt: '#0a0a0a',
    layers: [
      S('bolt', '#ffffff', 'front-center', 1.1),
      T('HIGH VOLTAGE', 'Orbitron', '#ffffff', 'front-lower', 0.75, { bold: true }),
      T('LIVE WIRE', 'Anton', '#ffffff', 'back-upper', 1.2),
    ],
  },
  {
    id: 'varsity', name: 'Varsity', tag: 'Classic', shirt: '#262626',
    layers: [
      T('VARSITY', 'Anton', '#ffffff', 'front-center', 1.15),
      T('EST. 2026', 'Space Grotesk', '#d4d4d4', 'front-lower', 0.6, { bold: true, spacing: 6 }),
      T('23', 'Anton', '#ffffff', 'back-center', 3),
    ],
  },
  {
    id: 'minimal', name: 'Minimal', tag: 'Clean', shirt: '#f2f2f2',
    layers: [
      T('teelab', 'Space Grotesk', '#0a0a0a', 'chest-left', 0.45, { bold: true }),
      T('less, but better.', 'Playfair Display', '#0a0a0a', 'back-upper', 0.8, { italic: true }),
    ],
  },
  {
    id: 'sunset', name: 'Sunset Club', tag: 'Retro', shirt: '#d4d4d4',
    layers: [
      S('ring', '#0a0a0a', 'front-center', 1.5),
      T('Sunset Club', 'Pacifico', '#0a0a0a', 'front-lower', 1.0),
      S('sparkle', '#0a0a0a', 'back-center', 1.2),
    ],
  },
  {
    id: 'stargazer', name: 'Stargazer', tag: 'Night sky', shirt: '#1e3a8a',
    layers: [
      T('STARGAZER', 'Bebas Neue', '#ffffff', 'front-center', 1.4),
      S('star', '#ffffff', 'chest-left', 0.5),
      S('star', '#ffffff', 'chest-right', 0.5),
      S('sparkle', '#ffffff', 'sleeve-left', 0.45),
    ],
  },
  {
    id: 'player-one', name: 'Player 1', tag: 'Pixel', shirt: '#ffffff',
    layers: [
      S('heart', '#0a0a0a', 'front-center', 1.3),
      T('PLAYER 1', 'Press Start 2P', '#0a0a0a', 'front-lower', 0.55),
    ],
  },
]

export const EXPORT_RES = [
  { px: 1080, label: 'Web', note: '1080 px' },
  { px: 2048, label: 'HD', note: '2048 px' },
  { px: 4096, label: 'Print', note: '4096 px' },
]
