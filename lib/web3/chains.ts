import { base, bsc, mainnet, monad } from 'wagmi/chains'

export const SUPPORTED_CHAINS = [base, monad, bsc, mainnet] as const

export type SupportedChainId = (typeof SUPPORTED_CHAINS)[number]['id']

type ChainMeta = {
  label: string
  short: string
  /** Tailwind classes for the network badge */
  badge: string
}

export const CHAIN_META: Record<number, ChainMeta> = {
  [base.id]: {
    label: 'Base',
    short: 'BASE',
    badge: 'bg-[#58a6ff]/12 text-[#58a6ff] ring-[#58a6ff]/30',
  },
  [monad.id]: {
    label: 'Monad',
    short: 'MON',
    badge: 'bg-[#a5b4fc]/12 text-[#a5b4fc] ring-[#a5b4fc]/30',
  },
  [bsc.id]: {
    label: 'BNB Chain',
    short: 'BNB',
    badge: 'bg-[#f0b90b]/12 text-[#f0b90b] ring-[#f0b90b]/30',
  },
  [mainnet.id]: {
    label: 'Ethereum',
    short: 'ETH',
    badge: 'bg-[#627eea]/12 text-[#8da2ff] ring-[#627eea]/30',
  },
}

export function getChainMeta(chainId?: number): ChainMeta {
  if (chainId && CHAIN_META[chainId]) return CHAIN_META[chainId]
  return {
    label: 'Unsupported',
    short: 'N/A',
    badge: 'bg-destructive/12 text-destructive ring-destructive/30',
  }
}

export function isSupportedChain(chainId?: number): chainId is SupportedChainId {
  return !!chainId && SUPPORTED_CHAINS.some((chain) => chain.id === chainId)
}
