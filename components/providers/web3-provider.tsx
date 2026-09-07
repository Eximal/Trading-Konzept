'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConnectKitProvider } from 'connectkit'
import { useState } from 'react'
import { WagmiProvider } from 'wagmi'
import { APP_NAME, wagmiConfig } from '@/lib/web3/config'

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 15_000, retry: 1, refetchOnWindowFocus: false },
        },
      }),
  )

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          mode="dark"
          options={{ hideBalance: true, enforceSupportedChains: false }}
          customTheme={{
            '--ck-font-family': 'var(--font-sans)',
            '--ck-border-radius': '12px',
            '--ck-overlay-background': 'rgba(1, 4, 9, 0.8)',
            '--ck-body-background': '#161b22',
            '--ck-body-background-secondary': '#0d1117',
            '--ck-body-color': '#c9d1d9',
            '--ck-body-color-muted': '#8b949e',
            '--ck-body-color-muted-hover': '#c9d1d9',
            '--ck-body-divider': '#30363d',
            '--ck-body-action-color': '#58a6ff',
            '--ck-focus-color': '#58a6ff',
            '--ck-primary-button-background': '#21262d',
            '--ck-primary-button-color': '#c9d1d9',
            '--ck-primary-button-hover-background': '#30363d',
            '--ck-secondary-button-background': '#21262d',
            '--ck-secondary-button-color': '#c9d1d9',
            '--ck-qr-dot-color': '#c9d1d9',
            '--ck-qr-background': '#0d1117',
            '--ck-qr-border-color': '#30363d',
          }}
        >
          <span className="sr-only">{APP_NAME} wallet layer ready</span>
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
