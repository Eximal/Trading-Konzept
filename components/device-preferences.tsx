'use client'

import { useEffect, useState } from 'react'
import { Check, SlidersHorizontal, X } from 'lucide-react'

type Density = 'comfortable' | 'compact'
type TextSize = 'default' | 'large'

export function DevicePreferences() {
  const [open, setOpen] = useState(false)
  const [density, setDensity] = useState<Density>('comfortable')
  const [textSize, setTextSize] = useState<TextSize>('default')
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const saved = window.localStorage.getItem('cloudminer-device-preferences')
    if (!saved) return
    try {
      const preferences = JSON.parse(saved) as Partial<{ density: Density; textSize: TextSize; reducedMotion: boolean }>
      if (preferences.density === 'compact' || preferences.density === 'comfortable') setDensity(preferences.density)
      if (preferences.textSize === 'large' || preferences.textSize === 'default') setTextSize(preferences.textSize)
      if (typeof preferences.reducedMotion === 'boolean') setReducedMotion(preferences.reducedMotion)
    } catch { /* Ignore malformed device preferences. */ }
  }, [])

  useEffect(() => {
    const preferences = { density, textSize, reducedMotion }
    document.documentElement.dataset.density = density
    document.documentElement.dataset.textSize = textSize
    document.documentElement.dataset.reducedMotion = String(reducedMotion)
    window.localStorage.setItem('cloudminer-device-preferences', JSON.stringify(preferences))
  }, [density, textSize, reducedMotion])

  return <>
    <button type="button" onClick={() => setOpen(true)} className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] text-slate-400 transition hover:border-cyan-300/30 hover:text-cyan-200 sm:flex" aria-label="Open device preferences"><SlidersHorizontal className="size-4" aria-hidden="true" /></button>
    {open && <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-3 backdrop-blur-sm sm:items-center" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false) }}><section role="dialog" aria-modal="true" aria-labelledby="device-preferences-title" className="w-full max-w-md rounded-3xl border border-white/10 bg-[#111722] p-5 shadow-2xl sm:p-6"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">Device profile</p><h2 id="device-preferences-title" className="mt-1 text-xl font-black text-white">Adapt CloudMiner</h2><p className="mt-2 text-sm leading-5 text-slate-400">These settings are saved for this device and make the interface easier to use on your phone or notebook.</p></div><button type="button" onClick={() => setOpen(false)} className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white" aria-label="Close device preferences"><X className="size-4" /></button></div><div className="mt-6 space-y-5"><PreferenceGroup label="Layout density"><div className="grid grid-cols-2 gap-2">{(['comfortable', 'compact'] as Density[]).map((value) => <Choice key={value} selected={density === value} onClick={() => setDensity(value)} label={value === 'comfortable' ? 'Comfortable' : 'Compact'} description={value === 'comfortable' ? 'More breathing room' : 'More data on screen'} />)}</div></PreferenceGroup><PreferenceGroup label="Text size"><div className="grid grid-cols-2 gap-2">{(['default', 'large'] as TextSize[]).map((value) => <Choice key={value} selected={textSize === value} onClick={() => setTextSize(value)} label={value === 'default' ? 'Default' : 'Large'} description={value === 'default' ? 'Standard labels' : 'Easier reading'} />)}</div></PreferenceGroup><label className="flex min-h-12 items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-3"><span><span className="block text-sm font-semibold text-white">Reduce motion</span><span className="block text-xs text-slate-500">For battery and accessibility</span></span><input type="checkbox" checked={reducedMotion} onChange={(event) => setReducedMotion(event.target.checked)} className="size-4 accent-cyan-300" /></label></div></section></div>}
  </>
}

function PreferenceGroup({ label, children }: { label: string; children: React.ReactNode }) { return <div><p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{label}</p>{children}</div> }
function Choice({ selected, onClick, label, description }: { selected: boolean; onClick: () => void; label: string; description: string }) { return <button type="button" onClick={onClick} className={`flex min-h-16 items-center justify-between gap-2 rounded-xl border px-3 text-left transition ${selected ? 'border-cyan-300/40 bg-cyan-300/10' : 'border-white/10 bg-white/[0.03] hover:border-white/20'}`}><span><span className="block text-sm font-semibold text-white">{label}</span><span className="block text-xs text-slate-500">{description}</span></span>{selected && <Check className="size-4 shrink-0 text-cyan-300" aria-hidden="true" />}</button> }
