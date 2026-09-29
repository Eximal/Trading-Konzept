'use client'

import { formatAmount, formatHashrate } from '@/lib/mining'
import { getChainMeta } from '@/lib/web3/chains'

export function ProtocolStats({
  cyclesCompleted,
  totalClaimed,
  effectiveHashrate,
  chainId,
  isConnected = false,
}: {
  cyclesCompleted: number
  totalClaimed: number
  effectiveHashrate: number
  chainId?: number
  isConnected?: boolean
}) {
  const stats = [
    { label: 'Cycles mined', value: formatAmount(cyclesCompleted, 0) },
    { label: 'Points earned', value: formatAmount(totalClaimed) },
    { label: 'Effective rate', value: formatHashrate(effectiveHashrate) },
    {
      label: 'Network',
      value: isConnected ? getChainMeta(chainId).label : 'Not connected',
    },
  ]

  return (
    <section id="stats" aria-labelledby="stats-heading" className="space-y-3">
      <h2 id="stats-heading" className="text-base font-semibold text-[#f0f6fc]">
        Rig statistics
      </h2>
      <dl className="grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-card p-4">
            <dt className="text-[11px] tracking-widest text-muted-foreground uppercase">
              {stat.label}
            </dt>
            <dd className="tabular mt-1.5 font-mono text-lg font-semibold text-[#f0f6fc]">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
