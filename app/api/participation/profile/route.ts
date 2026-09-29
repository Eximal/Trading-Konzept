import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { participationProfiles } from '@/lib/db/schema'

const ADDRESS = /^0x[a-fA-F0-9]{40}$/

export async function GET(request: Request) {
  const walletAddress = new URL(request.url).searchParams.get('wallet')?.toLowerCase()
  if (!walletAddress || !ADDRESS.test(walletAddress)) return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 })
  const profile = await db.select().from(participationProfiles).where(eq(participationProfiles.walletAddress, walletAddress)).limit(1)
  return NextResponse.json({ profile: profile[0] ?? null })
}
