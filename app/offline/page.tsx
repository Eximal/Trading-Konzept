import { WifiOff } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Offline',
}

export default function OfflinePage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-3 px-6 text-center">
      <span className="flex size-12 items-center justify-center rounded-xl bg-secondary text-muted-foreground ring-1 ring-border ring-inset">
        <WifiOff className="size-5" aria-hidden="true" />
      </span>
      <h1 className="text-lg font-semibold text-[#f0f6fc]">You are offline</h1>
      <p className="max-w-sm text-sm text-pretty text-muted-foreground">
        Your mining cycle keeps running locally. Reconnect to sync balances and claim rewards
        on-chain.
      </p>
    </main>
  )
}
