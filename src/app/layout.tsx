import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CrankSmith 4.0 - Cycling Component Compatibility',
  description: 'Never buy incompatible bike parts again. Check component compatibility before you buy.',
  keywords: 'cycling, bike parts, compatibility, cassette, chain, derailleur, crankset',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}