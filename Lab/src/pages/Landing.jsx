import { motion } from 'framer-motion'
import { ArrowRight, Download, LayoutTemplate, Move, Palette, Ruler, Rotate3d, Type } from 'lucide-react'
import { actions } from '../store'
import Scene from '../scene/Scene'
import { Logo } from '../ui/primitives'

const FEATURES = [
  { icon: Rotate3d, title: 'True 3D preview', text: 'Spin, zoom and inspect your tee from every angle — front, back and sleeves.' },
  { icon: Move, title: 'Place anywhere', text: 'Drag designs across the whole shirt or snap to chest, back, lower and sleeve zones.' },
  { icon: Type, title: 'Text with style', text: 'Ten display fonts with colour, outline, spacing and bold/italic controls.' },
  { icon: LayoutTemplate, title: 'Starter templates', text: 'Begin from a ready-made look, then make every layer your own.' },
  { icon: Palette, title: 'Any colour', text: 'Curated swatches plus a full colour picker for shirt, text and graphics.' },
  { icon: Ruler, title: 'Size-accurate export', text: 'Export PNGs for XS–3XL with spec sheet, dimension lines and up to 4096 px.' },
]
const STEPS = [
  ['01', 'Pick your base', 'Choose a shirt colour and size.'],
  ['02', 'Add your design', 'Drop in text, graphics or your own artwork.'],
  ['03', 'Export', 'Download a crisp PNG, ready to share or print.'],
]

const rise = (i = 0) => ({ initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6, delay: i * 0.07 } })

export default function Landing() {
  return (
    <div className="h-full overflow-y-auto">
      <header className="sticky top-0 z-20 border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Logo />
          <button className="btn-primary" onClick={() => actions.start(false)}>Open studio <ArrowRight className="h-4 w-4" /></button>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 lg:grid-cols-2 lg:px-8 lg:py-24">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-neutral-300">
            <span className="h-1.5 w-1.5 rounded-full bg-white" /> 3D custom tee studio
          </span>
          <h1 className="gradient-text mt-6 font-display text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            Design your tee.<br />See it in 3D.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-neutral-400">
            Place text, graphics and your own artwork anywhere on the shirt, then export a size-accurate PNG in seconds.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <button className="btn-primary !h-12 !px-6 !text-base" onClick={() => actions.start(false)}>Start designing <ArrowRight className="h-4 w-4" /></button>
            <button className="btn-ghost !h-12 !px-6 !text-base" onClick={() => actions.start(true)}>Blank shirt</button>
          </div>
          <dl className="mt-12 grid max-w-md grid-cols-3 divide-x divide-white/10 border-t border-white/10 pt-6">
            {[['7', 'Sizes'], ['10', 'Fonts'], ['4K', 'PNG export']].map(([n, l]) => (
              <div key={l} className="px-4 first:pl-0">
                <dt className="font-display text-3xl font-bold">{n}</dt>
                <dd className="mt-1 text-xs uppercase tracking-widest text-neutral-500">{l}</dd>
              </div>
            ))}
          </dl>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="panel stage-bg relative h-[420px] overflow-hidden sm:h-[540px] lg:h-[620px]">
          <div className="grid-bg pointer-events-none absolute inset-0" />
          <div className="absolute inset-0"><Scene mode="landing" /></div>
          <div className="pointer-events-none absolute inset-x-0 bottom-4 text-center text-xs text-neutral-500">Drag to spin</div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <motion.div {...rise()} className="mb-12 max-w-xl">
          <p className="label mb-3">Features</p>
          <h2 className="gradient-text font-display text-4xl font-bold tracking-tight">Everything a tee designer needs.</h2>
        </motion.div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, text }, i) => (
            <motion.div key={title} {...rise(i)} className="panel p-6 transition hover:border-white/25 hover:bg-white/[0.06]">
              <span className="mb-5 grid h-11 w-11 place-items-center rounded-xl border border-white/15 bg-gradient-to-b from-white/15 to-white/0"><Icon className="h-5 w-5" /></span>
              <h3 className="font-display text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">{text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {STEPS.map(([n, t, d], i) => (
            <motion.div key={n} {...rise(i)} className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-7">
              <div className="font-display text-5xl font-bold text-white/15">{n}</div>
              <h3 className="mt-6 font-display text-xl font-semibold">{t}</h3>
              <p className="mt-2 text-sm text-neutral-400">{d}</p>
            </motion.div>
          ))}
        </div>
        <motion.div {...rise()} className="panel mt-16 flex flex-col items-center gap-6 px-6 py-14 text-center">
          <h2 className="gradient-text font-display text-4xl font-bold tracking-tight">Ready when you are.</h2>
          <button className="btn-primary !h-12 !px-7 !text-base" onClick={() => actions.start(false)}><Download className="h-4 w-4 rotate-180" /> Open the studio</button>
        </motion.div>
      </section>

      <footer className="border-t border-white/5 py-8 text-center text-xs text-neutral-600">TeeLab · Built with React, Three.js & Tailwind</footer>
    </div>
  )
}
