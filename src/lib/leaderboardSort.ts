export type LeaderboardSortKey =
  | 'playerName'
  | 'empathyScore'
  | 'time'
  | 'grade'
  | 'datePlayed'

export type SortDirection = 'asc' | 'desc'

export type SortableScoreRow = {
  playerName: string
  empathyScore: number
  timeFormatted: string
  grade: string
  datePlayed: string
  totalTime?: number
}

function parseTimeFormatted(s: string): number {
  const parts = s.split(':').map((p) => Number.parseInt(p.trim(), 10))
  if (parts.some((n) => Number.isNaN(n))) return Number.POSITIVE_INFINITY
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  return Number.POSITIVE_INFINITY
}

function timeSortValue(row: SortableScoreRow): number {
  if (typeof row.totalTime === 'number' && !Number.isNaN(row.totalTime)) {
    return row.totalTime
  }
  return parseTimeFormatted(row.timeFormatted)
}

function dateSortValue(s: string): number {
  const t = Date.parse(s)
  return Number.isNaN(t) ? 0 : t
}

/** First-click direction when switching to a new column */
export function defaultSortDirection(key: LeaderboardSortKey): SortDirection {
  switch (key) {
    case 'playerName':
    case 'grade':
      return 'asc'
    case 'empathyScore':
    case 'datePlayed':
      return 'desc'
    case 'time':
      return 'asc'
    default:
      return 'asc'
  }
}

export function compareLeaderboardRows(
  a: SortableScoreRow,
  b: SortableScoreRow,
  key: LeaderboardSortKey,
  dir: SortDirection
): number {
  const mult = dir === 'asc' ? 1 : -1
  switch (key) {
    case 'playerName':
      return mult * a.playerName.localeCompare(b.playerName, undefined, { sensitivity: 'base' })
    case 'empathyScore':
      return mult * (a.empathyScore - b.empathyScore)
    case 'time':
      return mult * (timeSortValue(a) - timeSortValue(b))
    case 'grade':
      return mult * a.grade.localeCompare(b.grade, undefined, { sensitivity: 'base' })
    case 'datePlayed':
      return mult * (dateSortValue(a.datePlayed) - dateSortValue(b.datePlayed))
    default:
      return 0
  }
}

export function sortLeaderboardRows<T extends SortableScoreRow>(
  rows: T[],
  key: LeaderboardSortKey,
  dir: SortDirection
): T[] {
  return [...rows].sort((a, b) => compareLeaderboardRows(a, b, key, dir))
}
