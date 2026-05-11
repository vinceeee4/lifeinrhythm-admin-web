import type { Metadata, Viewport } from 'next'
import '@/styles/globals.css'
import { AppShell } from '@/components/AppShell'

export const metadata: Metadata = {
  title: 'Life in Rhythm Leaderboard',
  description: 'Leaderboard website for Life in Rhythm TESDA NC II Caregiving Training Simulation.',
  keywords: ['TESDA', 'Caregiving', 'NC II', 'Training', 'Simulation', 'Leaderboard'],
  authors: [{ name: 'Life in Rhythm Team' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="font-sans bg-cream text-text-dark">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
