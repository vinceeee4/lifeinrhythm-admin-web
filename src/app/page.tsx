import Link from 'next/link'
import { Nunito } from 'next/font/google'
import { PixelQuietFooter } from '@/components/landing/PixelQuietFooter'

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
})

const features = [
  {
    icon: '🪷',
    title: 'Mindful scoring',
    body: 'See empathy scores and completion times in one calm, readable view.',
  },
  {
    icon: '📖',
    title: 'Training context',
    body: 'Built for TESDA NC II Caregiving simulation runs on Unity Android.',
  },
  {
    icon: '🌿',
    title: 'Gentle progress',
    body: 'Celebrate streaks and improvements without noisy dashboards.',
  },
] as const

export default function HomePage() {
  return (
    <div
      className={`${nunito.className} flex min-h-screen flex-col bg-quiet-sage text-quiet-ink antialiased`}
    >
      <header className="shrink-0 px-4 pt-6 md:px-8 md:pt-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 text-lg font-bold tracking-tight text-quiet-ink sm:justify-start md:text-xl"
          >
            <span
              className="inline-flex h-9 w-9 items-center justify-center rounded border-2 border-quiet-ink/15 bg-white/50 text-lg shadow-sm"
              aria-hidden
            >
              🌲
            </span>
            Life in Rhythm
          </Link>

          <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm font-semibold text-quiet-ink/80">
            <a href="#features" className="transition hover:text-quiet-ink">
              Features
            </a>
            <Link href="/about" className="transition hover:text-quiet-ink">
              About
            </Link>
            <a href="#contact" className="transition hover:text-quiet-ink">
              Contact
            </a>
          </nav>

          <div className="flex justify-center sm:justify-end">
            <Link
              href="/leaderboard"
              className="rounded-full bg-quiet-coral px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-quiet-coral-hover"
            >
              Start your journey +
            </Link>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col px-4 pb-4 pt-10 md:px-8 md:pt-14">
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center text-center">
          <h1 className="text-balance text-3xl font-bold leading-tight tracking-tight text-quiet-ink md:text-5xl md:leading-[1.1]">
            Where calm meets practice.
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-quiet-ink/70 md:text-lg">
            A quiet hub for your Life in Rhythm leaderboard—supporting TESDA NC II Caregiving training
            simulation players with clear scores, grades, and dates in one gentle place.
          </p>

          <div id="features" className="mt-12 w-full scroll-mt-24">
            <div className="grid gap-8 text-left sm:grid-cols-3 sm:gap-6">
              {features.map((f) => (
                <article
                  key={f.title}
                  className="flex flex-col items-center rounded-2xl border border-quiet-ink/10 bg-white/35 px-4 py-6 text-center shadow-sm backdrop-blur-sm sm:items-start sm:px-5 sm:text-left"
                >
                  <div
                    className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg border-2 border-quiet-ink/10 bg-white/70 text-2xl shadow-inner"
                    aria-hidden
                  >
                    {f.icon}
                  </div>
                  <h2 className="text-lg font-bold text-quiet-ink">{f.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-quiet-ink/70">{f.body}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/leaderboard"
              className="rounded-full bg-quiet-coral px-7 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-quiet-coral-hover hover:shadow-lg"
            >
              Start your journey +
            </Link>
            <a
              href="#features"
              className="rounded-full border border-quiet-ink/15 bg-quiet-mist px-7 py-3 text-sm font-semibold text-quiet-ink shadow-sm backdrop-blur-sm transition hover:bg-white/70"
            >
              Explore features
            </a>
          </div>

          <section
            id="contact"
            className="mt-14 max-w-lg scroll-mt-24 rounded-2xl border border-quiet-ink/10 bg-white/30 px-6 py-5 text-sm leading-relaxed text-quiet-ink/75 backdrop-blur-sm"
          >
            <p>
              <span className="font-semibold text-quiet-ink">Contact.</span> For program questions, reach
              out through your TESDA training center or institutional coordinator—we keep this site focused
              on scores and clarity.
            </p>
          </section>
        </div>
      </main>

      <PixelQuietFooter />

      <footer className="shrink-0 border-t border-quiet-ink/10 bg-quiet-sage-deep py-3 text-center text-xs text-quiet-ink/60">
        TESDA NC II Caregiving Training Simulation
      </footer>
    </div>
  )
}
