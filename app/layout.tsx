import React from "react"
import type { Metadata, Viewport } from 'next'
import { Space_Grotesk } from 'next/font/google'

import './globals.css'
import { AnimatedBackground } from '@/components/animated-background'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })

export const metadata: Metadata = {
  title: 'Backend Engineer - Scalable Systems & Microservices',
  description: 'Backend-focused engineer building production-grade microservices and scalable systems using Java, Spring Boot, Kafka, Redis, and secure architecture patterns.',
  keywords: 'Backend Engineer, Java, Spring Boot, Microservices, APIs, Distributed Systems',
  generator: 'v0.app',
  openGraph: {
    title: 'Backend Engineer Portfolio',
    description: 'Discover projects showcasing expertise in scalable backend architecture',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0a0a0a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.className} antialiased overflow-x-hidden bg-background`}>
        <AnimatedBackground />
        {children}
      </body>
    </html>
  )
}
