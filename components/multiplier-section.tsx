'use client'

import { Coins, Gem, Layers, RefreshCw } from 'lucide-react'
import type { AssetBalance } from '@/hooks/use-token-balances'
import { formatAmount, MAX_BOOST_PERCENT, nextTier } from '@/lib/mining'
import { cn } from '@/lib/utils'

const ASSET_META = {
  jku: { title: '$JKU', subtitle: 'Protocol token', Icon: Coins },
  ent: { title: '$ENT', subtitle: 'Partner token', Icon: Layers },
  nft: { title: 'Rig NFT', subtitle: 'Hardware pass', Icon: Gem },
} as const

export function MultiplierSection({
  balances,
  breakdown,
  totalPercent,
  multiplier,
  capped,
  isConnected,
  isLoading,
  isFetching,
  anyConfigured,
  onRefresh,
}: {
  balances: Record<'jku' | 'ent' | 'nft', AssetBalance>
  breakdown: Record<'jku' | 'ent' | 'nft', number>
  totalPercent: number
  multiplier: number
  capped: boolean
  isConnected: boolean
  isLoading: boolean
  isFetching: boolean
  anyConfigured: boolean
  onRefresh: () => void
}) {
  const keys = ['jku', 'ent', 'nft'] as const

  return (
    <section id="boost" aria-labelledby="boost-heading" className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 id="boost-heading" className="text-base font-semibold text-[#f0f6fc]">
            Hashrate multiplier
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Holdings on the active chain boost your rig output.
          </p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={!isConnected || isFetching}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 text-xs text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
        >
          <RefreshCw className={cn('size-3.5', isFetching && 'animate-spin')} aria-hidden="true" />
          Refresh
        </button>
      </div>

      <div className="rounded-2xl border border-[#58a6ff]/35 bg-card p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] tracking-widest text-muted-foreground uppercase">
              Total boost
            </p>
            <p className="tabular mt-1 font-mono text-3xl font-semibold text-[#58a6ff]">
              {multiplier.toFixed(2)}x
            </p>
          </div>
          <div className="text-right">
            <p className="tabular text-sm font-semibold text-foreground">+{totalPercent}%</p>
            <p className="text-[11px] text-muted-foreground">
              {capped ? `Capped at +${MAX_BOOST_PERCENT}%` : `Max +${MAX_BOOST_PERCENT}%`}
            </p>
          </div>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-[#58a6ff]"
            style={{ width: `${Math.min(100, (totalPercent / MAX_BOOST_PERCENT) * 100)}%` }}
            role="progressbar"
            aria-valuenow={totalPercent}
            aria-valuemin={0}
            aria-valuemax={MAX_BOOST_PERCENT}
            aria-label="Total hashrate boost"
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {keys.map((key) => {
          const asset = balances[key]
          const { title, subtitle, Icon } = ASSET_META[key]
          const boost = breakdown[key]
          const upcoming = nextTier(key, asset.amount)

          return (
            <article
              key={key}
              className={cn(
                'rounded-2xl border bg-card p-4',
                boost > 0 ? 'border-[#238636]/40' : 'border-border',
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      'flex size-8 items-center justify-center rounded-lg ring-1 ring-inset',
                      boost > 0
                        ? 'bg-[#238636]/12 text-[#3fb950] ring-[#238636]/35'
                        : 'bg-secondary text-muted-foreground ring-border',
                    )}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="leading-tight">
                    <span className="block text-sm font-semibold text-foreground">{title}</span>
                    <span className="block text-[11px] text-muted-foreground">{subtitle}</span>
                  </span>
                </span>
                <span
                  className={cn(
                    'tabular rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset',
                    boost > 0
                      ? 'bg-[#238636]/12 text-[#3fb950] ring-[#238636]/35'
                      : 'bg-secondary text-muted-foreground ring-border',
                  )}
                >
                  +{boost}%
                </span>
              </div>

              <p className="tabular mt-3 font-mono text-xl font-semibold text-[#f0f6fc]">
                {!isConnected
                  ? '—'
                  : isLoading
                    ? '···'
                    : formatAmount(asset.amount, key === 'nft' ? 0 : 2)}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {!asset.configured
                  ? 'Not deployed on this chain'
                  : !isConnected
                    ? 'Connect to read balance'
                    : upcoming
                      ? `${formatAmount(upcoming.min - asset.amount, 0)} more for +${upcoming.boost}%`
                      : 'Top tier reached'}
              </p>
            </article>
          )
        })}
      </div>

      {!anyConfigured && (
        <p className="rounded-xl border border-dashed border-border bg-card/60 p-3 text-xs text-muted-foreground">
          No token addresses configured for this chain. Set{' '}
          <code className="font-mono text-[#58a6ff]">NEXT_PUBLIC_JKU_TOKEN_*</code>,{' '}
          <code className="font-mono text-[#58a6ff]">NEXT_PUBLIC_ENT_TOKEN_*</code> and{' '}
          <code className="font-mono text-[#58a6ff]">NEXT_PUBLIC_JKU_NFT_*</code> to enable live
          multiplier reads.
        </p>
      )}
    </section>
  )
}
