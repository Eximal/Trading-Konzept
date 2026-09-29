import { and, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { participationCycles, participationEvents, participationProfiles } from '@/lib/db/schema'

const ADDRESS = /^0x[a-fA-F0-9]{40}$/
const MAX_CYCLE_MS = 24 * 60 * 60 * 1000
const POINTS_PER_CYCLE = 100

type Payload = { walletAddress?: string; chainId?: number; action?: 'sync' | 'activate' | 'claim'; startedAt?: number }

function validate(payload: Payload) {
  const walletAddress = payload.walletAddress?.toLowerCase()
  if (!walletAddress || !ADDRESS.test(walletAddress)) throw new Error('Invalid wallet address')
  const chainId = Number(payload.chainId)
  if (!Number.isInteger(chainId) || chainId <= 0) throw new Error('Invalid chain')
  return { walletAddress, chainId }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Payload
    const { walletAddress, chainId } = validate(payload)
    const existing = await db.select().from(participationProfiles).where(eq(participationProfiles.walletAddress, walletAddress)).limit(1)
    const profile = existing[0]
    const now = new Date()

    if (!profile) {
      await db.insert(participationProfiles).values({ walletAddress, chainId, lastSeenAt: now, updatedAt: now })
    } else {
      await db.update(participationProfiles).set({ chainId, lastSeenAt: now, updatedAt: now }).where(eq(participationProfiles.walletAddress, walletAddress))
    }

    if (payload.action === 'activate') {
      const active = await db.select().from(participationCycles).where(and(eq(participationCycles.walletAddress, walletAddress), eq(participationCycles.status, 'active'))).limit(1)
      if (!active[0]) {
        const startedAt = payload.startedAt && Number.isFinite(payload.startedAt) ? new Date(payload.startedAt) : now
        await db.insert(participationCycles).values({ walletAddress, chainId, startedAt, status: 'active' })
        await db.insert(participationEvents).values({ walletAddress, chainId, eventType: 'cycle_started', metadata: { source: 'web' } })
      }
    }

    if (payload.action === 'claim') {
      const active = await db.select().from(participationCycles).where(and(eq(participationCycles.walletAddress, walletAddress), eq(participationCycles.status, 'active'))).limit(1)
      const cycle = active[0]
      if (cycle && now.getTime() - cycle.startedAt.getTime() >= MAX_CYCLE_MS) {
        await db.update(participationCycles).set({ status: 'claimed', completedAt: now, pointsAwarded: String(POINTS_PER_CYCLE) }).where(eq(participationCycles.id, cycle.id))
        await db.update(participationProfiles).set({ points: String(Number(profile?.points ?? 0) + POINTS_PER_CYCLE), cyclesCompleted: (profile?.cyclesCompleted ?? 0) + 1, updatedAt: now, lastSeenAt: now }).where(eq(participationProfiles.walletAddress, walletAddress))
        await db.insert(participationEvents).values({ walletAddress, chainId, eventType: 'cycle_claimed', points: String(POINTS_PER_CYCLE), metadata: { source: 'web' } })
      }
    }

    const refreshed = await db.select().from(participationProfiles).where(eq(participationProfiles.walletAddress, walletAddress)).limit(1)
    const cycles = await db.select().from(participationCycles).where(and(eq(participationCycles.walletAddress, walletAddress), eq(participationCycles.status, 'active'))).limit(1)
    return NextResponse.json({ profile: refreshed[0], activeCycle: cycles[0] ?? null })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Participation request failed'
    return NextResponse.json({ error: message }, { status: message.startsWith('Invalid') ? 400 : 500 })
  }
}
