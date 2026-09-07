import { Pickaxe } from 'lucide-react'
import { WalletButton } from '@/components/wallet-button'

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-[#0d1117]/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between gap-3 px-4">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-[#238636]/15 ring-1 ring-[#238636]/40 ring-inset">
            <Pickaxe className="size-4 text-[#3fb950]" aria-hidden="true" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-[#f0f6fc]">JKU Mining</p>
            <p className="text-[10px] tracking-widest text-muted-foreground uppercase">
              Protocol v1
            </p>
          </div>
        </div>
        <WalletButton />
      </div>
    </header>
  )
}
