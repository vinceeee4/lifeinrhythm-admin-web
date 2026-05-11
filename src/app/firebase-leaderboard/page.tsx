'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Score, LeaderboardEntry } from '@/types/score'
import {
  defaultSortDirection,
  type LeaderboardSortKey,
  type SortDirection,
  sortLeaderboardRows,
} from '@/lib/leaderboardSort'
import { SortableTh } from '@/components/leaderboard/SortableTh'

export default function FirebaseLeaderboardPage() {
  const [scores, setScores] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
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
    try {
      const timestamp = Date.now()

      const response = await fetch(`/api/firebase-scores?_=${timestamp}`, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch scores')
      }

      const data: Score[] = await response.json()

      const leaderboardEntries: LeaderboardEntry[] = data.map((score) => ({
        playerName: score.playerName,
        empathyScore: score.empathyScore,
        timeFormatted: score.timeFormatted,
        grade: score.grade,
        datePlayed: score.datePlayed,
        leaderboardScore: score.leaderboardScore,
        totalTime: score.totalTime,
      }))

      setScores(leaderboardEntries)
      setLastUpdated(new Date())
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchScores()
    
    const interval = setInterval(fetchScores, 30000) // Auto-refresh every 30 seconds
    
    return () => clearInterval(interval)
  }, [])

  const getMedalEmoji = (rank: number) => {
    switch (rank) {
      case 1: return '🥇'
      case 2: return '🥈'
      case 3: return '🥉'
      default: return ''
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Leaderboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchScores}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🏆 Firebase Leaderboard</h1>
          <p className="text-gray-600">Top performers in Life in Rhythm</p>
          <p className="text-sm text-gray-500 mt-2">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>

        {scores.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Scores Yet</h3>
            <p className="text-gray-500">Be the first to play and set a high score!</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="max-h-[min(70vh,36rem)] overflow-auto">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-white">
                      Rank
                    </th>
                    <SortableTh
                      tone="firebase"
                      label="Player Name"
                      column="playerName"
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onSort={handleSort}
                    />
                    <SortableTh
                      tone="firebase"
                      label="Score"
                      column="empathyScore"
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onSort={handleSort}
                    />
                    <SortableTh
                      tone="firebase"
                      label="Time"
                      column="time"
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onSort={handleSort}
                    />
                    <SortableTh
                      tone="firebase"
                      label="Grade"
                      column="grade"
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onSort={handleSort}
                    />
                    <SortableTh
                      tone="firebase"
                      label="Date"
                      column="datePlayed"
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onSort={handleSort}
                    />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedScores.map((entry, index) => {
                    const rank = index + 1
                    return (
                    <tr
                      key={`${entry.playerName}-${entry.datePlayed}-${entry.timeFormatted}-${rank}`}
                      className={`hover:bg-gray-50 transition-colors ${
                        rank <= 3 ? 'bg-gradient-to-r from-yellow-50 to-amber-50' : ''
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-lg font-bold text-gray-800">
                            {rank}
                          </span>
                          <span className="ml-2 text-2xl">
                            {getMedalEmoji(rank)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {entry.playerName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-semibold">
                          {entry.empathyScore}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {entry.timeFormatted}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          entry.grade.includes('Natatanging') 
                            ? 'bg-purple-100 text-purple-800'
                            : entry.grade.includes('Mahusay')
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {entry.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(entry.datePlayed)}
                      </td>
                    </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={fetchScores}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-lg"
          >
            🔄 Refresh Now
          </button>
          <p className="text-sm text-gray-500 mt-2">
            Auto-refreshes every 30 seconds
          </p>
        </div>
      </div>
    </div>
  )
}
