'use client'

import { Cpu, LoaderCircle, Power, Sparkles } from 'lucide-react'
import { CountdownTimer } from '@/components/countdown-timer'
import { HashrateMeter } from '@/components/hashrate-meter'
import { cn } from '@/lib/utils'
import { formatAmount } from '@/lib/mining'
import type { RigStatus } from '@/hooks/use-mining-cycle'

const STATUS_COPY: Record<RigStatus, { label: string; detail: string; tone: string }> = {
  idle: {
    label: 'Rig idle',
    detail: 'Activate the rig to start a 24 hour mining cycle.',
    tone: 'bg-secondary text-muted-foreground ring-border',
  },
  mining: {
    label: 'Mining active',
    detail: 'Hashing in progress. Rewards accrue every second.',
    tone: 'bg-[#238636]/15 text-[#3fb950] ring-[#238636]/40',
  },
  claimable: {
    label: 'Cycle complete',
    detail: 'Your cycle finished. Claim rewards to restart the rig.',
    tone: 'bg-[#58a6ff]/15 text-[#58a6ff] ring-[#58a6ff]/40',
  },
}

export function RigStatusCard({
  status,
  remainingMs,
  progress,
  hashrate,
  history,
  multiplier,
  estimatedReward,
  accruedReward,
  pendingAction,
  isConnected,
  hydrated,
  onActivate,
  onClaim,
  onConnect,
}: {
  status: RigStatus
  remainingMs: number
  progress: number
  hashrate: number
  history: number[]
  multiplier: number
  estimatedReward: number
  accruedReward: number
  pendingAction: 'activate' | 'claim' | null
  isConnected: boolean
  hydrated: boolean
  onActivate: () => void
  onClaim: () => void
  onConnect: () => void
}) {
  const active = status === 'mining'
  const copy = STATUS_COPY[status]
  const busy = pendingAction !== null

  return (
    <section
      id="rig"
      aria-labelledby="rig-heading"
      className={cn(
        'relative overflow-hidden rounded-2xl border bg-card p-4 sm:p-5',
        active ? 'border-[#238636]/50' : 'border-border',
      )}
    >
      {active && (
        <div
          aria-hidden="true"
          className="rig-glow pointer-events-none absolute -top-24 left-1/2 size-64 -translate-x-1/2 rounded-full bg-[#238636]/25 blur-3xl"
        />
      )}

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <h2 id="rig-heading" className="text-base font-semibold text-[#f0f6fc]">
            Mining rig status
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">{copy.detail}</p>
        </div>
        <span
          className={cn(
            'shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset',
            copy.tone,
          )}
        >
          {copy.label}
        </span>
      </div>

      {/* Rig visualization */}
      <div className="relative mt-4 overflow-hidden rounded-xl border border-border bg-[#0d1117] p-4">
        {active && (
          <div
            aria-hidden="true"
            className="rig-scan pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-transparent via-[#58a6ff]/12 to-transparent"
          />
        )}
        <div className="relative flex items-center justify-center gap-2 sm:gap-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: static rig slots
              key={index}
              className={cn(
                'flex h-20 flex-1 flex-col items-center justify-center gap-2 rounded-lg border transition-colors sm:h-24',
                active
                  ? 'border-[#238636]/45 bg-[#238636]/10'
                  : 'border-border bg-secondary/40',
              )}
              style={active ? { animationDelay: `${index * 0.18}s` } : undefined}
            >
              <Cpu
                className={cn(
                  'size-5 sm:size-6',
                  active ? 'rig-flicker text-[#3fb950]' : 'text-muted-foreground',
                )}
                style={active ? { animationDelay: `${index * 0.18}s` } : undefined}
                aria-hidden="true"
              />
              <span
                className={cn(
                  'h-1 w-6 rounded-full',
                  active ? 'rig-flicker bg-[#58a6ff]' : 'bg-border',
                )}
                style={active ? { animationDelay: `${index * 0.24}s` } : undefined}
                aria-hidden="true"
              />
            </div>
          ))}
        </div>
        <p className="sr-only">
          {active ? 'Six mining cores online' : 'Mining cores offline'}
        </p>
      </div>

      {/* Countdown */}
      <div className="mt-4">
        <CountdownTimer remainingMs={status === 'idle' ? 0 : remainingMs} active={active} />
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-[#238636] transition-[width] duration-1000 ease-linear"
            style={{ width: `${Math.min(100, progress * 100)}%` }}
            role="progressbar"
            aria-valuenow={Math.round(progress * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Mining cycle progress"
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <HashrateMeter hashrate={hashrate} history={history} active={active} />
        <div className="flex flex-col justify-between rounded-xl border border-border bg-[#0d1117] p-3">
          <span className="flex items-center gap-1.5 text-[11px] tracking-widest text-muted-foreground uppercase">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Cycle yield
          </span>
          <p className="tabular mt-2 font-mono text-lg font-semibold text-[#f0f6fc]">
            {formatAmount(status === 'idle' ? estimatedReward : accruedReward)}
            <span className="ml-1 text-xs font-normal text-muted-foreground">JKU</span>
          </p>
          <p className="text-[11px] text-muted-foreground">
            {status === 'idle' ? 'Projected at' : 'Accrued at'} {multiplier.toFixed(2)}x
          </p>
        </div>
      </div>

      {/* Primary action */}
      <div className="mt-4">
        {!isConnected ? (
          <button
            type="button"
            onClick={onConnect}
            className="h-12 w-full rounded-xl bg-[#58a6ff] text-sm font-semibold text-[#0d1117] transition-colors hover:bg-[#79c0ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#58a6ff]"
          >
            Connect wallet to mine
          </button>
        ) : status === 'claimable' ? (
          <button
            type="button"
            onClick={onClaim}
            disabled={busy}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#58a6ff] text-sm font-semibold text-[#0d1117] transition-colors hover:bg-[#79c0ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#58a6ff] disabled:opacity-60"
          >
            {pendingAction === 'claim' ? (
              <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Sparkles className="size-4" aria-hidden="true" />
            )}
            Claim {formatAmount(accruedReward)} JKU
          </button>
        ) : (
          <button
            type="button"
            onClick={onActivate}
            disabled={active || busy || !hydrated}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#238636] text-sm font-semibold text-[#f0f6fc] transition-colors hover:bg-[#2ea043] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#58a6ff] disabled:cursor-not-allowed disabled:bg-secondary disabled:text-muted-foreground disabled:opacity-100"
          >
            {pendingAction === 'activate' ? (
              <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Power className="size-4" aria-hidden="true" />
            )}
            {active ? 'Rig running' : 'Activate rig'}
          </button>
        )}
      </div>
    </section>
  )
}
