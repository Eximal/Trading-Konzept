'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAccount } from 'wagmi'
import { CYCLE_DURATION_MS } from '@/lib/mining'

export type RigStatus = 'idle' | 'mining' | 'claimable'

type CycleRecord = {
  startedAt: number | null
  cyclesCompleted: number
  totalClaimed: number
}

const EMPTY: CycleRecord = { startedAt: null, cyclesCompleted: 0, totalClaimed: 0 }

type ParticipationResponse = {
  activeCycle?: { startedAt?: string | number | Date } | null
  profile?: { cyclesCompleted?: number; points?: string | number } | null
}

async function syncParticipation(
  address: string | undefined,
  chainId: number | undefined,
  action: 'sync' | 'activate' | 'claim',
  startedAt?: number,
): Promise<ParticipationResponse | null> {
  if (!address || !chainId) return null
  try {
    const response = await fetch('/api/participation', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ walletAddress: address, chainId, action, startedAt }),
      keepalive: true,
    })
    if (!response.ok) return null
    return (await response.json()) as ParticipationResponse
  } catch {
    // The local cache remains the offline source of truth until the next sync.
    return null
  }
}

/**
 * Drives the 24h mining cycle. The connected wallet and server participation API
 * are the source of truth; the in-memory state only renders the current session.
 *
 * `activate` / `claim` are async so they can be swapped for wagmi
 * `writeContract` calls once the mining contract is deployed.
 */
export function useMiningCycle(rewardPerCycle: number) {
  const { address, chainId } = useAccount()
  const [hydrated, setHydrated] = useState(false)
  const [record, setRecord] = useState<CycleRecord>(EMPTY)
  const [now, setNow] = useState(() => Date.now())
  const [pending, setPending] = useState<null | 'activate' | 'claim'>(null)
  // Load persisted state on mount / wallet switch (client-only to avoid SSR mismatch).
  useEffect(() => {
    let cancelled = false
    setRecord(EMPTY)
    setNow(Date.now())
    setHydrated(true)
    void syncParticipation(address, chainId, 'sync').then((remote) => {
      if (cancelled) return
      const remoteStartedAt = remote?.activeCycle?.startedAt ? new Date(remote.activeCycle.startedAt).getTime() : null
      const synced: CycleRecord = { startedAt: Number.isFinite(remoteStartedAt) ? remoteStartedAt : null, cyclesCompleted: remote?.profile?.cyclesCompleted ?? 0, totalClaimed: Number(remote?.profile?.points ?? 0) }
      setRecord(synced)
      setNow(Date.now())
    })
    return () => {
      cancelled = true
    }
  }, [address, chainId])

  // Single 1s ticker drives both the countdown and the live hashrate.
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const endsAt = record.startedAt ? record.startedAt + CYCLE_DURATION_MS : null
  const remainingMs = endsAt ? Math.max(0, endsAt - now) : 0
  const elapsedMs = record.startedAt ? Math.min(CYCLE_DURATION_MS, now - record.startedAt) : 0

  const status: RigStatus = useMemo(() => {
    if (!record.startedAt) return 'idle'
    return remainingMs > 0 ? 'mining' : 'claimable'
  }, [record.startedAt, remainingMs])

  const progress = record.startedAt ? elapsedMs / CYCLE_DURATION_MS : 0

  const persist = useCallback((next: CycleRecord) => {
    setRecord(next)
  }, [])

  const activate = useCallback(async () => {
    if (status !== 'idle') return
    setPending('activate')
    try {
      const startedAt = Date.now()
      persist({ ...record, startedAt })
      const remote = await syncParticipation(address, chainId, 'activate', startedAt)
      const authoritativeStart = remote?.activeCycle?.startedAt
        ? new Date(remote.activeCycle.startedAt).getTime()
        : startedAt
      if (Number.isFinite(authoritativeStart) && authoritativeStart !== startedAt) {
        persist({ ...record, startedAt: authoritativeStart })
      }
    } finally {
      setPending(null)
    }
  }, [address, chainId, persist, record, status])

  const claim = useCallback(async () => {
    if (status !== 'claimable') return 0
    setPending('claim')
    try {
      const claimed = rewardPerCycle
      persist({
        startedAt: null,
        cyclesCompleted: record.cyclesCompleted + 1,
        totalClaimed: record.totalClaimed + claimed,
      })
      void syncParticipation(address, chainId, 'claim')
      return claimed
    } finally {
      setPending(null)
    }
  }, [address, chainId, persist, record, rewardPerCycle, status])

  const reset = useCallback(() => persist(EMPTY), [persist])

  return {
    hydrated,
    status,
    now,
    startedAt: record.startedAt,
    endsAt,
    remainingMs,
    elapsedMs,
    progress,
    cyclesCompleted: record.cyclesCompleted,
    totalClaimed: record.totalClaimed,
    pendingAction: pending,
    activate,
    claim,
    reset,
  }
}
