'use client'

import { Activity } from 'lucide-react'
import { formatHashrate } from '@/lib/mining'

export function HashrateMeter({
  hashrate,
  history,
  active,
}: {
  hashrate: number
  history: number[]
  active: boolean
}) {
  const peak = Math.max(...history, 1)

  return (
    <div className="rounded-xl border border-border bg-[#0d1117] p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-[11px] tracking-widest text-muted-foreground uppercase">
          <Activity className="size-3.5" aria-hidden="true" />
          Live hashrate
        </span>
        <span
          className={`tabular font-mono text-sm font-semibold ${
            active ? 'text-[#58a6ff]' : 'text-muted-foreground'
          }`}
          aria-live="off"
        >
          {active ? formatHashrate(hashrate) : '0.00 MH/s'}
        </span>
      </div>

      <div className="mt-3 flex h-12 items-end gap-[3px]" aria-hidden="true">
        {history.map((value, index) => {
          const height = active ? Math.max(6, (value / peak) * 100) : 4
          return (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length rolling window
              key={index}
              className={`flex-1 rounded-sm transition-[height] duration-500 ${
                active ? 'bg-[#58a6ff]/70' : 'bg-secondary'
              }`}
              style={{ height: `${height}%` }}
            />
          )
        })}
      </div>
    </div>
  )
}
