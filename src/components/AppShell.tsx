'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLanding = pathname === '/'

  if (isLanding) {
    return <>{children}</>
  }

  const getActiveClass = (path: string) => {
    return pathname === path ? 'active' : ''
  }

  return (
    <>
      <nav className="nav-fixed">
        <Link href="/" className="nav-brand">
          <div className="nav-logo-pulse">
            <svg viewBox="0 0 24 24" fill="none" stroke="#3a2800" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
          <span className="nav-title">Life in <span>Rhythm</span></span>
        </Link>
        <ul className="nav-links">
          <li><Link href="/" className={getActiveClass('/')}>Home</Link></li>
          <li><Link href="/leaderboard" className={getActiveClass('/leaderboard')}>Leaderboard</Link></li>
          <li><Link href="/about" className={getActiveClass('/about')}>About</Link></li>
        </ul>
      </nav>
      <main className="min-h-screen pt-[68px]">{children}</main>
      <footer className="bg-jade px-12 py-10 text-center text-[0.85rem] text-[rgba(247,243,236,0.5)]">
        <strong className="text-[var(--gold-light)]">Life in Rhythm</strong> — TESDA NC II Caregiving Training Simulation &nbsp;·&nbsp; Built with Unity &amp; MongoDB &nbsp;·&nbsp; 2025
      </footer>
    </>
  )
}
