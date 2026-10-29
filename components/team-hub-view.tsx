'use client'

import { useState } from 'react'
import { Copy, Gauge, ShieldCheck, Users, WalletCards } from 'lucide-react'
import { Button } from '@/components/ui/button'

type TeamHubViewProps = {
  address?: string
  isConnected: boolean
  totalHashrate: number
  isMining: boolean
}

const members = [
  { name: 'You', role: 'Captain', points: '12,480', status: 'Online' },
  { name: 'Student A', role: 'Miner', points: '8,920', status: 'Online' },
  { name: 'Student B', role: 'Learner', points: '5,640', status: 'Learning' },
]

export function TeamHubView({ address, isConnected, totalHashrate, isMining }: TeamHubViewProps) {
  const [copied, setCopied] = useState(false)
  const invite = typeof window === 'undefined' ? 'cloudminer.app/team' : `${window.location.origin}?team=cloud-pioneers`

  async function copyInvite() {
    try {
      await navigator.clipboard.writeText(invite)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-5">
      <div className="flex flex-col gap-4 rounded-3xl border border-cyan-300/15 bg-cyan-300/[0.04] p-5 sm:flex-row sm:items-end sm:justify-between sm:p-7">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Team workspace</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">Cloud Pioneers</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">Coordinate a small mining crew, learn the network together, and keep every contribution visible.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400"><span className="size-2 rounded-full bg-emerald-400" />{isMining ? 'Team session active' : 'Team standing by'}</div>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        <Metric icon={Users} label="Members" value="3 / 8" />
        <Metric icon={Gauge} label="Team hashrate" value={`${(totalHashrate * 3).toFixed(1)} MH/s`} />
        <Metric icon={ShieldCheck} label="Verified points" value="27,040 CMR" />
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-5 sm:p-7">
          <div className="mb-5 flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Crew roster</p><h3 className="mt-2 text-lg font-bold text-white">Active contributors</h3></div><Users className="size-5 text-cyan-300" /></div>
          <div className="flex flex-col gap-2">{members.map((member) => <div key={member.name} className="flex items-center justify-between gap-3 rounded-2xl border border-white/[0.06] bg-black/10 p-3"><div className="flex min-w-0 items-center gap-3"><div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-cyan-300/10 text-xs font-bold text-cyan-200">{member.name.split(' ').map((part) => part[0]).join('')}</div><div className="min-w-0"><p className="truncate text-sm font-semibold text-white">{member.name}</p><p className="text-xs text-slate-500">{member.role} · {member.status}</p></div></div><p className="shrink-0 font-mono text-xs text-cyan-200">{member.points}</p></div>)}</div>
        </div>
        <div className="rounded-3xl border border-violet-300/15 bg-violet-300/[0.04] p-5 sm:p-7"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-200">Invite your crew</p><h3 className="mt-2 text-lg font-bold text-white">Build together</h3><p className="mt-2 text-sm leading-6 text-slate-400">Share a read-only invite link. Wallet connection is still required for verified participation.</p><div className="mt-5 flex min-w-0 items-center gap-2 rounded-xl border border-white/[0.08] bg-black/15 p-2"><WalletCards className="ml-1 size-4 shrink-0 text-violet-200" /><span className="min-w-0 flex-1 truncate font-mono text-xs text-slate-400">{invite}</span><Button size="sm" onClick={copyInvite} className="shrink-0 rounded-lg bg-violet-300 text-slate-950 hover:bg-violet-200"><Copy data-icon="inline-start" />{copied ? 'Copied' : 'Copy'}</Button></div><p className="mt-4 text-xs text-slate-500">{isConnected ? `Connected wallet: ${address?.slice(0, 6)}…${address?.slice(-4)}` : 'Connect a wallet to verify your contribution.'}</p></div>
      </div>
      <div className="rounded-2xl border border-amber-300/15 bg-amber-300/[0.04] p-4 text-sm leading-6 text-amber-100/80"><span className="font-semibold text-amber-200">Team safety:</span> points shown here are participation metrics, not guaranteed financial returns. Automated or self-referral activity is excluded.</div>
    </section>
  )
}

function Metric({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string }) {
  return <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4"><Icon className="size-4 text-cyan-300" /><p className="mt-4 text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p><p className="mt-1 text-xl font-black text-white">{value}</p></div>
}
