export const CYCLE_DURATION_MS = 24 * 60 * 60 * 1000

/** Baseline rig output in MH/s before any multipliers. */
export const BASE_HASHRATE = 12.5

/** Base $JKU emission per full 24h cycle at 1.00x. */
export const BASE_REWARD_PER_CYCLE = 250

export type BoostTier = {
  /** minimum holding required */
  min: number
  /** boost in percent */
  boost: number
}

/** Holding tiers per asset — tuned so a whale caps out around +150%. */
export const BOOST_TIERS: Record<'jku' | 'ent' | 'nft', BoostTier[]> = {
  jku: [
    { min: 1_000_000, boost: 75 },
    { min: 250_000, boost: 45 },
    { min: 50_000, boost: 25 },
    { min: 10_000, boost: 12 },
    { min: 1_000, boost: 5 },
  ],
  ent: [
    { min: 100_000, boost: 40 },
    { min: 25_000, boost: 22 },
    { min: 5_000, boost: 10 },
    { min: 500, boost: 4 },
  ],
  nft: [
    { min: 10, boost: 35 },
    { min: 5, boost: 20 },
    { min: 2, boost: 10 },
    { min: 1, boost: 5 },
  ],
}

export const MAX_BOOST_PERCENT = 150

export function tierBoost(asset: keyof typeof BOOST_TIERS, amount: number) {
  const tier = BOOST_TIERS[asset].find((t) => amount >= t.min)
  return tier ? tier.boost : 0
}

export function nextTier(asset: keyof typeof BOOST_TIERS, amount: number) {
  const ascending = [...BOOST_TIERS[asset]].sort((a, b) => a.min - b.min)
  return ascending.find((t) => amount < t.min)
}

export type Holdings = { jku: number; ent: number; nft: number }

export function calcBoost(holdings: Holdings) {
  const breakdown = {
    jku: tierBoost('jku', holdings.jku),
    ent: tierBoost('ent', holdings.ent),
    nft: tierBoost('nft', holdings.nft),
  }
  const raw = breakdown.jku + breakdown.ent + breakdown.nft
  const totalPercent = Math.min(raw, MAX_BOOST_PERCENT)
  return {
    breakdown,
    totalPercent,
    capped: raw > MAX_BOOST_PERCENT,
    multiplier: 1 + totalPercent / 100,
  }
}

export function formatHashrate(value: number) {
  if (value >= 1000) return `${(value / 1000).toFixed(3)} GH/s`
  return `${value.toFixed(2)} MH/s`
}

export function formatAmount(value: number, maxFractionDigits = 2) {
  return value.toLocaleString('en-US', {
    maximumFractionDigits: maxFractionDigits,
  })
}

export function formatDuration(ms: number) {
  const clamped = Math.max(0, ms)
  const totalSeconds = Math.floor(clamped / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const pad = (n: number) => n.toString().padStart(2, '0')
  return { hours: pad(hours), minutes: pad(minutes), seconds: pad(seconds) }
}

export function truncateAddress(address?: string, size = 4) {
  if (!address) return ''
  return `${address.slice(0, size + 2)}...${address.slice(-size)}`
}
