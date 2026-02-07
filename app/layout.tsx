import React from "react"
import type { Metadata, Viewport } from 'next'
import { DM_Sans, Space_Mono } from 'next/font/google'

import './globals.css'

const _dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' })
const _spaceMono = Space_Mono({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-space-mono' })

export const metadata: Metadata = {
  title: 'ReGen - Climate Action for Young Adults',
  description: 'Track your environmental impact, complete daily sustainability goals, and collaborate with your local community to address climate change.',
}

export const viewport: Viewport = {
  themeColor: '#1a8a5c',
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
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
