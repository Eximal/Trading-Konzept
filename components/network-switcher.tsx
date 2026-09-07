'use client'

import { Check, ChevronDown, TriangleAlert } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useAccount, useSwitchChain } from 'wagmi'
import { getChainMeta, isSupportedChain, SUPPORTED_CHAINS } from '@/lib/web3/chains'
import { cn } from '@/lib/utils'

export function NetworkSwitcher() {
  const { chainId } = useAccount()
  const { switchChain, isPending } = useSwitchChain()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const meta = getChainMeta(chainId)
  const supported = isSupportedChain(chainId)

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          'inline-flex h-9 items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold ring-1 transition-opacity ring-inset',
          meta.badge,
          isPending && 'opacity-60',
        )}
      >
        {!supported && <TriangleAlert className="size-3.5" aria-hidden="true" />}
        <span>{meta.short}</span>
        <ChevronDown className="size-3.5 opacity-70" aria-hidden="true" />
      </button>

      {open && (
        <ul
          // biome-ignore lint/a11y/useSemanticElements: styled listbox
          role="listbox"
          aria-label="Select network"
          className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-border bg-card p-1 shadow-lg shadow-black/40"
        >
          {SUPPORTED_CHAINS.map((chain) => {
            const active = chain.id === chainId
            return (
              <li key={chain.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    switchChain({ chainId: chain.id })
                    setOpen(false)
                  }}
                  className="flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-foreground transition-colors hover:bg-secondary"
                >
                  <span>{getChainMeta(chain.id).label}</span>
                  {active && <Check className="size-3.5 text-[#238636]" aria-hidden="true" />}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
