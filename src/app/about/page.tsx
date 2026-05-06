export default function AboutPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold text-jade md:text-4xl">About</h1>
      <div className="space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-jade/10">
        <p className="text-text-mid">
          Life in Rhythm is a TESDA NC II Caregiving Training Simulation built for Unity Android.
          It helps learners practice caregiving decisions in realistic, game-based scenarios.
        </p>
        <p className="text-text-mid">
          This website highlights top player performance through a simple leaderboard,
          making it easy for trainers and learners to review achievements.
        </p>
      </div>
    </section>
  )
}
