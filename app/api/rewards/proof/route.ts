import { NextResponse } from 'next/server'
import { privateKeyToAccount } from 'viem/accounts'
import { isAddress, parseUnits, type Address, type Hex } from 'viem'

const BASE_CHAIN_ID = 8453
const MAX_DAILY_SHM = 1000
const SHM_DECIMALS = 18

function getSigner() {
  const key = process.env.SHM_REWARD_SIGNER_PRIVATE_KEY
  if (!key || !/^0x[0-9a-fA-F]{64}$/.test(key)) return null
  return privateKeyToAccount(key as Hex)
}

export async function POST(request: Request) {
  try {
    const payload = await request.json() as { walletAddress?: string; amount?: string; nonce?: number; expiresAt?: number; chainId?: number }
    const walletAddress = payload.walletAddress
    const amount = payload.amount
    const nonce = payload.nonce
    const expiresAt = payload.expiresAt

    if (!walletAddress || !isAddress(walletAddress) || payload.chainId !== BASE_CHAIN_ID) {
      return NextResponse.json({ error: 'A valid Base Mainnet wallet is required.' }, { status: 400 })
    }
    if (!amount || !/^\d+(\.\d{1,6})?$/.test(amount) || Number(amount) <= 0 || Number(amount) > MAX_DAILY_SHM) {
      return NextResponse.json({ error: 'Reward amount is outside the allowed range.' }, { status: 400 })
    }
    if (nonce === undefined || expiresAt === undefined || !Number.isSafeInteger(nonce) || nonce < 0 || !Number.isSafeInteger(expiresAt) || expiresAt <= Math.floor(Date.now() / 1000) || expiresAt > Math.floor(Date.now() / 1000) + 900) {
      return NextResponse.json({ error: 'Invalid or expired reward proof parameters.' }, { status: 400 })
    }

    const signer = getSigner()
    const claimContract = process.env.NEXT_PUBLIC_SHM_CLAIM_CONTRACT
    if (!signer || !claimContract || !isAddress(claimContract)) {
      return NextResponse.json({ error: 'Reward proof service is not configured.' }, { status: 503 })
    }

    const signature = await signer.signTypedData({
      domain: { name: 'SHM Rewards', version: '1', chainId: BASE_CHAIN_ID, verifyingContract: claimContract as Address },
      types: { Reward: [{ name: 'account', type: 'address' }, { name: 'amount', type: 'uint256' }, { name: 'nonce', type: 'uint256' }, { name: 'expiresAt', type: 'uint256' }] },
      primaryType: 'Reward',
      message: { account: walletAddress as Address, amount: parseUnits(amount, SHM_DECIMALS), nonce: BigInt(nonce), expiresAt: BigInt(expiresAt) },
    })

    return NextResponse.json({ amount, amountWei: parseUnits(amount, SHM_DECIMALS).toString(), nonce, expiresAt, signature, signer: signer.address, contract: claimContract })
  } catch {
    return NextResponse.json({ error: 'Unable to create reward proof.' }, { status: 500 })
  }
}
