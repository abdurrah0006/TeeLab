import { motion } from 'framer-motion'
import { Shirt } from 'lucide-react'
import { INK } from '../data/constants'

export function Logo({ onClick, size = 'md' }) {
  const s = size === 'lg' ? 'h-10 w-10' : 'h-8 w-8'
  return (
    <button onClick={onClick} className="group flex items-center gap-2.5 outline-none" aria-label="TeeLab home">
      <span className={`${s} grid place-items-center rounded-xl border border-white/20 bg-gradient-to-br from-neutral-600 to-black shadow-inner transition group-hover:border-white/50`}>
        <Shirt className="h-[55%] w-[55%]" strokeWidth={2.2} />
      </span>
      <span className="font-display text-lg font-bold tracking-tight">TeeLab</span>
    </button>
  )
}

export function Section({ title, hint, children, className = '' }) {
  return (
    <section className={`mb-6 last:mb-0 ${className}`}>
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <h3 className="label">{title}</h3>
        {hint && <span className="text-[11px] text-neutral-600">{hint}</span>}
      </div>
      {children}
    </section>
  )
}

export function Slider({ label, value, min, max, step = 1, onChange, format }) {
  const p = ((value - min) / (max - min)) * 100
  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between">
        <span className="label">{label}</span>
        <span className="text-xs tabular-nums text-neutral-300">{format ? format(value) : value}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} style={{ '--p': `${p}%` }} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  )
}

export function Segmented({ options, value, onChange, className = '' }) {
  return (
    <div className={`grid gap-1 rounded-xl border border-white/10 bg-black/30 p-1 ${className}`} style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0,1fr))` }}>
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          className={`h-8 rounded-lg px-2 text-xs font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-white/60 ${
            value === o.id ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function Toggle({ label, desc, checked, onChange }) {
  return (
    <button role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className="flex w-full items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-left outline-none transition hover:border-white/25 focus-visible:ring-2 focus-visible:ring-white/60">
      <span>
        <span className="block text-sm font-medium">{label}</span>
        {desc && <span className="block text-xs text-neutral-500">{desc}</span>}
      </span>
      <span className={`relative h-5 w-9 shrink-0 rounded-full transition ${checked ? 'bg-white' : 'bg-white/15'}`}>
        <span className={`absolute top-0.5 h-4 w-4 rounded-full transition-all ${checked ? 'left-[18px] bg-black' : 'left-0.5 bg-white'}`} />
      </span>
    </button>
  )
}

export function ColorField({ value, onChange, swatches = INK, label }) {
  const v = value.toLowerCase()
  return (
    <div>
      {label && <div className="label mb-2.5">{label}</div>}
      <div className="flex flex-wrap items-center gap-2">
        {swatches.map((c) => (
          <button
            key={c}
            aria-label={`Colour ${c}`}
            onClick={() => onChange(c)}
            className={`h-7 w-7 rounded-full border outline-none transition hover:scale-110 focus-visible:ring-2 focus-visible:ring-white/60 ${
              v === c ? 'border-black ring-2 ring-white' : 'border-white/25'
            }`}
            style={{ background: c }}
          />
        ))}
        <label
          className="relative h-7 w-7 cursor-pointer overflow-hidden rounded-full border border-white/25 transition hover:scale-110"
          style={{ background: 'conic-gradient(#f43f5e,#f59e0b,#84cc16,#06b6d4,#6366f1,#d946ef,#f43f5e)' }}
          title="Custom colour"
        >
          <input type="color" value={/^#[0-9a-f]{6}$/i.test(value) ? value : '#000000'} onChange={(e) => onChange(e.target.value)} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
        </label>
      </div>
    </div>
  )
}

export function EmptyState({ icon: Icon, title, text }) {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-dashed border-white/15 p-5 text-center">
      <Icon className="mx-auto mb-2 h-6 w-6 text-neutral-500" />
      <div className="text-sm font-medium">{title}</div>
      <p className="mt-1 text-xs leading-relaxed text-neutral-500">{text}</p>
    </motion.div>
  )
}

export const TEE_PATH = 'M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z'

export function TeeIcon({ color = '#fff', className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={color} stroke="rgba(255,255,255,.35)" strokeWidth="0.6" strokeLinejoin="round">
      <path d={TEE_PATH} />
    </svg>
  )
}
