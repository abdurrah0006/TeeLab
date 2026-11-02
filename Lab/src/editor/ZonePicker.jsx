import { ZONES, ZONE_GROUPS } from '../data/constants'

export default function ZonePicker({ value, onChange }) {
  return (
    <div className="space-y-2">
      {ZONE_GROUPS.map((g) => (
        <div key={g} className="flex flex-wrap items-center gap-1.5">
          <span className="w-12 text-[11px] text-neutral-600">{g}</span>
          {ZONES.filter((z) => z.group === g).map((z) => (
            <button key={z.id} onClick={() => onChange(z.id)} className={`chip ${value === z.id ? 'chip-active' : ''}`}>
              {z.label}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}
