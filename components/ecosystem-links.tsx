'use client'

import { ArrowUpRight, BarChart3, BookOpen, Globe2, MessageCircle, Repeat2, ScanLine } from 'lucide-react'

const links = [
  { label: 'JKU Crypto Hub', href: 'https://link-booster--universeofentra.replit.app', icon: Globe2 },
  { label: 'JKU auf Base / Uniswap', href: 'https://dexscreener.com/base/0x4f3edeac4db4a2ceec7a0eeaa2255e0e7296b9e6', icon: Repeat2 },
  { label: 'JKU Blockscan', href: 'https://blockscan.com/address/0x4f3edeac4db4a2ceec7a0eeaa2255e0e7296b9e6', icon: ScanLine },
  { label: 'Portfolio & Transparenz', href: 'https://linktr.ee/Jakaral.United.Estab.2024', icon: BarChart3 },
  { label: 'Discord Community', href: 'https://discord.com', icon: MessageCircle },
  { label: 'Bitcoin Open Source', href: 'https://bitcoin.org', icon: BookOpen },
]

export function EcosystemLinks() {
  return (
    <section aria-labelledby="ecosystem-heading" className="mt-6 rounded-2xl border border-border bg-card/70 p-4">
      <div className="mb-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#58a6ff]">JKU ecosystem</p>
        <h2 id="ecosystem-heading" className="mt-1 text-base font-semibold text-[#f0f6fc]">Links, Markt & Community</h2>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">Die wichtigsten Ziele aus dem Jakaral-United-Linktree an einem Ort.</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {links.map(({ label, href, icon: Icon }) => (
          <a key={label} href={href} target="_blank" rel="noreferrer" className="flex min-h-12 items-center justify-between gap-2 rounded-xl border border-border bg-[#0d1117]/70 px-3 py-2.5 text-xs font-medium text-[#c9d1d9] transition-colors hover:border-[#58a6ff]/60 hover:text-[#58a6ff]">
            <span className="flex min-w-0 items-center gap-2"><Icon className="size-4 shrink-0" aria-hidden="true" /><span className="truncate">{label}</span></span>
            <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
          </a>
        ))}
      </div>
    </section>
  )
}

export function MiningTrustNotice() {
  return (
    <aside className="mt-4 rounded-xl border border-[#d29922]/35 bg-[#d29922]/10 px-3 py-2.5 text-xs leading-5 text-[#d8b65d]">
      <strong className="font-semibold text-[#f0d58a]">On-chain Hinweis:</strong> Der aktuelle Rig-Zyklus ist ein lokaler Proof-of-Participation-Modus. Echte JKU-Auszahlungen werden erst aktiviert, sobald ein verifizierter Mining-Contract mit Activate-, Claim- und Reward-Funktionen hinterlegt ist.
    </aside>
  )
}
