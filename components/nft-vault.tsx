'use client'

import { useState } from 'react'
import { ArrowUpRight, Gem, ShieldCheck, Sparkles } from 'lucide-react'
import { createCollectibleCheckout } from '@/app/actions/stripe'
import { formatProductPrice, PRODUCTS } from '@/lib/products'

export function NftVault() {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [error, setError] = useState('')
  async function buy(productId: string) {
    setLoadingId(productId)
    setError('')
    try {
      const url = await createCollectibleCheckout(productId)
      window.location.assign(url)
    } catch {
      setError('Checkout konnte nicht gestartet werden. Bitte erneut versuchen.')
      setLoadingId(null)
    }
  }
  return <section className="mx-auto flex min-w-0 max-w-6xl flex-col gap-5"><header className="rounded-3xl border border-amber-300/20 bg-gradient-to-br from-amber-300/15 via-rose-300/[0.08] to-transparent p-6 sm:p-8"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-200"><Gem className="size-4" /> Gang Banana collectibles</p><h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">Utility for your wallet.</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">Collect digital artwork from the universe and unlock profile identity, lore access and testnet roles. Checkout is handled securely by Stripe.</p></header><div className="grid gap-4 sm:grid-cols-2">{PRODUCTS.map((product) => <article key={product.id} className="overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.035]"><img src={product.image} alt={`${product.name} artwork`} className="h-48 w-full object-cover" /><div className="p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-300">Digital collectible</p><h3 className="mt-2 text-xl font-bold text-white">{product.name}</h3></div><p className="font-mono text-sm font-bold text-cyan-200">{formatProductPrice(product.priceInCents)}</p></div><p className="mt-3 text-sm leading-6 text-slate-400">{product.description}</p><div className="mt-4 flex items-start gap-2 rounded-xl border border-emerald-300/15 bg-emerald-300/[0.05] p-3 text-xs leading-5 text-emerald-100/80"><Sparkles className="mt-0.5 size-4 shrink-0 text-emerald-300" /><span>{product.utility}</span></div><button type="button" onClick={() => buy(product.id)} disabled={loadingId !== null} className="mt-5 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-amber-300 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-200 disabled:cursor-wait disabled:opacity-60">{loadingId === product.id ? 'Checkout wird geöffnet…' : 'Collect securely'}<ArrowUpRight className="size-4" /></button></div></article>)}</div>{error && <p role="alert" className="rounded-xl border border-rose-300/20 bg-rose-300/[0.06] p-4 text-sm text-rose-100">{error}</p>}<div className="flex items-start gap-3 rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.04] p-4 text-xs leading-5 text-slate-400"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-cyan-300" /><span><strong className="text-slate-200">Important:</strong> These are utility digital collectibles, not investment products. Onchain NFT minting, transfer and wallet ownership require a separate audited smart-contract release.</span></div></section>
}
