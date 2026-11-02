import { useEffect } from 'react'
import { useSnapshot } from 'valtio'
import { Download, LayoutTemplate, RotateCcw, Shirt, Sparkles, Type, Upload } from 'lucide-react'
import state, { actions } from '../store'
import Scene from '../scene/Scene'
import { Logo } from '../ui/primitives'
import { GraphicsPanel, ShirtPanel, TemplatesPanel, TextPanel, UploadPanel } from '../editor/LeftPanels'
import { Inspector, LayersPanel } from '../editor/RightPanel'
import StageHud from '../editor/StageHud'
import ExportDialog from '../editor/ExportDialog'

const TOOLS = [
  { id: 'shirt', label: 'Shirt', icon: Shirt, Panel: ShirtPanel },
  { id: 'text', label: 'Text', icon: Type, Panel: TextPanel },
  { id: 'graphics', label: 'Graphics', icon: Sparkles, Panel: GraphicsPanel },
  { id: 'upload', label: 'Upload', icon: Upload, Panel: UploadPanel },
  { id: 'templates', label: 'Templates', icon: LayoutTemplate, Panel: TemplatesPanel },
]

function useShortcuts() {
  useEffect(() => {
    const onKey = (e) => {
      const t = e.target
      if (t instanceof HTMLElement && (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName))) return
      const id = state.selectedId
      if (e.key === 'Escape') actions.select(null)
      if (!id) return
      if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); actions.removeLayer(id) }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'd') { e.preventDefault(); actions.duplicateLayer(id) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}

export default function Editor() {
  const { tool } = useSnapshot(state)
  useShortcuts()
  const Active = TOOLS.find((t) => t.id === tool)?.Panel ?? ShirtPanel

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-16 shrink-0 items-center justify-between gap-3 px-4 lg:px-6">
        <Logo onClick={() => actions.go('landing')} />
        <div className="flex items-center gap-2">
          <button className="btn-ghost" onClick={() => window.confirm('Clear the whole design and start over?') && actions.reset()}>
            <RotateCcw className="h-4 w-4" /> <span className="hidden sm:inline">New design</span>
          </button>
          <button className="btn-primary" onClick={() => (state.exportOpen = true)}>
            <Download className="h-4 w-4" /> Export PNG
          </button>
        </div>
      </header>

      <main className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-3 pb-3 lg:grid lg:grid-cols-[76px_300px_minmax(0,1fr)_340px] lg:overflow-hidden lg:px-6 lg:pb-6">
        <nav aria-label="Tools" className="panel order-2 flex shrink-0 gap-1 overflow-x-auto p-2 lg:order-1 lg:flex-col lg:overflow-visible">
          {TOOLS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => actions.setTool(id)}
              aria-pressed={tool === id}
              className={`flex min-w-[64px] flex-1 flex-col items-center gap-1.5 rounded-xl px-2 py-3 text-[11px] font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-white/60 lg:flex-none ${
                tool === id ? 'bg-white text-black' : 'text-neutral-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" /> {label}
            </button>
          ))}
        </nav>

        <aside className="panel order-3 min-h-[280px] shrink-0 overflow-y-auto p-4 lg:order-2 lg:min-h-0">
          <Active />
        </aside>

        <section className="panel stage-bg relative order-1 h-[52vh] min-h-[380px] shrink-0 overflow-hidden lg:order-3 lg:h-auto lg:min-h-0">
          <div className="grid-bg pointer-events-none absolute inset-0" />
          <div className="absolute inset-0"><Scene mode="editor" /></div>
          <StageHud />
        </section>

        <aside className="order-4 flex shrink-0 flex-col gap-3 lg:min-h-0 lg:grid lg:grid-rows-[minmax(120px,0.8fr)_minmax(0,1.6fr)]">
          <LayersPanel />
          <Inspector />
        </aside>
      </main>

      <ExportDialog />
    </div>
  )
}
