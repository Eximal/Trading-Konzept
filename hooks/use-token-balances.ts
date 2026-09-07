'use client'

import { useMemo } from 'react'
import { formatUnits } from 'viem'
import { useAccount, useReadContracts } from 'wagmi'
import { erc20Abi, erc721Abi, getAssetAddress } from '@/lib/web3/contracts'

export type AssetBalance = {
  key: 'jku' | 'ent' | 'nft'
  symbol: string
  amount: number
  configured: boolean
}

/**
 * Reads the connected wallet's $JKU / $ENT / NFT balances on the active chain.
 * Any asset without a configured address on that chain resolves to
 * `configured: false` instead of throwing.
 */
export function useTokenBalances() {
  const { address, chainId } = useAccount()

  const jkuAddress = getAssetAddress('jku', chainId)
  const entAddress = getAssetAddress('ent', chainId)
  const nftAddress = getAssetAddress('nft', chainId)

  const contracts = useMemo(() => {
    if (!address) return []
    const calls = []
    if (jkuAddress) {
      calls.push(
        { address: jkuAddress, abi: erc20Abi, functionName: 'balanceOf', args: [address], chainId } as const,
        { address: jkuAddress, abi: erc20Abi, functionName: 'decimals', chainId } as const,
      )
    }
    if (entAddress) {
      calls.push(
        { address: entAddress, abi: erc20Abi, functionName: 'balanceOf', args: [address], chainId } as const,
        { address: entAddress, abi: erc20Abi, functionName: 'decimals', chainId } as const,
      )
    }
    if (nftAddress) {
      calls.push({ address: nftAddress, abi: erc721Abi, functionName: 'balanceOf', args: [address], chainId } as const)
    }
    return calls
  }, [address, chainId, entAddress, jkuAddress, nftAddress])

  const query = useReadContracts({
    // biome-ignore lint/suspicious/noExplicitAny: heterogeneous multicall shape
    contracts: contracts as any,
    allowFailure: true,
    query: {
      enabled: contracts.length > 0,
      refetchInterval: 30_000,
    },
  })

  const balances = useMemo<Record<'jku' | 'ent' | 'nft', AssetBalance>>(() => {
    const results = query.data ?? []
    let cursor = 0

    const readErc20 = (configured: boolean) => {
      if (!configured) return 0
      const balance = results[cursor]?.result as bigint | undefined
      const decimals = results[cursor + 1]?.result as number | undefined
      cursor += 2
      if (balance === undefined) return 0
      return Number(formatUnits(balance, decimals ?? 18))
    }

    const jku = readErc20(!!jkuAddress)
    const ent = readErc20(!!entAddress)

    let nft = 0
    if (nftAddress) {
      const balance = results[cursor]?.result as bigint | undefined
      nft = balance === undefined ? 0 : Number(balance)
    }

    return {
      jku: { key: 'jku', symbol: 'JKU', amount: jku, configured: !!jkuAddress },
      ent: { key: 'ent', symbol: 'ENT', amount: ent, configured: !!entAddress },
      nft: { key: 'nft', symbol: 'RIG NFT', amount: nft, configured: !!nftAddress },
    }
  }, [entAddress, jkuAddress, nftAddress, query.data])

  return {
    balances,
    holdings: { jku: balances.jku.amount, ent: balances.ent.amount, nft: balances.nft.amount },
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    refetch: query.refetch,
    anyConfigured: !!jkuAddress || !!entAddress || !!nftAddress,
  }
}
