'use client'

import { FormEvent, useEffect, useState } from 'react'
import { Score } from '@/types/score'

interface NewScoreForm {
  playerName: string
  empathyScore: string
  totalTime: string
  grade: string
  timeRating: string
  deviceModel: string
}

const initialForm: NewScoreForm = {
  playerName: '',
  empathyScore: '',
  totalTime: '',
  grade: 'Mahusay',
  timeRating: 'Mabilis!',
  deviceModel: 'Web',
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
      const res = await fetch('/api/firebase-scores')
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

    const parsedScore = Number(form.empathyScore)
    if (Number.isNaN(parsedScore) || parsedScore < 0 || parsedScore > 100) {
      setError('Empathy Score must be between 0 and 100.')
      return
    }

    const parsedTime = Number(form.totalTime)
    if (Number.isNaN(parsedTime) || parsedTime < 0) {
      setError('Total time must be a positive number.')
      return
    }

    // Note: Firebase REST API doesn't support write operations without Admin SDK
    // This form is now read-only. Use Firebase Console to add scores.
    setError('Score submission disabled. Please use Firebase Console to add scores.')
    return
  }

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-jade md:text-4xl">Legacy Leaderboard</h1>
        <p className="mt-2 text-text-mid">Top Life in Rhythm player scores from Firebase.</p>
      </div>

      {/* <div className="rounded-xl bg-yellow-50 p-4 border border-yellow-200">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> This is a read-only view of Firebase scores. To add new scores, use the Firebase Console or visit the new <a href="/firebase-leaderboard" className="text-blue-600 hover:underline">Firebase Leaderboard</a>.
        </p>
      </div> */}

      {error && <p className="rounded bg-red-50 p-3 text-red-700">{error}</p>}

      <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-jade/10">
        <table className="w-full border-collapse">
          <thead className="bg-jade/5">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-jade">Rank</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-jade">Player</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-jade">Empathy Score</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-jade">Time</th>
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
                <tr key={`${entry.playerName}-${entry.datePlayed}`} className="border-t border-gray-100">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 font-medium">{entry.playerName}</td>
                  <td className="px-4 py-3">{entry.empathyScore}</td>
                  <td className="px-4 py-3">{entry.timeFormatted}</td>
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
