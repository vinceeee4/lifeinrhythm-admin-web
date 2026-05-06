'use client'

import { FormEvent, useEffect, useState } from 'react'

interface Score {
  _id: string
  playerName: string
  score: number
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  datePlayed: string
}

interface NewScoreForm {
  playerName: string
  score: string
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  datePlayed: string
}

const initialForm: NewScoreForm = {
  playerName: '',
  score: '',
  grade: 'A',
  datePlayed: new Date().toISOString().split('T')[0],
}

export default function LeaderboardClient() {
  const [scores, setScores] = useState<Score[]>([])
  const [form, setForm] = useState<NewScoreForm>(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchScores = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/scores')
      if (!res.ok) {
        throw new Error('Unable to load leaderboard.')
      }

      const data = (await res.json()) as Score[]
      setScores(data)
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchScores()
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    const parsedScore = Number(form.score)
    if (Number.isNaN(parsedScore) || parsedScore < 0 || parsedScore > 100) {
      setError('Score must be between 0 and 100.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerName: form.playerName,
          score: parsedScore,
          grade: form.grade,
          datePlayed: new Date(form.datePlayed).toISOString(),
        }),
      })

      if (!res.ok) {
        const payload = await res.json()
        throw new Error(payload.error || 'Failed to submit score.')
      }

      setForm(initialForm)
      await fetchScores()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unknown error')
      setLoading(false)
    }
  }

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-jade md:text-4xl">Leaderboard</h1>
        <p className="mt-2 text-text-mid">Top Life in Rhythm player scores (0-100).</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-3 rounded-xl bg-white p-6 shadow-sm ring-1 ring-jade/10 md:grid-cols-4">
        <input
          value={form.playerName}
          onChange={(event) => setForm((prev) => ({ ...prev, playerName: event.target.value }))}
          placeholder="Player name"
          className="rounded border border-gray-300 px-3 py-2"
          required
        />
        <input
          value={form.score}
          onChange={(event) => setForm((prev) => ({ ...prev, score: event.target.value }))}
          type="number"
          min={0}
          max={100}
          placeholder="Score (0-100)"
          className="rounded border border-gray-300 px-3 py-2"
          required
        />
        <select
          value={form.grade}
          onChange={(event) => setForm((prev) => ({ ...prev, grade: event.target.value as NewScoreForm['grade'] }))}
          className="rounded border border-gray-300 px-3 py-2"
        >
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
          <option value="F">F</option>
        </select>
        <input
          value={form.datePlayed}
          onChange={(event) => setForm((prev) => ({ ...prev, datePlayed: event.target.value }))}
          type="date"
          className="rounded border border-gray-300 px-3 py-2"
          required
        />
        <button type="submit" className="btn-primary md:col-span-4" disabled={loading}>
          {loading ? 'Saving...' : 'Add Score'}
        </button>
      </form>

      {error && <p className="rounded bg-red-50 p-3 text-red-700">{error}</p>}

      <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-jade/10">
        <table className="w-full border-collapse">
          <thead className="bg-jade/5">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-jade">Rank</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-jade">Player</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-jade">Score</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-jade">Grade</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-jade">Date</th>
            </tr>
          </thead>
          <tbody>
            {scores.length === 0 && !loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-text-mid">
                  No scores yet.
                </td>
              </tr>
            ) : (
              scores.map((entry, index) => (
                <tr key={entry._id} className="border-t border-gray-100">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 font-medium">{entry.playerName}</td>
                  <td className="px-4 py-3">{entry.score}</td>
                  <td className="px-4 py-3">{entry.grade}</td>
                  <td className="px-4 py-3">
                    {new Date(entry.datePlayed).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
