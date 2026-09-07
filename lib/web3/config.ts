import { cookieStorage, createConfig, createStorage, http } from 'wagmi'
import { base, bsc, mainnet, monad } from 'wagmi/chains'
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'
import { SUPPORTED_CHAINS } from './chains'

export const APP_NAME = 'JKU Mining Protocol'
export const APP_URL = 'https://miner.jkuspot.com'
export const APP_DESCRIPTION =
  'Multi-chain mining rig for the JKU protocol. Activate 24h cycles and boost hashrate with $JKU, $ENT and NFT holdings.'

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

/**
 * Wagmi config. WalletConnect is only registered when a project id is present,
 * so the app never crashes in environments without one (injected wallets still work).
 */
export const wagmiConfig = createConfig({
  chains: SUPPORTED_CHAINS,
  connectors: [
    injected({ shimDisconnect: true }),
    coinbaseWallet({ appName: APP_NAME, appLogoUrl: `${APP_URL}/icon.svg` }),
    ...(walletConnectProjectId
      ? [
          walletConnect({
            projectId: walletConnectProjectId,
            showQrModal: false,
            metadata: {
              name: APP_NAME,
              description: APP_DESCRIPTION,
              url: APP_URL,
              icons: [`${APP_URL}/icons/icon-192.png`],
            },
          }),
        ]
      : []),
  ],
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
