import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'REPD — No Equipment V-Taper',
  description: 'Track your V-Taper journey by Gerry',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="id">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}