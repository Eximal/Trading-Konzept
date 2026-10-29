'use client'

import { useState } from 'react'
import { BookOpen, CheckCircle2, ChevronRight, CircleHelp, GraduationCap, Layers3, PlayCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

type StudentLabViewProps = { isMining: boolean; setActiveView: (view: string) => void }

const lessons = [
  { title: 'What is a blockchain?', detail: 'A shared, ordered record of transactions and events.', done: true },
  { title: 'Proof of participation', detail: 'How activity can be measured without promising financial returns.', done: true },
  { title: 'Mining vs. validation', detail: 'Why this app simulates participation rather than securing Base.', done: false },
]

export function StudentLabView({ isMining, setActiveView }: StudentLabViewProps) {
  const [selected, setSelected] = useState(2)
  const lesson = lessons[selected]
  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-5">
      <div className="rounded-3xl border border-emerald-300/15 bg-emerald-300/[0.04] p-5 sm:p-7"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">Student lab</p><h2 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">Learn the chain before you scale</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">A guided, low-pressure introduction to wallets, blocks, participation and responsible Web3 experimentation.</p></div><GraduationCap className="size-7 shrink-0 text-emerald-300" /></div><div className="mt-6 flex items-center gap-3"><div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10"><div className="h-full w-2/3 rounded-full bg-emerald-300" /></div><span className="text-xs font-semibold text-emerald-200">2 / 3 complete</span></div></div>
      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="flex flex-col gap-2 rounded-3xl border border-white/[0.08] bg-white/[0.035] p-4 sm:p-5">{lessons.map((item, index) => <button key={item.title} type="button" onClick={() => setSelected(index)} className={`flex min-h-16 items-center gap-3 rounded-2xl p-3 text-left transition ${selected === index ? 'bg-emerald-300/10 text-white' : 'text-slate-400 hover:bg-white/[0.04]'}`}><span className={`flex size-8 shrink-0 items-center justify-center rounded-full ${item.done ? 'bg-emerald-300/15 text-emerald-300' : 'bg-white/10 text-slate-400'}`}>{item.done ? <CheckCircle2 className="size-4" /> : <span className="text-xs font-bold">{index + 1}</span>}</span><span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{item.title}</span><span className="mt-1 block text-xs text-slate-500">{item.done ? 'Completed' : 'Next lesson'}</span></span><ChevronRight className="size-4 shrink-0" /></button>)}</div>
        <div className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-5 sm:p-7"><div className="flex items-center gap-2 text-emerald-300"><BookOpen className="size-4" /><span className="text-xs font-semibold uppercase tracking-[0.2em]">Lesson {selected + 1}</span></div><h3 className="mt-4 text-xl font-bold text-white">{lesson.title}</h3><p className="mt-3 text-sm leading-7 text-slate-400">{lesson.detail} In this app, mining is a participation experience: it does not replace Base validators, does not guarantee rewards, and should never require a deposit.</p><div className="mt-6 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.04] p-4"><Layers3 className="size-4 text-cyan-300" /><p className="mt-3 text-xs font-semibold text-white">Key idea</p><p className="mt-1 text-xs leading-5 text-slate-500">Blocks group verified events into a shared history.</p></div><div className="rounded-2xl border border-violet-300/15 bg-violet-300/[0.04] p-4"><CircleHelp className="size-4 text-violet-300" /><p className="mt-3 text-xs font-semibold text-white">Safety check</p><p className="mt-1 text-xs leading-5 text-slate-500">Never share seed phrases or sign unknown transactions.</p></div></div><div className="mt-6 flex flex-col gap-3 sm:flex-row"><Button onClick={() => setActiveView('Dashboard')} className="h-11 flex-1 rounded-xl bg-emerald-300 font-bold text-slate-950 hover:bg-emerald-200"><PlayCircle data-icon="inline-start" />{isMining ? 'Return to active rig' : 'Open mining dashboard'}</Button></div></div>
      </div>
    </section>
  )
}
