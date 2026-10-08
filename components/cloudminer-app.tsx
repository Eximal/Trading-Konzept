'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { formatUnits } from 'viem'
import {
  ArrowDownToLine,
  ArrowUpRight,
  Download,
  BarChart3,
  BatteryCharging,
  Check,
  CircleDollarSign,
  Copy,
  Cpu,
  FileText,
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
  UserRound,
  Search,
  ServerCog,
  Blocks,
  Globe2,
  ShieldCheck,
  Zap,
  Vote,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WalletButton } from '@/components/wallet-button'

const BRATE_TOKEN_ADDRESS = '0xE0CB06A00524180fFbAE005d1010531b99e0A254' as const
const brateTokenAbi = [
  { type: 'function', name: 'balanceOf', stateMutability: 'view', inputs: [{ name: 'account', type: 'address' }], outputs: [{ name: '', type: 'uint256' }] },
  { type: 'function', name: 'decimals', stateMutability: 'view', inputs: [], outputs: [{ name: '', type: 'uint8' }] },
  { type: 'function', name: 'symbol', stateMutability: 'view', inputs: [], outputs: [{ name: '', type: 'string' }] },
  { type: 'function', name: 'totalSupply', stateMutability: 'view', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
  { type: 'function', name: 'owner', stateMutability: 'view', inputs: [], outputs: [{ name: '', type: 'address' }] },
] as const

const upgrades = [
  { name: 'RTX 4090 Rig', type: 'GPU', boost: '+25.0 MH/s', energy: '350 W', price: 100, icon: Cpu, tone: 'cyan' },
  { name: 'Antminer S19 Pro', type: 'ASIC', boost: '+110.0 MH/s', energy: '3.25 kW', price: 500, icon: Pickaxe, tone: 'green' },
  { name: 'Liquid Loop', type: 'COOLING', boost: '+8.0 MH/s', energy: '90 W', price: 75, icon: Snowflake, tone: 'violet' },
  { name: 'Quantum Server Node', type: 'NODE', boost: '+500.0 MH/s', energy: '5 kW', price: 2000, icon: Sparkles, tone: 'amber' },
]

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Shop', icon: Store },
  { label: 'Wallet', icon: Wallet },
  { label: 'Whitepaper', icon: FileText },
  { label: 'Profile', icon: UserRound },
  { label: 'Miner OS', icon: ServerCog },
  { label: 'Ecosystem', icon: Globe2 },
  { label: 'CloudChain', icon: Blocks },
  { label: 'Governance', icon: Vote },
]

function formatTokens(value: number) {
  return value.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })
}

export function CloudMinerApp() {
  const { address, isConnected, chainId } = useAccount()
  const { data: brateRawBalance, isLoading: isBrateLoading, isError: isBrateError } = useReadContract({
    address: BRATE_TOKEN_ADDRESS,
    abi: brateTokenAbi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: 8453,
    query: { enabled: Boolean(address && chainId === 8453), refetchInterval: 30_000 },
  })
  const { data: brateDecimals } = useReadContract({ address: BRATE_TOKEN_ADDRESS, abi: brateTokenAbi, functionName: 'decimals', chainId: 8453, query: { enabled: chainId === 8453, staleTime: Infinity } })
  const { data: brateSymbol } = useReadContract({ address: BRATE_TOKEN_ADDRESS, abi: brateTokenAbi, functionName: 'symbol', chainId: 8453, query: { enabled: chainId === 8453, staleTime: Infinity } })
  const { data: brateTotalSupply } = useReadContract({ address: BRATE_TOKEN_ADDRESS, abi: brateTokenAbi, functionName: 'totalSupply', chainId: 8453, query: { enabled: chainId === 8453, staleTime: 60_000 } })
  const { data: brateOwner } = useReadContract({ address: BRATE_TOKEN_ADDRESS, abi: brateTokenAbi, functionName: 'owner', chainId: 8453, query: { enabled: chainId === 8453, staleTime: 60_000 } })
  const tokenDecimals = brateDecimals ?? 8
  const brateBalance = brateRawBalance === undefined ? null : formatUnits(brateRawBalance, tokenDecimals)
  const brateSupply = brateTotalSupply === undefined ? null : formatUnits(brateTotalSupply, tokenDecimals)
  const brateOwnerLabel = brateOwner ? `${brateOwner.slice(0, 6)}...${brateOwner.slice(-4)}` : 'Protected owner'
  const [activeView, setActiveView] = useState('Dashboard')
  const [isMining, setIsMining] = useState(false)
  const [tokens, setTokens] = useState(0)
  const [balance, setBalance] = useState(0)
  const [withdrawalAmount, setWithdrawalAmount] = useState('')
  const [targetAddress, setTargetAddress] = useState('')
  const [network, setNetwork] = useState('Ethereum')
  const [ownedUpgrades, setOwnedUpgrades] = useState<string[]>([])
  const [notice, setNotice] = useState('')
  const [dropClaimed, setDropClaimed] = useState(false)
  const [inviteCopied, setInviteCopied] = useState(false)
  const inviteLink = useMemo(() => `${typeof window !== 'undefined' ? window.location.origin : 'https://cloudminer.app'}?ref=JAKARAL-2024`, [])

  const totalHashrate = useMemo(() => {
    const base = 10
    const boost = upgrades.filter((item) => ownedUpgrades.includes(item.name)).reduce((sum, item) => sum + Number.parseFloat(item.boost), 0)
    return base + boost
  }, [ownedUpgrades])

  useEffect(() => {
    if (!isMining) return
    const timer = window.setInterval(() => {
      const earnedPerSecond = totalHashrate * 0.0001
      setTokens((current) => current + earnedPerSecond)
      setBalance((current) => current + earnedPerSecond)
    }, 1000)
    return () => window.clearInterval(timer)
  }, [isMining, totalHashrate])

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

  async function copyInviteLink() {
    try {
      await navigator.clipboard.writeText(inviteLink)
      setInviteCopied(true)
      setNotice('Einladungslink kopiert. Beide Seiten bleiben kostenlos.')
      window.setTimeout(() => setInviteCopied(false), 2200)
    } catch {
      setNotice('Link konnte nicht kopiert werden. Bitte manuell auswählen.')
    }
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
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event('jku:request-install'))}
              className="flex items-center gap-2 rounded-xl border border-cyan-300/25 bg-cyan-300/10 px-2.5 py-2 text-xs font-semibold text-cyan-200 transition hover:border-cyan-300/50 hover:bg-cyan-300/15 sm:px-3"
              aria-label="CloudMiner installieren"
            >
              <Download className="size-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Install app</span>
            </button>
            <div className="hidden sm:block"><WalletButton /></div>
            <button type="button" className="flex size-10 items-center justify-center rounded-xl border border-white/[0.08] text-slate-400 md:hidden" aria-label="Open menu"><Menu className="size-5" /></button>
          </div>
        </div>
      </header>

      <main className="relative mx-auto min-w-0 max-w-7xl px-4 pb-40 pt-7 sm:px-6 sm:pb-32 lg:px-8 lg:pb-12">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-300"><span className="size-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_currentColor]" />Protocol online</p>
            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">Your mining command center</h1>
            <p className="mt-2 max-w-xl text-sm text-slate-500">Mine participation points, scale your rig, and turn activity into ecosystem utility.</p>
          </div>
          <div className="hidden items-center gap-2 text-right sm:flex"><div className="size-2 rounded-full bg-emerald-400 shadow-[0_0_12px_#4ade80]" /><span className="text-xs text-slate-400">All systems operational</span></div>
        </div>

        {notice && <div role="status" className="mb-5 flex items-center justify-between rounded-xl border border-cyan-300/20 bg-cyan-300/[0.07] px-4 py-3 text-sm text-cyan-100"><span>{notice}</span><button type="button" onClick={() => setNotice('')} className="text-cyan-300">Dismiss</button></div>}

        {activeView === 'Dashboard' && <DashboardView isMining={isMining} setIsMining={setIsMining} tokens={tokens} balance={balance} totalHashrate={totalHashrate} claimRewards={claimRewards} setActiveView={setActiveView} dropClaimed={dropClaimed} claimDrop={() => { setDropClaimed(true); setBalance((current) => current + 10); setNotice('Daily utility drop claimed: +10 CMR participation points.') }} inviteLink={inviteLink} inviteCopied={inviteCopied} copyInviteLink={copyInviteLink} brateBalance={brateBalance} brateSupply={brateSupply} brateSymbol={brateSymbol} brateOwnerLabel={brateOwnerLabel} isBrateLoading={isBrateLoading} isBrateError={isBrateError} chainId={chainId} />}
        {activeView === 'Shop' && <ShopView balance={balance} ownedUpgrades={ownedUpgrades} buyUpgrade={buyUpgrade} />}
        {activeView === 'Wallet' && <WalletView balance={balance} amount={withdrawalAmount} setAmount={setWithdrawalAmount} address={targetAddress} setAddress={setTargetAddress} network={network} setNetwork={setNetwork} withdraw={withdraw} />}
        {activeView === 'Whitepaper' && <WhitepaperView />}
        {activeView === 'Profile' && <ProfileView address={address} isConnected={isConnected} balance={balance} />}
        {activeView === 'Miner OS' && <MinerOsView isMining={isMining} setIsMining={setIsMining} />}
        {activeView === 'Ecosystem' && <EcosystemView />}
        {activeView === 'CloudChain' && <CloudChainView />}
        {activeView === 'Governance' && <GovernanceView />}
      </main>

      <nav className="fixed inset-x-4 bottom-4 z-30 flex gap-1 overflow-x-auto rounded-2xl border border-white/[0.1] bg-[#111722]/90 p-2 shadow-2xl backdrop-blur-xl md:hidden" aria-label="Mobile navigation">
        {navItems.map((item) => { const Icon = item.icon; return <button key={item.label} type="button" onClick={() => setActiveView(item.label)} className={`flex min-w-[58px] shrink-0 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[8px] font-semibold ${activeView === item.label ? 'bg-cyan-300/10 text-cyan-300' : 'text-slate-500'}`}><Icon className="size-4" aria-hidden="true" />{item.label}</button> })}
      </nav>
    </div>
  )
}

function DashboardView({ isMining, setIsMining, tokens, balance, totalHashrate, claimRewards, setActiveView, dropClaimed, claimDrop, inviteLink, inviteCopied, copyInviteLink, brateBalance, brateSupply, brateSymbol, brateOwnerLabel, isBrateLoading, isBrateError, chainId }: { isMining: boolean; setIsMining: (value: boolean) => void; tokens: number; balance: number; totalHashrate: number; claimRewards: () => void; setActiveView: (value: string) => void; dropClaimed: boolean; claimDrop: () => void; inviteLink: string; inviteCopied: boolean; copyInviteLink: () => void; brateBalance: string | null; brateSupply: string | null; brateSymbol?: string; brateOwnerLabel: string; isBrateLoading: boolean; isBrateError: boolean; chainId?: number }) {
  return <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
    <section className="relative overflow-hidden rounded-3xl border border-cyan-300/15 bg-white/[0.035] p-5 shadow-[0_0_55px_rgba(34,211,238,0.05)] sm:p-7">
      <div className="absolute -right-24 -top-24 size-64 rounded-full bg-cyan-300/10 blur-3xl" />
      <div className="relative flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Live token counter</p><div className="mt-4 flex items-baseline gap-2"><span className="tabular text-4xl font-black tracking-tighter text-white sm:text-6xl">{formatTokens(tokens)}</span><span className="text-sm font-bold text-cyan-300">CMR</span></div><div className="mt-3 flex items-center gap-2 text-xs text-slate-500"><span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_12px_#4ade80]" />Hashrate × 0.0001 points / second</div></div><span className={`rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${isMining ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300' : 'border-slate-500/30 bg-slate-500/10 text-slate-400'}`}>{isMining ? 'Mining active' : 'Mining paused'}</span></div>
      <div className="relative mt-8 grid grid-cols-2 gap-3 border-t border-white/[0.08] pt-5 sm:grid-cols-4"><Metric label="Hashrate" value={`${totalHashrate.toFixed(1)} MH/s`} icon={Gauge} /><Metric label="Total earned" value={`${formatTokens(balance)} CMR`} icon={CircleDollarSign} /><Metric label="Efficiency" value="94.8%" icon={BatteryCharging} /><Metric label="Active rigs" value="03 / 05" icon={BarChart3} /></div>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row"><Button onClick={() => setIsMining(!isMining)} className="h-12 flex-1 rounded-xl bg-emerald-400 font-bold text-slate-950 hover:bg-emerald-300"><Power data-icon="inline-start" />{isMining ? 'Stop mining' : 'Start mining'}</Button><Button onClick={claimRewards} variant="outline" className="h-12 flex-1 rounded-xl border-cyan-300/30 bg-transparent font-bold text-cyan-200 hover:bg-cyan-300/10"><ArrowDownToLine data-icon="inline-start" />Claim rewards</Button></div>
    </section>
    <section className="min-w-0 rounded-3xl border border-[#58a6ff]/25 bg-[#58a6ff]/[0.05] p-5 sm:p-7"><div className="flex min-w-0 items-start justify-between gap-3"><div className="flex min-w-0 items-start gap-3"><img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BB-tP04UaJUBR190Bw7PhwBLUT7loRGLf.jpeg" alt="Brate Banana Coin-Artwork" className="size-16 shrink-0 rounded-2xl border border-[#58a6ff]/30 object-cover shadow-[0_0_24px_rgba(88,166,255,0.2)]" /><div><p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#58a6ff]">Base onchain token</p><p className="mt-2 text-lg font-bold text-white">Brate Banana (BRATE)</p><p className="mt-2 text-xs leading-5 text-slate-400">Live balance from the token contract on Base. Contract uses 8 decimals.</p></div></div><CircleDollarSign className="size-5 shrink-0 text-[#58a6ff]" aria-hidden="true" /></div><div className="mt-5 flex flex-wrap items-end justify-between gap-4"><div><p className="break-all font-mono text-xl font-black text-white sm:text-2xl">{chainId !== 8453 ? 'Switch to Base' : isBrateLoading ? 'Reading...' : isBrateError ? 'Unavailable' : brateBalance ?? '0'} <span className="text-sm text-[#58a6ff]">BRATE</span></p><p className="mt-2 break-all font-mono text-[10px] text-slate-500">0xE0CB...e0A254 · {brateSymbol ?? 'BRATE'} · 8 decimals</p><p className="mt-1 text-[10px] text-slate-500">Supply: {brateSupply ?? '—'} · Owner: {brateOwnerLabel}</p></div><a href="https://basescan.org/token/0xE0CB06A00524180fFbAE005d1010531b99e0A254" target="_blank" rel="noreferrer" className="text-xs font-semibold text-[#58a6ff] hover:underline">View on BaseScan</a></div></section>
    <section className="rounded-3xl border border-amber-300/20 bg-amber-300/[0.05] p-5 sm:p-7"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-200">Daily utility drop</p><p className="mt-2 text-lg font-bold text-white">Community supply crate</p><p className="mt-2 text-xs leading-5 text-slate-400">A small participation bonus for returning miners. No cash value or guaranteed future reward.</p></div><Sparkles className="size-5 shrink-0 text-amber-300" /></div><div className="mt-6 flex items-center justify-between rounded-xl border border-amber-300/15 bg-black/10 px-4 py-3"><span className="text-sm font-semibold text-amber-100">+10 CMR points</span><Button type="button" size="sm" onClick={claimDrop} disabled={dropClaimed} className="rounded-lg bg-amber-300 font-bold text-slate-950 hover:bg-amber-200">{dropClaimed ? 'Claimed' : 'Claim drop'}</Button></div></section>
    <section className="rounded-3xl border border-cyan-300/20 bg-cyan-300/[0.045] p-5 sm:p-7"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Community invite</p><p className="mt-2 text-lg font-bold text-white">Grow the network, keep it free</p><p className="mt-2 max-w-xl text-xs leading-5 text-slate-400">Invite friends with a personal link. You receive a transparent 5% participation bonus on their earned points, and they receive the same free access. No purchase, deposit, or payment is required.</p></div><Copy className="size-5 shrink-0 text-cyan-300" aria-hidden="true" /></div><div className="mt-5 flex flex-col gap-3 sm:flex-row"><input readOnly value={inviteLink} aria-label="Personal invitation link" className="h-11 min-w-0 flex-1 rounded-xl border border-white/[0.09] bg-[#0b0f17] px-3 text-xs text-slate-300 outline-none" /><Button type="button" size="sm" onClick={copyInviteLink} className="h-11 rounded-xl bg-cyan-300 font-bold text-slate-950 hover:bg-cyan-200"><Copy data-icon="inline-start" />{inviteCopied ? 'Copied' : 'Copy invite link'}</Button></div><p className="mt-4 text-[11px] leading-5 text-slate-500">Fair-use limit: referral bonuses are capped at 5% of verified participation and are not redeemable for cash. Abuse, self-referrals, and automated activity are excluded.</p></section>
    <section className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-5 sm:p-7"><div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Rig performance</p><p className="mt-2 text-lg font-bold text-white">Network contribution</p></div><span className="rounded-lg bg-cyan-300/10 p-2 text-cyan-300"><Zap className="size-4" /></span></div><div className="mt-7 flex h-36 items-end gap-1.5">{[38,52,44,70,58,76,64,84,72,91,78,96,87,100,90,94,82,98,88,100].map((height, index) => <div key={index} className="flex-1 rounded-t-sm bg-gradient-to-t from-cyan-300/20 to-cyan-300" style={{ height: `${height}%`, opacity: index > 15 ? 1 : 0.58 }} />)}</div><div className="mt-5 flex items-center justify-between text-xs"><span className="text-slate-500">Last 24 hours</span><span className="font-semibold text-emerald-300">+12.4% <ArrowUpRight className="inline size-3" /></span></div><button type="button" onClick={() => setActiveView('Shop')} className="mt-6 flex w-full items-center justify-between rounded-xl border border-white/[0.08] px-4 py-3 text-sm text-slate-300 transition hover:border-cyan-300/30 hover:text-white"><span className="flex items-center gap-2"><Sparkles className="size-4 text-amber-300" />Scale your rig</span><ArrowUpRight className="size-4 text-slate-500" /></button></section>
  </div>
}

function Metric({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Gauge }) { return <div className="flex items-center gap-2"><Icon className="hidden size-4 text-slate-600 sm:block" /><div><p className="text-[10px] uppercase tracking-wider text-slate-600">{label}</p><p className="mt-1 text-xs font-bold text-slate-200 sm:text-sm">{value}</p></div></div> }

function ShopView({ balance, ownedUpgrades, buyUpgrade }: { balance: number; ownedUpgrades: string[]; buyUpgrade: (name: string, price: number) => void }) { return <section><div className="mb-5 flex items-end justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Hardware market</p><h2 className="mt-2 text-2xl font-black text-white">Build your advantage</h2></div><div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-xs text-slate-400"><CircleDollarSign className="size-4 text-emerald-300" />{formatTokens(balance)} CMR</div></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{upgrades.map((item) => { const Icon = item.icon; const owned = ownedUpgrades.includes(item.name); const canBuy = balance >= item.price; return <article key={item.name} className="group rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5 transition hover:-translate-y-1 hover:border-cyan-300/30"><div className={`mb-8 flex size-12 items-center justify-center rounded-2xl ${item.tone === 'cyan' ? 'bg-cyan-300/10 text-cyan-300' : item.tone === 'green' ? 'bg-emerald-300/10 text-emerald-300' : item.tone === 'violet' ? 'bg-violet-300/10 text-violet-300' : 'bg-amber-300/10 text-amber-300'}`}><Icon className="size-6" /></div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{item.type}</p><h3 className="mt-2 text-lg font-bold text-white">{item.name}</h3><div className="mt-5 flex flex-col gap-3 border-y border-white/[0.07] py-4 text-xs"><span className="flex justify-between text-slate-500">Hashrate <b className="text-emerald-300">{item.boost}</b></span><span className="flex justify-between text-slate-500">Energy <b className="text-slate-300">{item.energy}</b></span></div><div className="mt-5 flex items-center justify-between"><span className="font-bold text-white">{item.price} <span className="text-xs font-medium text-slate-500">CMR</span></span><Button size="sm" disabled={owned || !canBuy} onClick={() => buyUpgrade(item.name, item.price)} className="rounded-lg bg-white/10 text-white hover:bg-cyan-300 hover:text-slate-950">{owned ? <><Check data-icon="inline-start" />Owned</> : 'Buy upgrade'}</Button></div></article> })}</div></section> }

function WalletView({ balance, amount, setAmount, address, setAddress, network, setNetwork, withdraw }: { balance: number; amount: string; setAmount: (value: string) => void; address: string; setAddress: (value: string) => void; network: string; setNetwork: (value: string) => void; withdraw: () => void }) { return <section className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-[0.85fr_1.15fr]"><div className="rounded-3xl border border-cyan-300/20 bg-gradient-to-br from-cyan-300/15 via-white/[0.04] to-transparent p-6 sm:p-8"><div className="flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">Available balance</p><Wallet className="size-5 text-cyan-300" /></div><p className="mt-10 text-4xl font-black text-white">{formatTokens(balance)} <span className="text-sm font-bold text-cyan-300">CMR</span></p><p className="mt-2 text-xs text-slate-500">Rewards available to withdraw</p><div className="mt-10 flex items-center gap-2 text-xs text-slate-400"><LockKeyhole className="size-3.5 text-emerald-300" /> Non-custodial wallet layer</div></div><div className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-6 sm:p-8"><div className="mb-6"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Withdraw rewards</p><h2 className="mt-2 text-xl font-bold text-white">Send CMR to your wallet</h2></div><div className="flex flex-col gap-4"><label className="text-xs font-semibold text-slate-400">Target wallet address<input value={address} onChange={(event) => setAddress(event.target.value)} placeholder="0x... or wallet address" className="mt-2 h-12 w-full rounded-xl border border-white/[0.09] bg-[#0b0f17] px-4 text-sm text-white outline-none placeholder:text-slate-700 focus:border-cyan-300/50" /></label><label className="text-xs font-semibold text-slate-400">Network<select value={network} onChange={(event) => setNetwork(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-white/[0.09] bg-[#0b0f17] px-4 text-sm text-white outline-none focus:border-cyan-300/50"><option>Ethereum</option><option>Polygon</option><option>Solana</option></select></label><label className="text-xs font-semibold text-slate-400">Amount<input value={amount} onChange={(event) => setAmount(event.target.value)} type="number" min="0" step="0.01" placeholder="0.00" className="mt-2 h-12 w-full rounded-xl border border-white/[0.09] bg-[#0b0f17] px-4 text-sm text-white outline-none placeholder:text-slate-700 focus:border-cyan-300/50" /></label><Button onClick={withdraw} className="h-12 rounded-xl bg-cyan-300 font-bold text-slate-950 hover:bg-cyan-200"><ArrowDownToLine data-icon="inline-start" />Withdraw</Button><p className="flex items-center gap-2 text-[11px] text-slate-600"><LockKeyhole className="size-3" /> Withdrawals are simulated for Proof-of-Participation points.</p></div></div></section> }

function GovernanceView() {
  const [votes, setVotes] = useState<Record<string, 'for' | 'against'>>({})
  const [submitted, setSubmitted] = useState(false)
  const proposals = [
    { id: 'p-01', title: 'Activate community grant round', detail: 'Allocate testnet participation points for verified Gang Banana community proposals.', status: 'Voting open', forVotes: 68, againstVotes: 12, quorum: '80 / 100 CMR' },
    { id: 'p-02', title: 'Approve CloudMiner OS pilot cohort', detail: 'Invite the first five audited node operators to the closed testnet pilot.', status: 'Review', forVotes: 44, againstVotes: 6, quorum: '50 / 100 CMR' },
    { id: 'p-03', title: 'Adopt the mainnet readiness checklist', detail: 'Require audited consensus, wallet recovery, peer discovery and genesis release before launch.', status: 'Voting open', forVotes: 91, againstVotes: 3, quorum: '94 / 100 CMR' },
  ]
  const castVote = (id: string, choice: 'for' | 'against') => { setVotes((current) => ({ ...current, [id]: choice })); setSubmitted(true) }
  return <section className="mx-auto flex min-w-0 max-w-6xl flex-col gap-5"><div className="rounded-3xl border border-emerald-300/20 bg-gradient-to-br from-emerald-300/15 via-white/[0.04] to-transparent p-6 sm:p-8"><div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div className="min-w-0"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-emerald-200"><Vote className="size-4" /> CloudMiner governance</p><h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">Decide before we deploy.</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">A transparent testnet voting layer for Gang Banana, CloudMiner OS and CloudChain. CMR is used here as non-financial participation weight.</p></div><div className="rounded-2xl border border-emerald-300/20 bg-black/10 px-4 py-3"><p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Your voting power</p><p className="mt-1 font-mono text-lg font-bold text-emerald-200">0 CMR</p><p className="text-[10px] text-slate-500">Connect and verify activity</p></div></div></div><div className="flex flex-wrap gap-2 rounded-2xl border border-amber-300/20 bg-amber-300/[0.05] p-4 text-xs leading-5 text-amber-100/75"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-amber-200" /><span><strong className="text-amber-100">Testnet only:</strong> Votes are local preview state, have no financial value and do not execute token transfers. Mainnet governance remains locked until audit and explicit deployment approval.</span></div>{submitted && <div role="status" className="rounded-xl border border-cyan-300/20 bg-cyan-300/[0.06] px-4 py-3 text-sm text-cyan-100">Vote recorded in this testnet preview. No transaction was signed.</div>}<div className="grid gap-4">{proposals.map((proposal) => { const vote = votes[proposal.id]; const total = proposal.forVotes + proposal.againstVotes; const forWidth = `${Math.round((proposal.forVotes / total) * 100)}%`; return <article key={proposal.id} className="min-w-0 rounded-3xl border border-white/[0.08] bg-white/[0.035] p-5 sm:p-7"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="font-mono text-[10px] text-emerald-300">{proposal.id}</span><span className="rounded-full border border-white/10 px-2 py-1 text-[10px] font-bold text-slate-400">{proposal.status}</span></div><h3 className="mt-3 break-words text-xl font-bold text-white">{proposal.title}</h3><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{proposal.detail}</p></div><div className="shrink-0 text-left sm:text-right"><p className="text-[10px] uppercase tracking-[0.18em] text-slate-600">Quorum</p><p className="mt-1 font-mono text-sm font-bold text-slate-300">{proposal.quorum}</p></div></div><div className="mt-6"><div className="flex items-center justify-between text-xs"><span className="text-emerald-300">For {proposal.forVotes}</span><span className="text-rose-300">Against {proposal.againstVotes}</span></div><div className="mt-2 flex h-2 overflow-hidden rounded-full bg-rose-300/25"><span className="bg-emerald-300" style={{ width: forWidth }} /></div></div><div className="mt-5 flex flex-col gap-2 sm:flex-row"><Button type="button" onClick={() => castVote(proposal.id, 'for')} disabled={proposal.status !== 'Voting open'} className={`h-11 flex-1 rounded-xl font-bold ${vote === 'for' ? 'bg-emerald-200 text-slate-950' : 'bg-emerald-300/15 text-emerald-200 hover:bg-emerald-300/25'}`}>Vote for{vote === 'for' ? ' · selected' : ''}</Button><Button type="button" onClick={() => castVote(proposal.id, 'against')} disabled={proposal.status !== 'Voting open'} className={`h-11 flex-1 rounded-xl font-bold ${vote === 'against' ? 'bg-rose-200 text-slate-950' : 'bg-rose-300/10 text-rose-200 hover:bg-rose-300/20'}`}>Vote against{vote === 'against' ? ' · selected' : ''}</Button></div></article> })}</div><div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 text-xs leading-5 text-slate-500">Mainnet gate: audited consensus, replay protection, wallet recovery, Sybil resistance, proposal timelocks, public source code and an explicit community approval process.</div></section>
}

function EcosystemView() {
  const characters = [
    ['Subject Beta', 'Code-Breaker', 'https://github.com/user-attachments/assets/985707a6-25e6-4b44-b9a5-26231f77b1a3'],
    ['Spike', 'Cactus ally', 'https://github.com/user-attachments/assets/521405e9-81ad-4745-b834-2762098fee0b'],
    ['Bruce “The Veg” Shark', 'Community protector', 'https://github.com/user-attachments/assets/827813fa-6538-47e5-b200-baecc871b2f3'],
    ['Cherry Bomb', 'Security chief', 'https://github.com/user-attachments/assets/837ee464-65af-4403-ba89-c7c9fe0b85eb'],
  ]
  const links = [['Jakaral United', 'https://jkuspot.com/'], ['Community portal', 'https://linktr.ee/JakaralUnited2024'], ['BRATE on BaseScan', 'https://basescan.org/token/0xE0CB06A00524180fFbAE005d1010531b99e0A254'], ['Source issue', 'https://github.com/Eximal/Gang-Banana-s-/issues/1']]
  return <section className="mx-auto flex min-w-0 max-w-6xl flex-col gap-5"><div className="overflow-hidden rounded-3xl border border-amber-300/20 bg-gradient-to-br from-amber-300/20 via-rose-300/[0.08] to-transparent p-6 sm:p-8"><div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end"><div><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-200"><Globe2 className="size-4" /> Gang Banana ecosystem</p><h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl">One story. One community. Many connected worlds.</h2><p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">The dashboard connects the Gang Banana story, Jakaral United, BRATE on Base, CloudMiner OS and the CloudChain testnet concept.</p><div className="mt-6 flex flex-wrap gap-2"><span className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-2 text-xs font-semibold text-emerald-200">BRATE live on Base</span><span className="rounded-full border border-violet-300/25 bg-violet-300/10 px-3 py-2 text-xs font-semibold text-violet-200">CloudChain testnet</span><span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-2 text-xs font-semibold text-cyan-200">Miner OS</span></div></div><img src="https://github.com/user-attachments/assets/2a19c0a5-6f71-4f9e-8655-bf2f0422ccee" alt="Gang Banana ecosystem artwork" className="h-56 w-full rounded-2xl border border-white/10 object-cover sm:h-72" /></div></div><div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]"><article className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-5 sm:p-7"><p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">The saga</p><h3 className="mt-2 text-xl font-bold text-white">From Banana-Tech to a connected community</h3><div className="mt-6 grid gap-3 sm:grid-cols-3">{[['01', 'Origin', 'Subject Beta escapes Banana-Tech.'], ['02', 'Alliance', 'Spike, Bruce and the crew build trust.'], ['03', 'Nation', 'Jakaral United connects digital projects with real people.']].map(([n, title, text]) => <div key={n} className="rounded-2xl border border-white/[0.07] bg-black/10 p-4"><p className="font-mono text-xs text-amber-300">{n}</p><p className="mt-3 font-bold text-white">{title}</p><p className="mt-2 text-xs leading-5 text-slate-500">{text}</p></div>)}</div></article><article className="rounded-3xl border border-cyan-300/15 bg-cyan-300/[0.04] p-5 sm:p-7"><p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Connected layers</p><div className="mt-5 space-y-3">{['BRATE balance and Base verification', 'CMR participation points', 'Safe worker and node controls', 'Story, links and shared identity'].map((text) => <div key={text} className="flex items-center gap-3 rounded-xl border border-white/[0.07] p-3"><Check className="size-4 text-emerald-300" /><span className="text-sm text-slate-300">{text}</span></div>)}</div></article></div><div className="grid gap-4 sm:grid-cols-2">{characters.map(([name, role, image]) => <article key={name} className="flex min-w-0 gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4"><img src={image} alt={`${name} artwork`} className="size-20 shrink-0 rounded-xl object-cover" /><div className="min-w-0"><p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-300">{role}</p><h3 className="mt-1 break-words text-lg font-bold text-white">{name}</h3><p className="mt-2 text-xs text-slate-500">Gang Banana story character and ecosystem role.</p></div></article>)}</div><article className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-5 sm:p-7"><p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Verified portals</p><div className="mt-5 grid gap-3 sm:grid-cols-2">{links.map(([title, href]) => <a key={title} href={href} target="_blank" rel="noreferrer" className="flex min-h-14 items-center justify-between rounded-xl border border-white/[0.08] px-4 py-3 hover:border-cyan-300/40"><span className="truncate text-sm font-semibold text-white">{title}</span><ArrowUpRight className="size-4 shrink-0 text-cyan-300" /></a>)}</div></article><div className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.05] p-4 text-xs leading-5 text-amber-100/75"><strong className="text-amber-100">Safety boundary:</strong> The ecosystem links narrative and verified portals; it does not execute trades, promise returns, or mint tokens.</div></section>
}

function CloudChainView() {
  return <section className="mx-auto flex max-w-6xl flex-col gap-5"><div className="rounded-3xl border border-violet-300/20 bg-violet-300/[0.08] p-6 sm:p-8"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-violet-200"><Blocks className="size-4" /> CloudChain testnet</p><h2 className="mt-3 text-3xl font-black text-white">A staged native network concept.</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">CLOUD is a planned native coin for a future audited network. The current app is a control plane only and does not run a blockchain node or mint real coins.</p></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[['Chain ID', 'CM-2026-TESTNET'], ['Native coin', 'CLOUD'], ['Consensus', 'Proof of Participation'], ['Block target', '60 seconds']].map(([label, value]) => <div key={label} className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5"><p className="text-[10px] uppercase tracking-[0.18em] text-slate-600">{label}</p><p className="mt-2 break-words font-mono text-sm font-bold text-slate-200">{value}</p></div>)}</div><div className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.05] p-4 text-xs leading-5 text-amber-100/75"><strong className="text-amber-100">Not live yet:</strong> A real CloudChain needs audited node software, genesis release, peer discovery, wallet tooling and tested consensus before public launch.</div></section>
}

function MinerOsView({ isMining, setIsMining }: { isMining: boolean; setIsMining: (value: boolean) => void }) {
  const [autoStart, setAutoStart] = useState(true)
  const [safeMode, setSafeMode] = useState(true)
  const checks = ['Base network adapter', 'Non-custodial wallet layer', 'Mining worker sandbox', 'Automatic update channel']

  return <section className="mx-auto flex max-w-6xl flex-col gap-5">
    <div className="flex flex-col gap-4 rounded-3xl border border-cyan-300/20 bg-gradient-to-br from-cyan-300/15 via-white/[0.04] to-transparent p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between"><div><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-cyan-200"><ServerCog className="size-4" /> CloudMiner OS</p><h2 className="mt-3 text-3xl font-black tracking-tight text-white">A focused system for your miner.</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">A locked-down Linux-based package concept: kiosk mode, safe wallet boundaries, automatic worker start and one consistent mining standard.</p></div><span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-2 text-xs font-bold text-emerald-200"><span className="size-2 rounded-full bg-emerald-300" />Package ready</span></div>
    <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]"><article className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-6 sm:p-8"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">System checks</p><h3 className="mt-2 text-xl font-bold text-white">Secure mining baseline</h3></div><ShieldCheck className="size-6 text-emerald-300" /></div><div className="mt-6 space-y-3">{checks.map((check) => <div key={check} className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-black/10 px-4 py-3"><span className="text-sm text-slate-300">{check}</span><Check className="size-4 text-emerald-300" aria-label="Ready" /></div>)}</div></article><article className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-6 sm:p-8"><p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Runtime controls</p><div className="mt-5 space-y-3"><button type="button" onClick={() => setAutoStart(!autoStart)} className="flex min-h-12 w-full items-center justify-between rounded-xl border border-white/[0.08] px-4 text-left"><span><span className="block text-sm font-semibold text-white">Auto-start worker</span><span className="text-xs text-slate-500">Start after boot</span></span><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${autoStart ? 'bg-emerald-300/15 text-emerald-200' : 'bg-white/10 text-slate-500'}`}>{autoStart ? 'ON' : 'OFF'}</span></button><button type="button" onClick={() => setSafeMode(!safeMode)} className="flex min-h-12 w-full items-center justify-between rounded-xl border border-white/[0.08] px-4 text-left"><span><span className="block text-sm font-semibold text-white">Wallet safe mode</span><span className="text-xs text-slate-500">Never stores private keys</span></span><span className="rounded-full bg-emerald-300/15 px-2 py-1 text-[10px] font-bold text-emerald-200">{safeMode ? 'ON' : 'OFF'}</span></button><Button type="button" onClick={() => setIsMining(!isMining)} className="mt-2 h-12 w-full rounded-xl bg-cyan-300 font-bold text-slate-950 hover:bg-cyan-200">{isMining ? 'Stop worker' : 'Start worker'}</Button></div></article></div>
    <div className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.05] p-4 text-xs leading-5 text-amber-100/75"><strong className="text-amber-100">Deployment note:</strong> This is the control plane and package specification inside CloudMiner. A bootable ISO, signed updates and hardware drivers still require a separate Linux image build and release pipeline; no private key or unattended minting is included.</div>
  </section>
}

function ProfileView({ address, isConnected, balance }: { address?: `0x${string}`; isConnected: boolean; balance: number }) {
  const [searchAddress, setSearchAddress] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState('Nebula Scout')
  const avatars = [
    { name: 'Nebula Scout', rarity: 'Common', price: 0, color: 'from-cyan-300 to-blue-500' },
    { name: 'Circuit Warden', rarity: 'Rare', price: 50, color: 'from-emerald-300 to-teal-500' },
    { name: 'Quantum Fox', rarity: 'Epic', price: 250, color: 'from-violet-300 to-fuchsia-500' },
  ]
  const walletLabel = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Wallet not connected'
  const searched = searchAddress.trim()
  const validSearch = /^0x[a-fA-F0-9]{40}$/.test(searched)

  return <section className="mx-auto flex max-w-6xl flex-col gap-5">
    <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <article className="rounded-3xl border border-cyan-300/20 bg-gradient-to-br from-cyan-300/15 via-white/[0.04] to-transparent p-6 sm:p-8">
        <div className={`mx-auto flex size-28 items-center justify-center rounded-[2rem] bg-gradient-to-br ${avatars.find((avatar) => avatar.name === selectedAvatar)?.color} text-4xl font-black text-slate-950 shadow-[0_0_42px_rgba(34,211,238,0.25)]`}>{selectedAvatar.slice(0, 1)}</div>
        <p className="mt-6 text-center text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">Wallet identity</p>
        <h2 className="mt-2 text-center text-2xl font-black text-white">{selectedAvatar}</h2>
        <p className="mt-2 text-center font-mono text-xs text-slate-500">{walletLabel}</p>
        <div className="mt-6 grid grid-cols-2 gap-3 text-center"><div className="rounded-xl border border-white/[0.08] bg-black/10 p-3"><p className="text-lg font-bold text-white">{formatTokens(balance)}</p><p className="text-[10px] uppercase tracking-wider text-slate-500">CMR balance</p></div><div className="rounded-xl border border-white/[0.08] bg-black/10 p-3"><p className="text-lg font-bold text-emerald-300">{isConnected ? 'Verified' : 'Offline'}</p><p className="text-[10px] uppercase tracking-wider text-slate-500">Wallet status</p></div></div>
      </article>
      <article className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-6 sm:p-8"><div><p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">Avatar exchange</p><h2 className="mt-2 text-2xl font-black text-white">Collect your identity</h2><p className="mt-2 text-sm leading-6 text-slate-400">Trade participation points for cosmetic profile avatars. No purchases, transfers, or financial value are involved.</p></div><div className="mt-6 grid gap-3 sm:grid-cols-3">{avatars.map((avatar) => { const selected = selectedAvatar === avatar.name; const canClaim = balance >= avatar.price; return <button key={avatar.name} type="button" onClick={() => canClaim && setSelectedAvatar(avatar.name)} disabled={!canClaim} className={`rounded-2xl border p-4 text-left transition ${selected ? 'border-cyan-300/60 bg-cyan-300/10' : 'border-white/[0.08] bg-black/10 hover:border-cyan-300/30'} ${!canClaim ? 'cursor-not-allowed opacity-45' : ''}`}><div className={`flex size-11 items-center justify-center rounded-xl bg-gradient-to-br ${avatar.color} font-bold text-slate-950`}>{avatar.name.slice(0, 1)}</div><p className="mt-3 text-sm font-bold text-white">{avatar.name}</p><p className="mt-1 text-[10px] uppercase tracking-wider text-slate-500">{avatar.rarity}</p><p className="mt-3 text-xs font-bold text-cyan-200">{avatar.price === 0 ? 'Free' : `${avatar.price} CMR`}</p></button> })}</div></article>
    </div>
    <article className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-6 sm:p-8"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Public wallet directory</p><h2 className="mt-2 text-xl font-bold text-white">Find a miner profile</h2><p className="mt-2 text-sm text-slate-400">Only public wallet and cosmetic profile data is shown. Never share a seed phrase.</p></div><div className="flex w-full max-w-md gap-2"><div className="relative flex-1"><Search className="pointer-events-none absolute left-3 top-3.5 size-4 text-slate-600" /><input value={searchAddress} onChange={(event) => setSearchAddress(event.target.value)} placeholder="0x wallet address" aria-label="Search wallet address" className="h-11 w-full rounded-xl border border-white/[0.09] bg-[#0b0f17] pl-10 pr-3 text-xs text-white outline-none placeholder:text-slate-700 focus:border-cyan-300/50" /></div><Button type="button" variant="outline" className="h-11 rounded-xl border-cyan-300/30 text-cyan-200" disabled={!validSearch}>View</Button></div></div>{searched && !validSearch && <p className="mt-3 text-xs text-amber-300">Enter a valid EVM wallet address to search.</p>}{validSearch && <div className="mt-5 rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.05] p-4"><p className="text-xs font-bold text-cyan-200">Public profile found</p><p className="mt-2 font-mono text-xs text-slate-300">{searched.slice(0, 10)}...{searched.slice(-8)}</p><p className="mt-2 text-xs text-slate-500">Avatar and public participation details become visible after the wallet owner creates a profile.</p></div>}</article>
  </section>
}

function WhitepaperView() {
  return (
    <article className="mx-auto flex max-w-5xl flex-col gap-5">
      <header className="rounded-3xl border border-cyan-300/20 bg-gradient-to-br from-cyan-300/10 via-white/[0.04] to-transparent p-6 sm:p-9">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-300">CloudMiner protocol / v1.0</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl">Proof of Participation</h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">A transparent participation layer for the Jakaral United ecosystem: activity becomes measurable points, points create utility, and utility is designed to flow back into the community.</p>
        <div className="mt-6 rounded-2xl border border-amber-300/20 bg-amber-300/[0.06] p-4 text-xs leading-6 text-amber-100/80"><strong className="text-amber-200">Important:</strong> CMR is currently an in-app participation point. It is not proof of ownership, a deposit, an investment product, or a promise of future financial value. Any future blockchain deployment requires a separate audit, legal review, published contract, and explicit user consent.</div>
      </header>
      <div className="grid gap-5 lg:grid-cols-2">
        <WhitepaperSection title="1. Entstehung des Coins" eyebrow="Origin" text="CMR entsteht nicht durch echte Geräte- oder Browser-Rechenleistung. Ein serverseitig validierter Mining-Zyklus zeichnet freiwillige Teilnahme auf und vergibt eine nachvollziehbare Punktmenge. Die Basisrate, Zyklusdauer, Streaks und Multiplikatoren werden als öffentliche Produktregeln dokumentiert und können nicht heimlich aus dem Client verändert werden." />
        <WhitepaperSection title="2. Technische Umsetzung" eyebrow="Implementation" text="Die App trennt Oberfläche, API und Datenmodell. Der Server prüft Session oder Wallet-Kontext, Startzeit, Zyklusstatus und Limits. Ereignisse werden unveränderlich protokolliert; Eingaben werden validiert. Festgelegte Umrechnung: 1 verifizierter CMR-Punkt entspricht 1 BRATE-Claim-Einheit. Es gibt keinen Mindestbetrag; Claims werden nur einmal und nur für tatsächlich verifizierte Punkte zugelassen. Wallet-Adressen werden niemals als private Schlüssel behandelt." />
        <WhitepaperSection title="3. Sicherheitskonformes Verhalten" eyebrow="Security" text="Keine Seed-Phrase und kein Private Key wird abgefragt oder gespeichert. Der Claim wird serverseitig berechnet, mit einer eindeutigen Claim-ID und Replay-Schutz gespeichert und erst nach Wallet-Bestätigung ausgeführt. Die App signiert keine Transaktion heimlich. Der aktuelle BRATE-Contract wird ausschließlich für Balance-Lesen genutzt; eine Auszahlung startet erst nach separater Claim-/Distributor-Prüfung, Rollenprüfung, Testnet-Test und Audit. Rate-Limits, serverseitige Zeit, Moderationspfade und transparente Fehler sind verpflichtend." />
        <WhitepaperSection title="4. Kreislauf und Nutzen" eyebrow="Utility loop" text="Teilnahme erzeugt Punkte. Punkte können innerhalb der App Status, kosmetische Freischaltungen, Community-Zugänge oder Rabatte auf klar beschriebene Leistungen ermöglichen. Einnahmen und Ressourcen des Ökosystems sollten nachvollziehbar dokumentiert werden; keine Funktion darf eine Rendite oder einen Marktpreis versprechen." />
        <WhitepaperSection title="5. MMORPG-Vision" eyebrow="Game layer" text="Das MMORPG kann die gleiche Identität und den gleichen Fortschritt nutzen: Spieler erkunden Regionen, erfüllen kooperative Quests, bauen Gemeinschaften auf und sammeln nicht-finanzielle Fortschrittswerte. CMR kann später für kosmetische Gegenstände, Housing-Dekoration, Crafting-Rezepte, Emotes, Mount-Skins oder saisonale Events eingesetzt werden." />
        <WhitepaperSection title="6. Faire In-Game-Ökonomie" eyebrow="Game economy" text="Gameplay bleibt auch ohne Kauf vollständig spielbar. Gegenstände werden nach Seltenheit, Nutzwert und Herkunft gekennzeichnet; Zufallsboxen mit bezahltem Vorteil werden vermieden. Handel, falls aktiviert, erhält Gebührenlimits, Betrugsschutz, Rückerstattungsregeln und eine klare Trennung zwischen kosmetischem Besitz und echtem Vermögenswert." />
      </div>
      <section className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">Roadmap</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{['Festgelegt: 1 CMR = 1 BRATE, kein Mindestbetrag', 'Claim: Distributor, Replay-Schutz, Rollenprüfung, Audit', 'World: MMORPG-Prototyp, Quests, Items', 'Utility: Governance und geprüfte Onchain-Nutzung'].map((phase, index) => <div key={phase} className="rounded-2xl border border-white/[0.08] bg-[#0b0f17]/70 p-4"><p className="text-xs font-bold text-emerald-300">0{index + 1}</p><p className="mt-3 text-sm font-semibold leading-6 text-slate-200">{phase}</p></div>)}</div>
      </section>
      <footer className="rounded-3xl border border-cyan-300/15 bg-cyan-300/[0.04] p-5 text-xs leading-6 text-slate-400 sm:p-6">
        <p className="font-semibold text-slate-200">Copyright und Urheberhinweis</p>
        <p className="mt-2">© 2024–2026 Jakaral United Estab. Alle Rechte vorbehalten. CloudMiner, das Proof-of-Participation-Konzept, die App-Architektur, Texte und die geplante Spielwelt sind Entwicklungsarbeiten von Marco Budo Schenk, CEO und Developer von Jakaral United Estab.</p>
        <p className="mt-2">Technische Assistenz durch KI ändert nichts an der menschlichen Verantwortung, Urheberschaft oder den Rechten des Projektträgers. Nutzung, Vervielfältigung oder kommerzielle Verwertung nur mit ausdrücklicher Genehmigung. Dieser Hinweis ist eine Produktinformation und ersetzt keine rechtliche Marken- oder Urheberrechtsberatung.</p>
      </footer>
    </article>
  )
}

function WhitepaperSection({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return <section className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-6"><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">{eyebrow}</p><h3 className="mt-2 text-lg font-bold text-white">{title}</h3><p className="mt-3 text-sm leading-7 text-slate-400">{text}</p></section>
}

export default CloudMinerApp
