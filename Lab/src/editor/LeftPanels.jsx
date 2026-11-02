import { useRef, useState } from 'react'
import { useSnapshot } from 'valtio'
import { Check, ImagePlus, Plus, Sparkles, Upload } from 'lucide-react'
import state, { actions } from '../store'
import { FONTS, SHAPES, SIZES, SWATCHES, TEMPLATES } from '../data/constants'
import { readImageFile } from '../lib/images'
import { ColorField, Section, TeeIcon } from '../ui/primitives'
import ZonePicker from './ZonePicker'

export function ShirtPanel() {
  const { color, size } = useSnapshot(state)
  const sz = SIZES.find((s) => s.id === size)
  return (
    <>
      <Section title="Shirt colour">
        <div className="grid grid-cols-6 gap-2">
          {SWATCHES.map((c) => (
            <button
              key={c}
              aria-label={`Shirt colour ${c}`}
              onClick={() => (state.color = c)}
              className={`relative aspect-square rounded-xl border outline-none transition hover:scale-105 focus-visible:ring-2 focus-visible:ring-white/60 ${
                color.toLowerCase() === c ? 'border-white ring-2 ring-white/40' : 'border-white/15'
              }`}
              style={{ background: c }}
            >
              {color.toLowerCase() === c && <Check className={`absolute inset-0 m-auto h-4 w-4 ${c === '#ffffff' || c === '#f2f2f2' || c === '#d4d4d4' || c === '#f5deb3' || c === '#fca5a5' ? 'text-black' : 'text-white'}`} />}
            </button>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <label className="relative h-10 w-10 shrink-0 cursor-pointer overflow-hidden rounded-xl border border-white/20" style={{ background: color }}>
            <input type="color" value={color} onChange={(e) => (state.color = e.target.value)} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" aria-label="Custom shirt colour" />
          </label>
          <input
            className="field font-mono uppercase"
            value={color}
            maxLength={7}
            onChange={(e) => /^#[0-9a-f]{0,6}$/i.test(e.target.value) && (state.color = e.target.value.length === 7 ? e.target.value : state.color)}
            onBlur={(e) => (e.target.value = state.color)}
            aria-label="Hex colour"
          />
        </div>
      </Section>

      <Section title="Size" hint="scales the 3D model">
        <div className="grid grid-cols-4 gap-2">
          {SIZES.map((s) => (
            <button key={s.id} onClick={() => (state.size = s.id)} className={`h-10 rounded-xl border text-sm font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-white/60 ${size === s.id ? 'border-white bg-white text-black' : 'border-white/10 bg-white/[0.03] text-neutral-300 hover:border-white/30'}`}>
              {s.id}
            </button>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-3 divide-x divide-white/10 rounded-xl border border-white/10 bg-black/30 text-center">
          {[['Chest', sz.chest], ['Length', sz.length], ['Sleeve', sz.sleeve]].map(([k, v]) => (
            <div key={k} className="py-3">
              <div className="font-display text-lg font-bold leading-none">{v}<span className="ml-0.5 text-[10px] font-normal text-neutral-500">cm</span></div>
              <div className="label mt-1.5 !text-[10px]">{k}</div>
            </div>
          ))}
        </div>
      </Section>
    </>
  )
}

export function TextPanel() {
  const { zone } = useSnapshot(state)
  const [text, setText] = useState('Your text')
  const [font, setFont] = useState('Anton')
  const add = () => text.trim() && actions.addText(text, font)
  return (
    <>
      <Section title="Place on"><ZonePicker value={zone} onChange={actions.setZone} /></Section>
      <Section title="Your text">
        <textarea className="field resize-none" rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder="Type something…" />
      </Section>
      <Section title="Font">
        <div className="grid grid-cols-2 gap-2">
          {FONTS.map((f) => (
            <button key={f} onClick={() => setFont(f)} style={{ fontFamily: `"${f}", sans-serif` }} className={`h-12 truncate rounded-xl border px-2 text-base outline-none transition focus-visible:ring-2 focus-visible:ring-white/60 ${font === f ? 'border-white bg-white text-black' : 'border-white/10 bg-white/[0.03] text-neutral-200 hover:border-white/30'}`}>
              {f}
            </button>
          ))}
        </div>
      </Section>
      <button className="btn-primary w-full" onClick={add} disabled={!text.trim()}><Plus className="h-4 w-4" /> Add text to shirt</button>
    </>
  )
}

export function GraphicsPanel() {
  const { zone } = useSnapshot(state)
  return (
    <>
      <Section title="Place on"><ZonePicker value={zone} onChange={actions.setZone} /></Section>
      <Section title="Graphics" hint="tap to add">
        <div className="grid grid-cols-4 gap-2">
          {SHAPES.map((s) => (
            <button key={s.id} title={s.name} aria-label={`Add ${s.name}`} onClick={() => actions.addShape(s)} className="group grid aspect-square place-items-center rounded-xl border border-white/10 bg-white/[0.03] outline-none transition hover:border-white/40 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/60">
              <svg viewBox="0 0 24 24" className="h-7 w-7 transition group-hover:scale-110"><path d={s.path} fill="#fff" fillRule={s.evenodd ? 'evenodd' : 'nonzero'} /></svg>
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-neutral-500">Change colour, outline and size in the editor on the right.</p>
      </Section>
    </>
  )
}

export function UploadPanel() {
  const { zone } = useSnapshot(state)
  const input = useRef(null)
  const [over, setOver] = useState(false)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const handle = async (file) => {
    setErr('')
    setBusy(true)
    try { actions.addImage(await readImageFile(file)) } catch (e) { setErr(e.message) }
    setBusy(false)
  }
  return (
    <>
      <Section title="Place on"><ZonePicker value={zone} onChange={actions.setZone} /></Section>
      <Section title="Upload artwork">
        <label
          onDragOver={(e) => { e.preventDefault(); setOver(true) }}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => { e.preventDefault(); setOver(false); handle(e.dataTransfer.files[0]) }}
          className={`flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-dashed px-4 py-10 text-center transition ${over ? 'border-white bg-white/10' : 'border-white/20 bg-white/[0.02] hover:border-white/50'}`}
        >
          <span className="grid h-12 w-12 place-items-center rounded-xl border border-white/15 bg-white/5">{busy ? <span className="spinner" /> : <Upload className="h-5 w-5" />}</span>
          <span className="text-sm font-medium">Drop an image or click to browse</span>
          <span className="text-xs text-neutral-500">PNG with transparency works best</span>
          <input ref={input} type="file" accept="image/*" className="sr-only" onChange={(e) => { handle(e.target.files[0]); e.target.value = '' }} />
        </label>
        {err && <p role="alert" className="mt-3 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">{err}</p>}
      </Section>
      <div className="flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs leading-relaxed text-neutral-400">
        <ImagePlus className="mt-0.5 h-4 w-4 shrink-0" /> Images are resized to 1024 px for smooth 3D editing and stay on your device.
      </div>
    </>
  )
}

export function TemplatesPanel() {
  const { layers } = useSnapshot(state)
  const apply = (t) => {
    if (layers.length && !window.confirm('Replace your current design with this template?')) return
    actions.applyTemplate(t)
  }
  return (
    <Section title="Starter designs" hint={`${TEMPLATES.length} templates`}>
      <div className="grid grid-cols-2 gap-3">
        {TEMPLATES.map((t) => (
          <button key={t.id} onClick={() => apply(t)} className="group rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-left outline-none transition hover:border-white/40 focus-visible:ring-2 focus-visible:ring-white/60">
            <div className="relative grid aspect-square place-items-center rounded-xl bg-gradient-to-b from-white/10 to-black/40">
              <TeeIcon color={t.shirt} className="h-3/4 w-3/4 drop-shadow-[0_8px_16px_rgba(0,0,0,.6)] transition group-hover:scale-105" />
              <Sparkles className="absolute right-2 top-2 h-3.5 w-3.5 text-neutral-500" />
            </div>
            <div className="mt-2.5 text-sm font-semibold leading-tight">{t.name}</div>
            <div className="text-xs text-neutral-500">{t.tag} · {t.layers.length} layers</div>
          </button>
        ))}
      </div>
    </Section>
  )
}
