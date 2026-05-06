import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

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
      <body suppressHydrationWarning className={`${inter.className} bg-cream text-text-dark`}>
        <header className="bg-jade text-cream">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-xl font-semibold">
              Life in Rhythm
            </Link>
            <nav className="flex items-center gap-4 text-sm font-medium">
              <Link href="/" className="rounded px-3 py-2 hover:bg-white/10">
                Landing
              </Link>
              <Link href="/leaderboard" className="rounded px-3 py-2 hover:bg-white/10">
                Leaderboard
              </Link>
              <Link href="/about" className="rounded px-3 py-2 hover:bg-white/10">
                About
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto min-h-[calc(100vh-140px)] max-w-5xl px-6 py-10">
          {children}
        </main>
        <footer className="border-t border-jade/10 bg-white">
          <div className="mx-auto max-w-5xl px-6 py-4 text-sm text-text-mid">
            TESDA NC II Caregiving Training Simulation
          </div>
        </footer>
      </body>
    </html>
  )
}
