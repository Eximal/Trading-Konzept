'use client'

import { useModal } from 'connectkit'
import { TriangleAlert } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { formatUnits, parseUnits } from 'viem'
import { Button } from '@/components/ui/button'
import { SHM_TOKEN_ADDRESS, shmAbi } from '@/lib/web3/contracts'
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
  const [shmError, setShmError] = useState<string | null>(null)
  useEffect(() => {
    if (claimed === null) return
    const id = window.setTimeout(() => setClaimed(null), 5000)
    return () => window.clearTimeout(id)
  }, [claimed])

  const { address } = useAccount()
  const { data: shmBalance, refetch: refetchShm } = useReadContract({ address: SHM_TOKEN_ADDRESS, abi: shmAbi, functionName: 'balanceOf', args: address ? [address] : undefined, chainId: 8453, query: { enabled: Boolean(address) } })
  const { data: owner } = useReadContract({ address: SHM_TOKEN_ADDRESS, abi: shmAbi, functionName: 'owner', chainId: 8453 })
  const { writeContractAsync, data: mintHash, isPending: isMinting } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: mintConfirmed } = useWaitForTransactionReceipt({ hash: mintHash })
  useEffect(() => {
    if (mintConfirmed) void refetchShm()
  }, [mintConfirmed, refetchShm])
  const isBase = chainId === 8453
  const isOwner = Boolean(isBase && address && owner && address.toLowerCase() === owner.toLowerCase())
  const accrued = cycle.status === 'claimable' ? rewardPerCycle : rewardPerCycle * cycle.progress

  async function claimShm() {
    if (!address || !isOwner || accrued <= 0) return
    setShmError(null)
    try {
      await writeContractAsync({ address: SHM_TOKEN_ADDRESS, abi: shmAbi, functionName: 'mintTo', args: [address, parseUnits(accrued.toFixed(6), 18)], chainId: 8453 })
    } catch (error) {
      setShmError(error instanceof Error ? error.message.slice(0, 180) : 'The SHM mint transaction could not be submitted.')
    }
  }

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

      <section className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.045] p-4" aria-labelledby="shm-onchain-title"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p id="shm-onchain-title" className="text-xs font-bold uppercase tracking-[0.18em] text-amber-200">SHM on Base</p><p className="mt-1 text-sm text-slate-300">On-chain balance: <strong className="font-mono text-white">{shmBalance !== undefined ? formatUnits(shmBalance, 18) : '—'} SHM</strong></p><p className="mt-1 text-[11px] text-slate-500">{!isBase ? 'Switch your wallet to Base Mainnet to read SHM and claim.' : isOwner ? 'Owner mintTo enabled for this wallet.' : 'Only the token owner can call mintTo. A public user claim needs a relayer or contract claim function.'}</p></div><Button type="button" onClick={() => void claimShm()} disabled={!isOwner || isMinting || isConfirming || !address} className="min-h-11 shrink-0 rounded-xl bg-amber-300 font-bold text-slate-950 hover:bg-amber-200">{isMinting ? 'Confirm in wallet…' : isConfirming ? 'Confirming…' : mintConfirmed ? 'SHM minted' : 'Claim SHM'}</Button></div>{shmError && <p role="alert" className="mt-3 rounded-lg border border-red-300/20 bg-red-300/[0.06] px-3 py-2 text-[11px] text-red-200">{shmError}</p>}{mintHash && <a className="mt-3 block truncate text-[11px] text-cyan-200 underline" href={`https://basescan.org/tx/${mintHash}`} target="_blank" rel="noreferrer">View transaction on BaseScan</a>}</section>

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
