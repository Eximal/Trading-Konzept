import { cookieStorage, createConfig, createStorage, http } from 'wagmi'
import { base, bsc, mainnet, monad } from 'wagmi/chains'
import { walletConnect } from 'wagmi/connectors'
import { SUPPORTED_CHAINS } from './chains'

export const APP_NAME = 'CloudMiner · BRATE'
export const APP_URL = 'https://miner.jkuspot.com'
export const APP_DESCRIPTION =
  'CloudMiner participation mining with live BRATE token balances on Base.'

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

/**
 * QR-only wallet configuration.
 *
 * We intentionally do not register injected or Coinbase connectors. That keeps
 * this app from interacting with window.ethereum and avoids collisions between
 * browser wallet extensions that try to redefine the same provider globals.
 */
export const wagmiConfig = createConfig({
  chains: SUPPORTED_CHAINS,
  connectors: walletConnectProjectId
    ? [
        walletConnect({
          projectId: walletConnectProjectId,
          showQrModal: true,
          metadata: {
            name: APP_NAME,
            description: APP_DESCRIPTION,
            url: APP_URL,
            icons: [`${APP_URL}/icons/icon-192.png`],
          },
        }),
      ]
    : [],
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  transports: {
    [base.id]: http(process.env.NEXT_PUBLIC_RPC_BASE),
    [monad.id]: http(process.env.NEXT_PUBLIC_RPC_MONAD),
    [bsc.id]: http(process.env.NEXT_PUBLIC_RPC_BSC),
    [mainnet.id]: http(process.env.NEXT_PUBLIC_RPC_ETHEREUM),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig
  }
}
