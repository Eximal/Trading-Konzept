import { isAddress, type Address } from 'viem'
import { base, bsc, mainnet, monad } from 'wagmi/chains'

/**
 * Minimal ABIs — only what the dashboard reads.
 */
export const erc20Abi = [
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'decimals',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
  },
  {
    type: 'function',
    name: 'symbol',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
  },
] as const

export const erc721Abi = [
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const

export type AssetKey = 'jku' | 'ent' | 'nft'

/**
 * Addresses are env-configurable per chain. Anything unset simply renders as
 * "not deployed" instead of breaking the dashboard.
 *
 * NEXT_PUBLIC_JKU_TOKEN_BASE / _MONAD / _BSC
 * NEXT_PUBLIC_ENT_TOKEN_BASE / _MONAD / _BSC
 * NEXT_PUBLIC_JKU_NFT_BASE   / _MONAD / _BSC
 */
const RAW_ADDRESSES: Record<AssetKey, Record<number, string | undefined>> = {
  jku: {
    [base.id]: process.env.NEXT_PUBLIC_JKU_TOKEN_BASE ?? '0x4f3edeac4db4a2ceec7a0eeaa2255e0e7296b9e6',
    [monad.id]: process.env.NEXT_PUBLIC_JKU_TOKEN_MONAD,
    [bsc.id]: process.env.NEXT_PUBLIC_JKU_TOKEN_BSC ?? '0x9cddeccd72065255bb5affb2da1221fc67f37b07',
  },
  ent: {
    [base.id]: process.env.NEXT_PUBLIC_ENT_TOKEN_BASE,
    [monad.id]: process.env.NEXT_PUBLIC_ENT_TOKEN_MONAD ?? '0x08a636cb63b7a63a232b074ea3591b4d64396b07',
    [bsc.id]: process.env.NEXT_PUBLIC_ENT_TOKEN_BSC,
    [mainnet.id]: process.env.NEXT_PUBLIC_ENT_TOKEN_ETH ?? '0x21ced94a7f27eff5bbe019a9f47a67785507eb07',
  },
  nft: {
    [base.id]: process.env.NEXT_PUBLIC_JKU_NFT_BASE,
    [monad.id]: process.env.NEXT_PUBLIC_JKU_NFT_MONAD,
    [bsc.id]: process.env.NEXT_PUBLIC_JKU_NFT_BSC,
  },
}

export function getAssetAddress(
  asset: AssetKey,
  chainId?: number,
): Address | undefined {
  if (!chainId) return undefined
  const value = RAW_ADDRESSES[asset][chainId]
  if (!value || !isAddress(value)) return undefined
  return value as Address
}

export const MINING_CONTRACT_ADDRESS = ((): Address | undefined => {
  const value = process.env.NEXT_PUBLIC_MINING_CONTRACT
  return value && isAddress(value) ? (value as Address) : undefined
})()
