'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  ArrowDownToLine,
  ArrowUpRight,
  BarChart3,
  BatteryCharging,
  Check,
  CircleDollarSign,
  Cpu,
  Gauge,
  LayoutDashboard,
  LockKeyhole,
  Menu,
  Pickaxe,
  Power,
  Snowflake,
  Sparkles,
  Store,
  Wallet,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WalletButton } from '@/components/wallet-button'

const upgrades = [
  { name: 'RTX Cluster', type: 'GPU', boost: '+18.4 MH/s', energy: '240 W', price: 42, icon: Cpu, tone: 'cyan' },
  { name: 'Antminer J9', type: 'ASIC', boost: '+36.0 MH/s', energy: '680 W', price: 86, icon: Pickaxe, tone: 'green' },
  { name: 'Liquid Loop', type: 'COOLING', boost: '+8.2 MH/s', energy: '90 W', price: 28, icon: Snowflake, tone: 'violet' },
  { name: 'Quantum Core', type: 'GPU', boost: '+62.5 MH/s', energy: '1.1 kW', price: 150, icon: Sparkles, tone: 'amber' },
]

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Shop', icon: Store },
  { label: 'Wallet', icon: Wallet },
]

function formatTokens(value: number) {
  return value.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })
}

export function CloudMinerApp() {
  const [activeView, setActiveView] = useState('Dashboard')
  const [isMining, setIsMining] = useState(true)
  const [tokens, setTokens] = useState(12842.4921)
  const [balance, setBalance] = useState(248.42)
  const [withdrawalAmount, setWithdrawalAmount] = useState('')
  const [targetAddress, setTargetAddress] = useState('')
  const [network, setNetwork] = useState('Ethereum')
  const [ownedUpgrades, setOwnedUpgrades] = useState<string[]>(['RTX Cluster'])
  const [notice, setNotice] = useState('')

  useEffect(() => {
    if (!isMining) return
    const timer = window.setInterval(() => {
      setTokens((current) => current + 0.0028)
      setBalance((current) => current + 0.0028)
    }, 1000)
    return () => window.clearInterval(timer)
  }, [isMining])

  const totalHashrate = useMemo(() => {
    const base = 42.8
    const boost = upgrades.filter((item) => ownedUpgrades.includes(item.name)).reduce((sum, item) => sum + Number.parseFloat(item.boost), 0)
    return base + boost
  }, [ownedUpgrades])

  function buyUpgrade(name: string, price: number) {
    if (ownedUpgrades.includes(name) || balance < price) return
    setBalance((current) => current - price)
    setOwnedUpgrades((current) => [...current, name])
    setNotice(`${name} added to your rig.`)
  }

  function claimRewards() {
    setNotice(`${formatTokens(tokens)} CMR transferred to your wallet.`)
    setBalance((current) => current + tokens)
    setTokens(0)
  }

  function withdraw() {
    const amount = Number(withdrawalAmount)
    if (!targetAddress || !amount || amount <= 0 || amount > balance) {
      setNotice('Enter a valid address and an amount within your balance.')
      return
    }
    setBalance((current) => current - amount)
    setWithdrawalAmount('')
    setNotice(`Withdrawal queued on ${network}.`)
  }

  return (
    <div className="min-h-dvh overflow-x-hidden bg-[#0b0f17] text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(34,211,238,0.12),transparent_36%),radial-gradient(circle_at_90%_55%,rgba(74,222,128,0.06),transparent_28%)]" />
      <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#0b0f17]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl border border-cyan-300/25 bg-cyan-300/10 text-cyan-300 shadow-[0_0_28px_rgba(34,211,238,0.16)]">
              <Pickaxe className="size-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-black tracking-[0.22em] text-white">CLOUD<span className="text-cyan-300">MINER</span></p>
              <p className="hidden text-[9px] font-semibold uppercase tracking-[0.28em] text-slate-500 sm:block">Proof of participation</p>
            </div>
          </div>
          <nav className="hidden items-center gap-1 rounded-xl border border-white/[0.07] bg-white/[0.025] p-1 md:flex" aria-label="Primary navigation">
            {navItems.map((item) => {
              const Icon = item.icon
              return <button key={item.label} type="button" onClick={() => setActiveView(item.label)} className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition ${activeView === item.label ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-200'}`}><Icon className="size-3.5" aria-hidden="true" />{item.label}</button>
            })}
          </nav>
          <div className="flex items-center gap-2">
            <div className="hidden sm:block"><WalletButton /></div>
            <button type="button" className="flex size-10 items-center justify-center rounded-xl border border-white/[0.08] text-slate-400 md:hidden" aria-label="Open menu"><Menu className="size-5" /></button>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-4 pb-28 pt-7 sm:px-6 lg:px-8 lg:pb-12">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-300"><span className="size-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_currentColor]" />Protocol online</p>
            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">Your mining command center</h1>
            <p className="mt-2 max-w-xl text-sm text-slate-500">Mine participation points, scale your rig, and turn activity into ecosystem utility.</p>
          </div>
          <div className="hidden items-center gap-2 text-right sm:flex"><div className="size-2 rounded-full bg-emerald-400 shadow-[0_0_12px_#4ade80]" /><span className="text-xs text-slate-400">All systems operational</span></div>
        </div>

        {notice && <div role="status" className="mb-5 flex items-center justify-between rounded-xl border border-cyan-300/20 bg-cyan-300/[0.07] px-4 py-3 text-sm text-cyan-100"><span>{notice}</span><button type="button" onClick={() => setNotice('')} className="text-cyan-300">Dismiss</button></div>}

        {activeView === 'Dashboard' && <DashboardView isMining={isMining} setIsMining={setIsMining} tokens={tokens} balance={balance} totalHashrate={totalHashrate} claimRewards={claimRewards} setActiveView={setActiveView} />}
        {activeView === 'Shop' && <ShopView balance={balance} ownedUpgrades={ownedUpgrades} buyUpgrade={buyUpgrade} />}
        {activeView === 'Wallet' && <WalletView balance={balance} amount={withdrawalAmount} setAmount={setWithdrawalAmount} address={targetAddress} setAddress={setTargetAddress} network={network} setNetwork={setNetwork} withdraw={withdraw} />}
      </main>

      <nav className="fixed inset-x-4 bottom-4 z-30 flex justify-around rounded-2xl border border-white/[0.1] bg-[#111722]/90 p-2 shadow-2xl backdrop-blur-xl md:hidden" aria-label="Mobile navigation">
        {navItems.map((item) => { const Icon = item.icon; return <button key={item.label} type="button" onClick={() => setActiveView(item.label)} className={`flex min-w-20 flex-col items-center gap-1 rounded-xl px-3 py-2 text-[10px] font-semibold ${activeView === item.label ? 'bg-cyan-300/10 text-cyan-300' : 'text-slate-500'}`}><Icon className="size-4" aria-hidden="true" />{item.label}</button> })}
      </nav>
    </div>
  )
}

function DashboardView({ isMining, setIsMining, tokens, balance, totalHashrate, claimRewards, setActiveView }: { isMining: boolean; setIsMining: (value: boolean) => void; tokens: number; balance: number; totalHashrate: number; claimRewards: () => void; setActiveView: (value: string) => void }) {
  return <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
    <section className="relative overflow-hidden rounded-3xl border border-cyan-300/15 bg-white/[0.035] p-5 shadow-[0_0_55px_rgba(34,211,238,0.05)] sm:p-7">
      <div className="absolute -right-24 -top-24 size-64 rounded-full bg-cyan-300/10 blur-3xl" />
      <div className="relative flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Live token counter</p><div className="mt-4 flex items-baseline gap-2"><span className="tabular text-4xl font-black tracking-tighter text-white sm:text-6xl">{formatTokens(tokens)}</span><span className="text-sm font-bold text-cyan-300">CMR</span></div><div className="mt-3 flex items-center gap-2 text-xs text-slate-500"><span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_12px_#4ade80]" />+0.0028 CMR / second</div></div><span className={`rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${isMining ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300' : 'border-slate-500/30 bg-slate-500/10 text-slate-400'}`}>{isMining ? 'Mining active' : 'Mining paused'}</span></div>
      <div className="relative mt-8 grid grid-cols-2 gap-3 border-t border-white/[0.08] pt-5 sm:grid-cols-4"><Metric label="Hashrate" value={`${totalHashrate.toFixed(1)} MH/s`} icon={Gauge} /><Metric label="Total earned" value={`${formatTokens(balance)} CMR`} icon={CircleDollarSign} /><Metric label="Efficiency" value="94.8%" icon={BatteryCharging} /><Metric label="Active rigs" value="03 / 05" icon={BarChart3} /></div>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row"><Button onClick={() => setIsMining(!isMining)} className="h-12 flex-1 rounded-xl bg-emerald-400 font-bold text-slate-950 hover:bg-emerald-300"><Power data-icon="inline-start" />{isMining ? 'Stop mining' : 'Start mining'}</Button><Button onClick={claimRewards} variant="outline" className="h-12 flex-1 rounded-xl border-cyan-300/30 bg-transparent font-bold text-cyan-200 hover:bg-cyan-300/10"><ArrowDownToLine data-icon="inline-start" />Claim rewards</Button></div>
    </section>
    <section className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-5 sm:p-7"><div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Rig performance</p><p className="mt-2 text-lg font-bold text-white">Network contribution</p></div><span className="rounded-lg bg-cyan-300/10 p-2 text-cyan-300"><Zap className="size-4" /></span></div><div className="mt-7 flex h-36 items-end gap-1.5">{[38,52,44,70,58,76,64,84,72,91,78,96,87,100,90,94,82,98,88,100].map((height, index) => <div key={index} className="flex-1 rounded-t-sm bg-gradient-to-t from-cyan-300/20 to-cyan-300" style={{ height: `${height}%`, opacity: index > 15 ? 1 : 0.58 }} />)}</div><div className="mt-5 flex items-center justify-between text-xs"><span className="text-slate-500">Last 24 hours</span><span className="font-semibold text-emerald-300">+12.4% <ArrowUpRight className="inline size-3" /></span></div><button type="button" onClick={() => setActiveView('Shop')} className="mt-6 flex w-full items-center justify-between rounded-xl border border-white/[0.08] px-4 py-3 text-sm text-slate-300 transition hover:border-cyan-300/30 hover:text-white"><span className="flex items-center gap-2"><Sparkles className="size-4 text-amber-300" />Scale your rig</span><ArrowUpRight className="size-4 text-slate-500" /></button></section>
  </div>
}

function Metric({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Gauge }) { return <div className="flex items-center gap-2"><Icon className="hidden size-4 text-slate-600 sm:block" /><div><p className="text-[10px] uppercase tracking-wider text-slate-600">{label}</p><p className="mt-1 text-xs font-bold text-slate-200 sm:text-sm">{value}</p></div></div> }

function ShopView({ balance, ownedUpgrades, buyUpgrade }: { balance: number; ownedUpgrades: string[]; buyUpgrade: (name: string, price: number) => void }) { return <section><div className="mb-5 flex items-end justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Hardware market</p><h2 className="mt-2 text-2xl font-black text-white">Build your advantage</h2></div><div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-xs text-slate-400"><CircleDollarSign className="size-4 text-emerald-300" />{formatTokens(balance)} CMR</div></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{upgrades.map((item) => { const Icon = item.icon; const owned = ownedUpgrades.includes(item.name); const canBuy = balance >= item.price; return <article key={item.name} className="group rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5 transition hover:-translate-y-1 hover:border-cyan-300/30"><div className={`mb-8 flex size-12 items-center justify-center rounded-2xl ${item.tone === 'cyan' ? 'bg-cyan-300/10 text-cyan-300' : item.tone === 'green' ? 'bg-emerald-300/10 text-emerald-300' : item.tone === 'violet' ? 'bg-violet-300/10 text-violet-300' : 'bg-amber-300/10 text-amber-300'}`}><Icon className="size-6" /></div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{item.type}</p><h3 className="mt-2 text-lg font-bold text-white">{item.name}</h3><div className="mt-5 flex flex-col gap-3 border-y border-white/[0.07] py-4 text-xs"><span className="flex justify-between text-slate-500">Hashrate <b className="text-emerald-300">{item.boost}</b></span><span className="flex justify-between text-slate-500">Energy <b className="text-slate-300">{item.energy}</b></span></div><div className="mt-5 flex items-center justify-between"><span className="font-bold text-white">{item.price} <span className="text-xs font-medium text-slate-500">CMR</span></span><Button size="sm" disabled={owned || !canBuy} onClick={() => buyUpgrade(item.name, item.price)} className="rounded-lg bg-white/10 text-white hover:bg-cyan-300 hover:text-slate-950">{owned ? <><Check data-icon="inline-start" />Owned</> : 'Buy upgrade'}</Button></div></article> })}</div></section> }

function WalletView({ balance, amount, setAmount, address, setAddress, network, setNetwork, withdraw }: { balance: number; amount: string; setAmount: (value: string) => void; address: string; setAddress: (value: string) => void; network: string; setNetwork: (value: string) => void; withdraw: () => void }) { return <section className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-[0.85fr_1.15fr]"><div className="rounded-3xl border border-cyan-300/20 bg-gradient-to-br from-cyan-300/15 via-white/[0.04] to-transparent p-6 sm:p-8"><div className="flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">Available balance</p><Wallet className="size-5 text-cyan-300" /></div><p className="mt-10 text-4xl font-black text-white">{formatTokens(balance)} <span className="text-sm font-bold text-cyan-300">CMR</span></p><p className="mt-2 text-xs text-slate-500">Rewards available to withdraw</p><div className="mt-10 flex items-center gap-2 text-xs text-slate-400"><LockKeyhole className="size-3.5 text-emerald-300" /> Non-custodial wallet layer</div></div><div className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-6 sm:p-8"><div className="mb-6"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Withdraw rewards</p><h2 className="mt-2 text-xl font-bold text-white">Send CMR to your wallet</h2></div><div className="flex flex-col gap-4"><label className="text-xs font-semibold text-slate-400">Target wallet address<input value={address} onChange={(event) => setAddress(event.target.value)} placeholder="0x... or wallet address" className="mt-2 h-12 w-full rounded-xl border border-white/[0.09] bg-[#0b0f17] px-4 text-sm text-white outline-none placeholder:text-slate-700 focus:border-cyan-300/50" /></label><label className="text-xs font-semibold text-slate-400">Network<select value={network} onChange={(event) => setNetwork(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-white/[0.09] bg-[#0b0f17] px-4 text-sm text-white outline-none focus:border-cyan-300/50"><option>Ethereum</option><option>Polygon</option><option>Solana</option></select></label><label className="text-xs font-semibold text-slate-400">Amount<input value={amount} onChange={(event) => setAmount(event.target.value)} type="number" min="0" step="0.01" placeholder="0.00" className="mt-2 h-12 w-full rounded-xl border border-white/[0.09] bg-[#0b0f17] px-4 text-sm text-white outline-none placeholder:text-slate-700 focus:border-cyan-300/50" /></label><Button onClick={withdraw} className="h-12 rounded-xl bg-cyan-300 font-bold text-slate-950 hover:bg-cyan-200"><ArrowDownToLine data-icon="inline-start" />Withdraw</Button><p className="flex items-center gap-2 text-[11px] text-slate-600"><LockKeyhole className="size-3" /> Withdrawals are simulated for Proof-of-Participation points.</p></div></div></section> }

export default CloudMinerApp
