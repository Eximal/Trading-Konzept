import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Web3Provider } from '@/components/providers/web3-provider'
import { PwaInstaller } from '@/components/pwa-installer'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://miner.jkuspot.com'),
  title: {
    default: 'CloudMiner',
    template: '%s | CloudMiner',
  },
  description:
    'Explore CloudMiner, a wallet-connected participation dashboard with blockchain learning tools, device-aware controls, and community features.',
  applicationName: 'CloudMiner',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'CloudMiner',
    statusBarStyle: 'black-translucent',
  },
  openGraph: {
    type: 'website',
    url: 'https://miner.jkuspot.com',
    siteName: 'CloudMiner',
    title: 'CloudMiner',
    description:
      'Wallet-connected blockchain participation, on-chain token information, and guided learning tools for the CloudMiner community.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CloudMiner',
    description:
      'Wallet-connected blockchain participation, on-chain token information, and guided learning tools for the CloudMiner community.',
  },
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0b0f17',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark bg-background">
      <body className="bg-background text-foreground antialiased">
        <Web3Provider>
          {children}
          <PwaInstaller />
        </Web3Provider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
