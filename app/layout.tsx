import React from "react"
import type { Metadata, Viewport } from 'next'
import { DM_Sans, Space_Mono } from 'next/font/google'

import { Providers } from '@/components/providers'
import './globals.css'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' })
const spaceMono = Space_Mono({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-space-mono' })

export const metadata: Metadata = {
  title: 'ReGen - Climate Action for Young Adults',
  description: 'Track your environmental impact, complete daily sustainability goals, and collaborate with your local community to address climate change.',
}

export const viewport: Viewport = {
  themeColor: '#1e7a52',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${spaceMono.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
