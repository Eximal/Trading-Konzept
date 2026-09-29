'use client'

import { useModal } from 'connectkit'
import { TriangleAlert } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { MultiplierSection } from '@/components/multiplier-section'
import { ProtocolStats } from '@/components/protocol-stats'
import { RigStatusCard } from '@/components/rig-status-card'
import { useHashrate } from '@/hooks/use-hashrate'
import { useMiningCycle } from '@/hooks/use-mining-cycle'
import { useTokenBalances } from '@/hooks/use-token-balances'
import { BASE_HASHRATE, BASE_REWARD_PER_CYCLE, calcBoost, formatAmount } from '@/lib/mining'
import { isSupportedChain } from '@/lib/web3/chains'

export function MiningDashboard() {
  const { isConnected, chainId } = useAccount()
  const { setOpen } = useModal()
  const { balances, holdings, isLoading, isFetching, refetch, anyConfigured } = useTokenBalances()

  const boost = calcBoost(holdings)
  const rewardPerCycle = BASE_REWARD_PER_CYCLE * boost.multiplier

  const cycle = useMiningCycle(rewardPerCycle)
  const { hashrate, history } = useHashrate(cycle.status === 'mining', boost.multiplier)

  const [claimed, setClaimed] = useState<number | null>(null)
  useEffect(() => {
    if (claimed === null) return
    const id = window.setTimeout(() => setClaimed(null), 5000)
    return () => window.clearTimeout(id)
  }, [claimed])

  const accrued =
    cycle.status === 'claimable' ? rewardPerCycle : rewardPerCycle * cycle.progress

  return (
    <div className="space-y-6">
      {isConnected && !isSupportedChain(chainId) && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs text-foreground"
        >
          <TriangleAlert className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
          <p>
            This network is not supported by the protocol. Switch to Base, Monad or BNB Chain to
            read balances and run a rig.
          </p>
        </div>
      )}

      {claimed !== null && (
        <div
          role="status"
          className="rounded-xl border border-[#238636]/45 bg-[#238636]/10 p-3 text-xs text-[#3fb950]"
        >
          Claimed {formatAmount(claimed)} participation points. Rig reset and ready for a new cycle.
        </div>
      )}

      <RigStatusCard
        status={cycle.status}
        remainingMs={cycle.remainingMs}
        progress={cycle.progress}
        hashrate={hashrate}
        history={history}
        multiplier={boost.multiplier}
        estimatedReward={rewardPerCycle}
        accruedReward={accrued}
        pendingAction={cycle.pendingAction}
        isConnected={isConnected}
        hydrated={cycle.hydrated}
        onActivate={() => void cycle.activate()}
        onClaim={async () => {
          const amount = await cycle.claim()
          if (amount) setClaimed(amount)
        }}
        onConnect={() => setOpen(true)}
      />

      <MultiplierSection
        balances={balances}
        breakdown={boost.breakdown}
        totalPercent={boost.totalPercent}
        multiplier={boost.multiplier}
        capped={boost.capped}
        isConnected={isConnected}
        isLoading={isLoading}
        isFetching={isFetching}
        anyConfigured={anyConfigured}
        onRefresh={() => void refetch()}
      />

      <ProtocolStats
        cyclesCompleted={cycle.cyclesCompleted}
        totalClaimed={cycle.totalClaimed}
        effectiveHashrate={BASE_HASHRATE * boost.multiplier}
        chainId={chainId}
        isConnected={isConnected}
      />
    </div>
  )
}
