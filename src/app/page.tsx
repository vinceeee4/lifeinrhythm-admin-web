import Link from 'next/link'

export default function HomePage() {
  return (
    <section className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-jade md:text-5xl">
          Life in Rhythm
        </h1>
        <p className="max-w-2xl text-lg text-text-mid">
          A TESDA NC II Caregiving Training Simulation for Unity Android players.
          Track top scores and celebrate learner progress through a focused leaderboard.
        </p>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-jade/10">
        <h2 className="mb-3 text-2xl font-semibold text-jade">Quick Access</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/leaderboard" className="btn-primary">
            View Leaderboard
          </Link>
          <Link href="/about" className="btn-secondary bg-jade text-cream">
            About the Project
          </Link>
        </div>
      </div>
    </section>
  )
}
