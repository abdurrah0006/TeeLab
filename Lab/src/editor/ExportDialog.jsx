import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSnapshot } from 'valtio'
import { Download, X } from 'lucide-react'
import state from '../store'
import { EXPORT_RES, SIZES } from '../data/constants'
import { exportPng } from '../lib/exporter'
import { Section, Segmented, Toggle } from '../ui/primitives'

const VIEWS = [
  { id: 'front', label: 'Front' },
  { id: 'back', label: 'Back' },
  { id: 'both', label: 'Front + back' },
  { id: 'current', label: 'Current' },
]
const BGS = [
  { id: 'transparent', label: 'Clear' },
  { id: 'white', label: 'White' },
  { id: 'black', label: 'Black' },
  { id: 'gradient', label: 'Gradient' },
]

export default function ExportDialog() {
  const { exportOpen, size, color } = useSnapshot(state)
  const [view, setView] = useState('front')
  const [px, setPx] = useState(2048)
  const [bg, setBg] = useState('transparent')
  const [spec, setSpec] = useState(true)
  const [dims, setDims] = useState(true)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState(null)

  const sz = SIZES.find((s) => s.id === size)
  const n = view === 'both' ? 2 : 1
  const outW = px * n
  const outH = px + (spec ? Math.round(px * 0.22) : 0)
  const close = () => { state.exportOpen = false; setMsg(null) }

  const run = async () => {
    setBusy(true)
    setMsg(null)
    // let the button state paint before the heavy render
    await new Promise((r) => setTimeout(r, 60))
    try {
      const views = view === 'both' ? ['front', 'back'] : [view]
      const out = await exportPng({ views, px, bg, sizeId: size, spec, dims: dims && view !== 'current', color })
      setMsg({ ok: true, text: `Saved ${out.name} (${out.w} × ${out.h})` })
    } catch (e) {
      setMsg({ ok: false, text: e.message || 'Export failed.' })
    }
    setBusy(false)
  }

  return (
    <AnimatePresence>
      {exportOpen && (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close}>
          <motion.div
            role="dialog" aria-modal="true" aria-label="Export PNG"
            className="panel max-h-[92vh] w-full max-w-lg overflow-y-auto !bg-neutral-950/90 p-6"
            initial={{ y: 24, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 12, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold">Export PNG</h2>
                <p className="mt-1 text-sm text-neutral-500">Rendered from the 3D model at your chosen shirt size.</p>
              </div>
              <button className="btn-icon" onClick={close} aria-label="Close"><X className="h-4 w-4" /></button>
            </div>

            <Section title="Shirt size">
              <div className="grid grid-cols-7 gap-1.5">
                {SIZES.map((s) => (
                  <button key={s.id} onClick={() => (state.size = s.id)} className={`h-10 rounded-lg border text-xs font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-white/60 ${size === s.id ? 'border-white bg-white text-black' : 'border-white/10 text-neutral-300 hover:border-white/30'}`}>{s.id}</button>
                ))}
              </div>
              <p className="mt-2 text-xs text-neutral-500">Chest {sz.chest} cm · Length {sz.length} cm · Sleeve {sz.sleeve} cm</p>
            </Section>

            <Section title="View"><Segmented options={VIEWS} value={view} onChange={setView} /></Section>

            <Section title="Resolution" hint="per view">
              <div className="grid grid-cols-3 gap-2">
                {EXPORT_RES.map((r) => (
                  <button key={r.px} onClick={() => setPx(r.px)} className={`rounded-xl border px-3 py-2.5 text-left outline-none transition focus-visible:ring-2 focus-visible:ring-white/60 ${px === r.px ? 'border-white bg-white text-black' : 'border-white/10 hover:border-white/30'}`}>
                    <div className="text-sm font-semibold">{r.label}</div>
                    <div className={`text-xs ${px === r.px ? 'text-neutral-600' : 'text-neutral-500'}`}>{r.note}</div>
                  </button>
                ))}
              </div>
            </Section>

            <Section title="Background"><Segmented options={BGS} value={bg} onChange={setBg} /></Section>

            <Section title="Extras">
              <div className="space-y-2">
                <Toggle label="Size spec sheet" desc="Adds a footer with size, measurements and colour" checked={spec} onChange={setSpec} />
                <Toggle label="Dimension lines" desc={view === 'current' ? 'Only for Front / Back views' : 'Chest width and body length on the shirt'} checked={dims && view !== 'current'} onChange={setDims} />
              </div>
            </Section>

            {msg && (
              <p role="status" className={`mb-4 rounded-xl border px-3 py-2 text-xs ${msg.ok ? 'border-white/20 bg-white/5 text-neutral-200' : 'border-red-400/30 bg-red-500/10 text-red-300'}`}>{msg.text}</p>
            )}

            <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-5">
              <div className="text-xs text-neutral-500">Output <span className="text-neutral-300">{outW} × {outH} px</span></div>
              <div className="flex gap-2">
                <button className="btn-ghost" onClick={close}>Close</button>
                <button className="btn-primary" onClick={run} disabled={busy}>
                  {busy ? <><span className="spinner !border-black/20 !border-t-black" /> Rendering…</> : <><Download className="h-4 w-4" /> Download PNG</>}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
