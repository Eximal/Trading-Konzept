import { AppHeader } from '@/components/app-header'
import { BottomNav } from '@/components/bottom-nav'
import { MiningDashboard } from '@/components/mining-dashboard'

export default function Page() {
  return (
    <div className="min-h-dvh">
      <AppHeader />
      <main className="mx-auto w-full max-w-3xl px-4 pt-5 pb-28">
        <div className="mb-5">
          <h1 className="text-xl font-semibold tracking-tight text-balance text-[#f0f6fc]">
            Multi-chain mining, one rig
          </h1>
          <p className="mt-1 text-sm text-pretty text-muted-foreground">
            Activate a 24 hour cycle, hold protocol assets, and compound your hashrate across Base,
            Monad and BNB Chain.
          </p>
        </div>
        <MiningDashboard />
      </main>
      <BottomNav />
    </div>
  )
}
