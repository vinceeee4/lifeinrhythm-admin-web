'use client'

import type { LeaderboardSortKey, SortDirection } from '@/lib/leaderboardSort'

type Tone = 'jade' | 'firebase'

const toneStyles: Record<
  Tone,
  { th: string; button: string; inactiveArrow: string; activeArrow: string }
> = {
  jade: {
    th: 'px-4 py-3 text-left text-sm font-semibold text-jade',
    button:
      'inline-flex w-full max-w-full items-center gap-1 rounded px-1 py-0.5 text-left text-inherit outline-none ring-jade/30 hover:bg-jade/10 focus-visible:ring-2',
    inactiveArrow: 'text-jade/40 opacity-0 transition-opacity group-hover:opacity-100',
    activeArrow: 'text-jade',
  },
  firebase: {
    th: 'px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-white',
    button:
      'inline-flex w-full max-w-full items-center gap-1 rounded px-1 py-0.5 text-left text-inherit outline-none ring-white/40 hover:bg-white/10 focus-visible:ring-2',
    inactiveArrow: 'text-white/50 opacity-0 transition-opacity group-hover:opacity-100',
    activeArrow: 'text-white',
  },
}

type Props = {
  label: string
  column: LeaderboardSortKey
  sortKey: LeaderboardSortKey
  sortDir: SortDirection
  onSort: (key: LeaderboardSortKey) => void
  tone: Tone
}

export function SortableTh({ label, column, sortKey, sortDir, onSort, tone }: Props) {
  const active = sortKey === column
  const s = toneStyles[tone]

  return (
    <th scope="col" className={s.th}>
      <button
        type="button"
        onClick={() => onSort(column)}
        className={`group ${s.button}`}
        aria-sort={active ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
      >
        <span className="min-w-0 truncate">{label}</span>
        <span
          className={`shrink-0 text-xs tabular-nums ${active ? s.activeArrow : s.inactiveArrow}`}
          aria-hidden
        >
          {active ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
        </span>
      </button>
    </th>
  )
}
