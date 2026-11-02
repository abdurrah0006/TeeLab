import { useSnapshot } from 'valtio'
import { Hand, Move } from 'lucide-react'
import state, { actions } from '../store'

const VIEWS = [['front', 'Front'], ['back', 'Back'], ['left', 'Right sleeve'], ['right', 'Left sleeve']]

export default function StageHud() {
  const { size, color, view } = useSnapshot(state)
  return (
    <>
      <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2 rounded-full border border-white/10 bg-black/50 py-1.5 pl-2 pr-3 text-xs backdrop-blur">
        <span className="h-4 w-4 rounded-full border border-white/30" style={{ background: color }} />
        <span className="font-medium">Size {size}</span>
      </div>

      <div className="pointer-events-none absolute right-3 top-3 hidden items-center gap-3 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-[11px] text-neutral-400 backdrop-blur md:flex">
        <span className="flex items-center gap-1.5"><Hand className="h-3.5 w-3.5" /> Drag to rotate</span>
        <span className="flex items-center gap-1.5"><Move className="h-3.5 w-3.5" /> Drag a design to move</span>
      </div>

      <div className="absolute inset-x-0 bottom-3 flex justify-center px-3">
        <div className="flex max-w-full gap-1 overflow-x-auto rounded-full border border-white/10 bg-black/60 p-1 backdrop-blur">
          {VIEWS.map(([id, label]) => (
            <button key={id} onClick={() => actions.look(id)} className={`h-8 shrink-0 rounded-full px-3.5 text-xs font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-white/60 ${view.nonce > 0 && view.name === id ? 'bg-white text-black' : 'text-neutral-300 hover:bg-white/10 hover:text-white'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
