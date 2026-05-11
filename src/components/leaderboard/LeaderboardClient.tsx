'use client'

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Score } from '@/types/score'
import {
  defaultSortDirection,
  type LeaderboardSortKey,
  type SortDirection,
  sortLeaderboardRows,
} from '@/lib/leaderboardSort'
import { SortableTh } from '@/components/leaderboard/SortableTh'

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
  const [sortKey, setSortKey] = useState<LeaderboardSortKey>('empathyScore')
  const [sortDir, setSortDir] = useState<SortDirection>('desc')
  const sortKeyRef = useRef(sortKey)
  sortKeyRef.current = sortKey

  const handleSort = useCallback((key: LeaderboardSortKey) => {
    if (sortKeyRef.current === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir(defaultSortDirection(key))
    }
  }, [])

  const sortedScores = useMemo(
    () => sortLeaderboardRows(scores, sortKey, sortDir),
    [scores, sortKey, sortDir]
  )

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
    <>
      <div className="lb-header">
        <p className="section-label">Rankings</p>
        <h2 className="section-title text-cream">Leaderboard</h2>
        <p className="text-[rgba(247,243,236,0.65)]">Top performers in the Life in Rhythm caregiving simulation</p>
      </div>

      <div className="lb-container">
        {/* Podium for top 3 */}
        <div className="podium" id="podium">
          {sortedScores.slice(0, 3).map((entry, index) => {
            const position = index + 1
            const positionClass = position === 1 ? 'podium-1st' : position === 2 ? 'podium-2nd' : 'podium-3rd'
            const initials = entry.playerName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
            
            return (
              <div key={`podium-${index}`} className={`podium-item ${positionClass}`}>
                <div className="podium-avatar">{initials}</div>
                <div className="podium-block">
                  <div className="podium-rank">{position}</div>
                  <div className="podium-name">{entry.playerName}</div>
                  <div className="podium-score">{entry.empathyScore}</div>
                  <div className="podium-grade">{entry.grade}</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Controls */}
        <div className="lb-controls">
          <input 
            className="lb-search" 
            type="text" 
            placeholder="Search player name…" 
            id="lb-search-input" 
            onInput={(e) => {
              const searchTerm = e.currentTarget.value.toLowerCase()
              const filtered = scores.filter(score => 
                score.playerName.toLowerCase().includes(searchTerm)
              )
              // You might want to add state for filtered scores
            }}
          />
          <select className="lb-filter" id="lb-grade-filter">
            <option value="">All Grades</option>
            <option value="A">Grade A</option>
            <option value="B">Grade B</option>
            <option value="C">Grade C</option>
            <option value="D">Grade D</option>
            <option value="F">Grade F</option>
          </select>
          <button className="btn-refresh" onClick={fetchScores}>↺ Refresh</button>
        </div>

        {error && <p className="rounded bg-red-50 p-3 text-red-700">{error}</p>}

        {/* Table */}
        <div className="lb-table-wrapper">
          <table className="lb-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Score</th>
                <th>Grade</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody id="lb-tbody">
              {scores.length === 0 && !loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-text-mid">
                    No scores yet.
                  </td>
                </tr>
              ) : (
                sortedScores.map((entry, index) => {
                  const rank = index + 1
                  const rankClass = rank === 1 ? 'top1' : rank === 2 ? 'top2' : rank === 3 ? 'top3' : ''
                  const gradeClass = `g-${entry.grade.charAt(0)}`
                  
                  return (
                    <tr
                      key={`${entry.playerName}-${entry.datePlayed}-${entry.timeFormatted}-${index}`}
                    >
                      <td className="px-4 py-3">
                        <span className={`rank-badge ${rankClass}`}>{rank}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="player-name">{entry.playerName}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="score-bar-wrap">
                          <div className="score-bar" style={{width: `${entry.empathyScore}%`}}></div>
                          <span className="score-text">{entry.empathyScore}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`grade-pill ${gradeClass}`}>{entry.grade}</span>
                      </td>
                      <td className="px-4 py-3">
                        {new Date(entry.datePlayed).toLocaleDateString()}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
