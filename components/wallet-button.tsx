'use client'

import { ConnectKitButton } from 'connectkit'
import { LoaderCircle, Wallet } from 'lucide-react'
import { useAccount, useBalance } from 'wagmi'
import { NetworkSwitcher } from '@/components/network-switcher'
import { truncateAddress } from '@/lib/mining'

export function WalletButton() {
  const { address, isConnected } = useAccount()
  // No explicit chainId: wagmi reads the balance on the wallet's active chain.
  const { data: balance } = useBalance({
    address,
    query: { enabled: !!address, refetchInterval: 30_000 },
  })

  return (
    <ConnectKitButton.Custom>
      {({ show, isConnecting }) => {
        if (!isConnected) {
          return (
            <button
              type="button"
              onClick={show}
              className="inline-flex h-9 items-center gap-2 rounded-full bg-[#238636] px-4 text-sm font-semibold text-[#f0f6fc] transition-colors hover:bg-[#2ea043] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#58a6ff] disabled:opacity-60"
              disabled={isConnecting}
            >
              {isConnecting ? (
                <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Wallet className="size-4" aria-hidden="true" />
              )}
              {isConnecting ? 'Connecting' : 'Connect'}
            </button>
          )
        }

        return (
          <div className="flex items-center gap-1.5">
            <NetworkSwitcher />
            <button
              type="button"
              onClick={show}
              className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-card px-3 text-sm transition-colors hover:border-[#58a6ff]/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#58a6ff]"
              aria-label="Wallet details"
            >
              <span className="tabular font-mono text-xs text-foreground">
                {truncateAddress(address)}
              </span>
              <span className="hidden h-4 w-px bg-border sm:block" aria-hidden="true" />
              <span className="tabular hidden text-xs text-muted-foreground sm:block">
                {balance
                  ? `${Number(balance.formatted).toFixed(3)} ${balance.symbol}`
                  : '—'}
              </span>
            </button>
          </div>
        )
      }}
    </ConnectKitButton.Custom>
  )
}
