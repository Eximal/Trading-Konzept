import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Web3Provider } from '@/components/providers/web3-provider'
import { PwaInstaller } from '@/components/pwa-installer'
import './globals.css'

const _geistSans = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://miner.jkuspot.com'),
  title: {
    default: 'JKU Mining Protocol',
    template: '%s | JKU Mining Protocol',
  },
  description:
    'Multi-chain mining rig for the JKU protocol on Base, Monad and BNB Chain. Run 24 hour cycles and boost hashrate with $JKU, $ENT and NFT holdings.',
  applicationName: 'JKU Miner',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'JKU Miner',
    statusBarStyle: 'black-translucent',
  },
  openGraph: {
    type: 'website',
    url: 'https://miner.jkuspot.com',
    siteName: 'JKU Mining Protocol',
    title: 'JKU Mining Protocol',
    description:
      'Run multi-chain mining cycles and boost your hashrate with $JKU, $ENT and NFT holdings.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JKU Mining Protocol',
    description:
      'Run multi-chain mining cycles and boost your hashrate with $JKU, $ENT and NFT holdings.',
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
  themeColor: '#0d1117',
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
