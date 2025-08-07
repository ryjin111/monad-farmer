import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { Providers } from '@/components/providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Monad Farming Simulator',
  description: 'Grow crops, earn coins, and share your farming progress on Farcaster!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Immediate SDK ready call
              if (typeof window !== 'undefined' && window.farcaster) {
                try {
                  window.farcaster.actions.ready();
                  console.log('SDK ready() called from layout');
                } catch (e) {
                  console.log('SDK not available in layout');
                }
              }
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
