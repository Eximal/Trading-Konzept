'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, SlidersHorizontal, X } from 'lucide-react'
import { localeOptions, type AppLocale, detectLocale } from '@/lib/i18n'

type Density = 'comfortable' | 'compact'
type TextSize = 'default' | 'large'
type Preferences = { density: Density; textSize: TextSize; reducedMotion: boolean; locale: AppLocale }
const STORAGE_KEY = 'cloudminer-device-preferences'
const defaults: Preferences = { density: 'comfortable', textSize: 'default', reducedMotion: false, locale: 'en' }

export function DevicePreferences() {
  const [open, setOpen] = useState(false)
  const [preferences, setPreferences] = useState(defaults)
  const [ready, setReady] = useState(false)
  const { density, textSize, reducedMotion, locale } = preferences

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const value = JSON.parse(saved) as Partial<Preferences>
        setPreferences({
          density: value.density === 'compact' ? 'compact' : defaults.density,
          textSize: value.textSize === 'large' ? 'large' : defaults.textSize,
          reducedMotion: value.reducedMotion === true,
          locale: value.locale ? detectLocale(value.locale) : detectLocale(navigator.language),
        })
      } else {
        setPreferences((current) => ({ ...current, locale: detectLocale(navigator.language) }))
      }
    } catch {
      setPreferences((current) => ({ ...current, locale: detectLocale(navigator.language) }))
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    document.documentElement.dataset.density = density
    document.documentElement.dataset.textSize = textSize
    document.documentElement.dataset.reducedMotion = String(reducedMotion)
    document.documentElement.lang = locale
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
    } catch {
      // Preferences remain active for the current session when storage is unavailable.
    }
    window.dispatchEvent(new CustomEvent('cloudminer:locale-change', { detail: locale }))
  }, [density, textSize, reducedMotion, locale, preferences, ready])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  const update = <Key extends keyof Preferences>(key: Key, value: Preferences[Key]) => {
    setPreferences((current) => ({ ...current, [key]: value }))
  }

  return <>
    <button type="button" onClick={() => setOpen(true)} className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] text-slate-400 transition hover:border-cyan-300/30 hover:text-cyan-200" aria-label="Open device preferences"><SlidersHorizontal className="size-4" aria-hidden="true" /></button>
    {open && typeof document !== 'undefined' && createPortal(<div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-sm sm:items-center sm:p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false) }}><section role="dialog" aria-modal="true" aria-labelledby="device-preferences-title" className="max-h-[min(90dvh,42rem)] w-full max-w-md overflow-y-auto overscroll-contain rounded-3xl border border-white/10 bg-[#111722] p-5 shadow-2xl sm:p-6"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">Device profile</p><h2 id="device-preferences-title" className="mt-1 text-xl font-black text-white">Adapt CloudMiner</h2><p className="mt-2 text-sm leading-5 text-slate-400">Choose a language and adjust readability for this device.</p></div><button type="button" onClick={() => setOpen(false)} className="flex size-11 shrink-0 items-center justify-center rounded-xl text-slate-400 hover:bg-white/5 hover:text-white" aria-label="Close device preferences"><X className="size-4" /></button></div><div className="mt-6 space-y-5"><label className="block"><span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Interface language</span><select value={locale} onChange={(event) => update('locale', event.target.value as AppLocale)} className="h-12 w-full rounded-xl border border-white/10 bg-[#0b0f17] px-3 text-base text-white outline-none focus:border-cyan-300/50">{localeOptions.map((option) => <option key={option.value} value={option.value}>{option.nativeLabel} · {option.label}</option>)}</select></label><PreferenceGroup label="Layout density"><div className="grid grid-cols-2 gap-2">{(['comfortable', 'compact'] as Density[]).map((value) => <Choice key={value} selected={density === value} onClick={() => update('density', value)} label={value === 'comfortable' ? 'Comfortable' : 'Compact'} description={value === 'comfortable' ? 'More breathing room' : 'More data on screen'} />)}</div></PreferenceGroup><PreferenceGroup label="Text size"><div className="grid grid-cols-2 gap-2">{(['default', 'large'] as TextSize[]).map((value) => <Choice key={value} selected={textSize === value} onClick={() => update('textSize', value)} label={value === 'default' ? 'Default' : 'Large'} description={value === 'default' ? 'Standard labels' : 'Easier reading'} />)}</div></PreferenceGroup><label className="flex min-h-12 items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-3"><span><span className="block text-sm font-semibold text-white">Reduce motion</span><span className="text-xs text-slate-500">Limit decorative animation</span></span><input type="checkbox" checked={reducedMotion} onChange={(event) => update('reducedMotion', event.target.checked)} className="size-5 accent-cyan-300" /></label></div></section></div>, document.body)}
  </>
}

function PreferenceGroup({ label, children }: { label: string; children: React.ReactNode }) { return <div><p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{label}</p>{children}</div> }
function Choice({ selected, onClick, label, description }: { selected: boolean; onClick: () => void; label: string; description: string }) { return <button type="button" onClick={onClick} aria-pressed={selected} className={`flex min-h-16 items-center justify-between gap-2 rounded-xl border px-3 text-left transition ${selected ? 'border-cyan-300/40 bg-cyan-300/10' : 'border-white/10 bg-white/[0.03] hover:border-white/20'}`}><span><span className="block text-sm font-semibold text-white">{label}</span><span className="block text-xs text-slate-500">{description}</span></span>{selected && <Check className="size-4 shrink-0 text-cyan-300" aria-hidden="true" />}</button> }
