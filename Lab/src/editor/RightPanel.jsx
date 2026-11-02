import { useSnapshot } from 'valtio'
import { ArrowDown, ArrowUp, Bold, Copy, Eye, EyeOff, Image as ImageIcon, Italic, Layers, Lock, MousePointer2, Shapes, Trash2, Type, Unlock } from 'lucide-react'
import state, { actions } from '../store'
import { FONTS } from '../data/constants'
import { layerLabel } from '../lib/utils'
import { ColorField, EmptyState, Section, Slider } from '../ui/primitives'
import ZonePicker from './ZonePicker'

const KIND_ICON = { text: Type, image: ImageIcon, shape: Shapes }

export function LayersPanel() {
  const { layers, selectedId } = useSnapshot(state)
  const list = [...layers].reverse()
  return (
    <div className="panel flex min-h-0 flex-col p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="label flex items-center gap-2"><Layers className="h-3.5 w-3.5" /> Layers</h3>
        <span className="text-[11px] text-neutral-600">{layers.length}</span>
      </div>
      {list.length === 0 ? (
        <EmptyState icon={MousePointer2} title="Nothing here yet" text="Add text, a graphic or an image from the toolbar, or start from a template." />
      ) : (
        <ul className="-mr-1 min-h-0 space-y-1 overflow-y-auto pr-1">
          {list.map((l) => {
            const Icon = KIND_ICON[l.kind] ?? Shapes
            const active = l.id === selectedId
            return (
              <li key={l.id}>
                <div
                  onClick={() => actions.select(l.id)}
                  className={`group flex cursor-pointer items-center gap-2 rounded-xl border px-2.5 py-2 transition ${active ? 'border-white/60 bg-white/10' : 'border-transparent hover:bg-white/5'}`}
                >
                  <Icon className="h-4 w-4 shrink-0 text-neutral-400" />
                  <span className={`min-w-0 flex-1 truncate text-sm ${l.visible ? '' : 'text-neutral-600 line-through'}`}>{layerLabel(l)}</span>
                  <button className="btn-icon !h-7 !w-7" aria-label={l.visible ? 'Hide layer' : 'Show layer'} onClick={(e) => { e.stopPropagation(); actions.updateLayer(l.id, { visible: !l.visible }) }}>
                    {l.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  </button>
                  <button className="btn-icon !h-7 !w-7" aria-label={l.locked ? 'Unlock layer' : 'Lock layer'} onClick={(e) => { e.stopPropagation(); actions.updateLayer(l.id, { locked: !l.locked }) }}>
                    {l.locked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export function Inspector() {
  const { layers, selectedId } = useSnapshot(state)
  const l = layers.find((x) => x.id === selectedId)
  if (!l) {
    return (
      <div className="panel p-4">
        <EmptyState icon={MousePointer2} title="Select a layer" text="Click a design on the shirt or in the list. Drag it to move it anywhere, even onto the sleeves and back." />
      </div>
    )
  }
  const set = (patch) => actions.updateLayer(l.id, patch)
  const hasOutline = l.kind !== 'image'

  return (
    <div className="panel min-h-0 overflow-y-auto p-4">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="min-w-0 truncate font-display text-base font-semibold">{layerLabel(l)}</h3>
        <div className="flex shrink-0 items-center">
          <button className="btn-icon" aria-label="Move up" onClick={() => actions.moveLayer(l.id, 1)}><ArrowUp className="h-4 w-4" /></button>
          <button className="btn-icon" aria-label="Move down" onClick={() => actions.moveLayer(l.id, -1)}><ArrowDown className="h-4 w-4" /></button>
          <button className="btn-icon" aria-label="Duplicate" onClick={() => actions.duplicateLayer(l.id)}><Copy className="h-4 w-4" /></button>
          <button className="btn-icon hover:!text-red-400" aria-label="Delete" onClick={() => actions.removeLayer(l.id)}><Trash2 className="h-4 w-4" /></button>
        </div>
      </div>

      {l.kind === 'text' && (
        <Section title="Text">
          <textarea className="field mb-3 resize-none" rows={2} value={l.text} onChange={(e) => set({ text: e.target.value })} />
          <div className="mb-3 flex gap-2">
            <select className="field !py-2" value={l.font} onChange={(e) => set({ font: e.target.value })} aria-label="Font">
              {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
            <button aria-label="Bold" aria-pressed={l.bold} onClick={() => set({ bold: !l.bold })} className={`btn-icon !h-10 !w-10 border border-white/10 ${l.bold ? '!bg-white !text-black' : ''}`}><Bold className="h-4 w-4" /></button>
            <button aria-label="Italic" aria-pressed={l.italic} onClick={() => set({ italic: !l.italic })} className={`btn-icon !h-10 !w-10 border border-white/10 ${l.italic ? '!bg-white !text-black' : ''}`}><Italic className="h-4 w-4" /></button>
          </div>
          <Slider label="Letter spacing" min={0} max={40} value={l.spacing} onChange={(v) => set({ spacing: v })} format={(v) => `${v}px`} />
        </Section>
      )}

      {l.kind !== 'image' && <Section title="Colour"><ColorField value={l.color} onChange={(c) => set({ color: c })} /></Section>}

      {hasOutline && (
        <Section title="Outline">
          <Slider label="Thickness" min={0} max={12} value={l.outlineWidth} onChange={(v) => set({ outlineWidth: v })} />
          {l.outlineWidth > 0 && <div className="mt-3"><ColorField value={l.outlineColor} onChange={(c) => set({ outlineColor: c })} /></div>}
        </Section>
      )}

      <Section title="Transform">
        <div className="space-y-4">
          <Slider label="Size" min={20} max={400} value={Math.round(l.scale * 100)} onChange={(v) => set({ scale: v / 100 })} format={(v) => `${v}%`} />
          <Slider label="Rotation" min={-180} max={180} value={Math.round(l.rotation)} onChange={(v) => set({ rotation: v })} format={(v) => `${v}°`} />
          <Slider label="Opacity" min={10} max={100} value={Math.round(l.opacity * 100)} onChange={(v) => set({ opacity: v / 100 })} format={(v) => `${v}%`} />
        </div>
      </Section>

      <Section title="Placement" hint="or drag on the shirt">
        <ZonePicker value={l.zone} onChange={(z) => actions.placeLayer(l.id, z)} />
      </Section>
    </div>
  )
}
