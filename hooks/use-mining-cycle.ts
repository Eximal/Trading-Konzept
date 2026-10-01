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
const STORAGE_PREFIX = 'jku:rig:'

function storageKey(address?: string, chainId?: number) {
  return `${STORAGE_PREFIX}${chainId ?? 'nochain'}:${address?.toLowerCase() ?? 'guest'}`
}

function readRecord(key: string): CycleRecord {
  if (typeof window === 'undefined') return EMPTY
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return EMPTY
    const parsed = JSON.parse(raw) as Partial<CycleRecord>
    return {
      startedAt: typeof parsed.startedAt === 'number' ? parsed.startedAt : null,
      cyclesCompleted: parsed.cyclesCompleted ?? 0,
      totalClaimed: parsed.totalClaimed ?? 0,
    }
  } catch {
    return EMPTY
  }
}

function writeRecord(key: string, record: CycleRecord) {
  try {
    window.localStorage.setItem(key, JSON.stringify(record))
  } catch {
    /* storage unavailable (private mode) — cycle still runs in memory */
  }
}

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
 * Drives the 24h mining cycle. Persisted per wallet + chain in localStorage so a
 * refresh, tab close, or PWA relaunch resumes the exact same countdown.
 *
 * `activate` / `claim` are async so they can be swapped for wagmi
 * `writeContract` calls once the mining contract is deployed.
 */
export function useMiningCycle(rewardPerCycle: number) {
  const { address, chainId } = useAccount()
  const key = storageKey(address, chainId)

  const [hydrated, setHydrated] = useState(false)
  const [record, setRecord] = useState<CycleRecord>(EMPTY)
  const [now, setNow] = useState(() => Date.now())
  const [pending, setPending] = useState<null | 'activate' | 'claim'>(null)
  // Load persisted state on mount / wallet switch (client-only to avoid SSR mismatch).
  useEffect(() => {
    let cancelled = false
    const localRecord = readRecord(key)
    setRecord(localRecord)
    setNow(Date.now())
    setHydrated(true)
    void syncParticipation(address, chainId, 'sync', localRecord.startedAt ?? undefined).then((remote) => {
      if (cancelled || !remote?.activeCycle?.startedAt) return
      const remoteStartedAt = new Date(remote.activeCycle.startedAt).getTime()
      if (!Number.isFinite(remoteStartedAt)) return
      const synced = { ...localRecord, startedAt: remoteStartedAt }
      setRecord(synced)
      writeRecord(key, synced)
      setNow(Date.now())
    })
    return () => {
      cancelled = true
    }
  }, [address, chainId, key])

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

  const persist = useCallback(
    (next: CycleRecord) => {
      setRecord(next)
      writeRecord(key, next)
    },
    [key],
  )

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
