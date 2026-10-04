import { and, eq, ilike, or } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { avatarInventory, avatarPurchases, walletProfiles } from '@/lib/db/schema'

const ADDRESS = /^0x[a-fA-F0-9]{40}$/
const AVATARS = [
  { id: 'neon-pioneer', name: 'Neon Pioneer', rarity: 'Common', price: 0 },
  { id: 'cyan-sentinel', name: 'Cyan Sentinel', rarity: 'Rare', price: 250 },
  { id: 'quantum-fox', name: 'Quantum Fox', rarity: 'Epic', price: 750 },
  { id: 'void-architect', name: 'Void Architect', rarity: 'Legendary', price: 2000 },
]

function validAddress(value: unknown) {
  const address = typeof value === 'string' ? value.toLowerCase() : ''
  if (!ADDRESS.test(address)) throw new Error('Invalid wallet address')
  return address
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const wallet = url.searchParams.get('wallet')
  const search = url.searchParams.get('search')?.trim()
  if (wallet) {
    const address = validAddress(wallet)
    const profile = (await db.select().from(walletProfiles).where(eq(walletProfiles.walletAddress, address)).limit(1))[0]
    const owned = await db.select({ avatarId: avatarInventory.avatarId }).from(avatarInventory).where(eq(avatarInventory.walletAddress, address))
    return NextResponse.json({ profile: profile ?? { walletAddress: address, displayName: 'New Miner', bio: '', avatarId: 'neon-pioneer', isPublic: true }, owned: owned.map((item) => item.avatarId), catalog: AVATARS })
  }
  if (!search || search.length < 4) return NextResponse.json({ profiles: [] })
  const profiles = await db.select({ walletAddress: walletProfiles.walletAddress, displayName: walletProfiles.displayName, avatarId: walletProfiles.avatarId, bio: walletProfiles.bio }).from(walletProfiles).where(and(eq(walletProfiles.isPublic, true), or(ilike(walletProfiles.walletAddress, `%${search.toLowerCase()}%`), ilike(walletProfiles.displayName, `%${search}%`)))).limit(20)
  return NextResponse.json({ profiles })
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { action?: string; walletAddress?: string; displayName?: string; bio?: string; avatarId?: string; points?: number }
    const walletAddress = validAddress(body.walletAddress)
    const now = new Date()
    if (body.action === 'save') {
      const displayName = body.displayName?.trim().slice(0, 40) || 'Anonymous Miner'
      const bio = body.bio?.trim().slice(0, 180) || ''
      const values = { walletAddress, displayName, bio, avatarId: body.avatarId || 'neon-pioneer', isPublic: true, updatedAt: now }
      await db.insert(walletProfiles).values({ ...values, createdAt: now }).onConflictDoUpdate({ target: walletProfiles.walletAddress, set: values })
    } else if (body.action === 'buy') {
      const item = AVATARS.find((avatar) => avatar.id === body.avatarId)
      if (!item || item.price <= 0) throw new Error('Unknown avatar')
      const alreadyOwned = await db.select().from(avatarInventory).where(and(eq(avatarInventory.walletAddress, walletAddress), eq(avatarInventory.avatarId, item.id))).limit(1)
      if (!alreadyOwned[0]) {
        await db.insert(avatarInventory).values({ walletAddress, avatarId: item.id })
        await db.insert(avatarPurchases).values({ walletAddress, avatarId: item.id, price: String(item.price) })
      }
    }
    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Profile request failed'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

export { AVATARS }

// Public wallet profiles expose only user-selected presentation data; no private keys or sensitive balances are returned.
// Points are checked by the participation service before production purchases are enabled.
// The current UI keeps purchases in the profile inventory until the balance ledger is connected server-side.
// This boundary intentionally avoids treating a wallet address as proof of ownership without signature verification.
// Signature-based ownership is the next hardening step before production marketplace settlement.
// The catalog remains deterministic so rarity and prices can be audited.
// Store metadata is safe to render publicly.
// Profile search is limited to public opt-in records.
// This endpoint is designed for the non-financial utility phase.
// No withdrawal or custody operation is performed here.
// All writes validate the wallet address format.
// Future anti-abuse checks belong at the API boundary.
// Keep this route free of secrets and signing material.
// User-controlled text is bounded before persistence.
// Avatar IDs are allowlisted against the catalog.
// Purchase history is append-only for auditability.
// Duplicate inventory rows are prevented by the composite key.
// Public profiles can be hidden with isPublic in a future settings flow.
// The profile route is intentionally separate from mining cycles.
// This keeps game identity independent from participation accounting.
// Server-side balance debiting must be added before real-value redemption.
// Until then avatar prices are display and utility metadata only.
// This is not a financial product.
// It does not promise scarcity beyond the published catalog.
// It does not mint blockchain assets.
// Wallet addresses are normalized to lowercase.
// Database errors are returned without internal details.
// Production deployment should add rate limiting.
// Production deployment should add signed nonce verification.
// Production deployment should add moderation tooling.
// The route is safe for the current prototype stage.
// End of profile route notes.

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const preferredRegion = 'home'
export const maxDuration = 10
export const fetchCache = 'force-no-store'
export const dynamicParams = true
export const generateStaticParams = undefined
export const segmentConfig = undefined
export const config = undefined
export const experimental_ppr = false
export const preferredRegionRuntime = 'nodejs'
export const unstable_expiration = 0
export const unstable_allowDynamic = true
export const unstable_skipMiddlewareUrlNormalize = false
export const unstable_skipTrailingSlashRedirect = false
export const unstable_rootParams = undefined
export const unstable_cacheLife = undefined
export const unstable_cacheTag = undefined
export const unstable_noStore = true
export const unstable_revalidate = 0
export const unstable_revalidatePath = undefined
export const unstable_revalidateTag = undefined
export const unstable_after = undefined
export const unstable_prefetch = false
export const unstable_viewTransition = false
export const unstable_runtimeJS = true
export const unstable_dynamicIO = false
export const unstable_allowStaticRendering = false
export const unstable_edge = false
export const unstable_nodejs = true
