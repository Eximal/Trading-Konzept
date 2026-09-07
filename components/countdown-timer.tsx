'use client'

import { formatDuration } from '@/lib/mining'

const LABELS = ['Hours', 'Minutes', 'Seconds'] as const

export function CountdownTimer({
  remainingMs,
  active,
}: {
  remainingMs: number
  active: boolean
}) {
  const { hours, minutes, seconds } = formatDuration(remainingMs)
  const parts = [hours, minutes, seconds]

  return (
    <div className="flex items-end justify-center gap-2" role="timer" aria-live="off">
      {parts.map((part, index) => (
        <div key={LABELS[index]} className="flex items-end gap-2">
          <div className="flex flex-col items-center gap-1">
            <span
              className={`tabular min-w-[3.25rem] rounded-lg border border-border bg-[#0d1117] px-2 py-2 text-center font-mono text-2xl font-semibold sm:min-w-[4rem] sm:text-3xl ${
                active ? 'text-[#f0f6fc]' : 'text-muted-foreground'
              }`}
            >
              {part}
            </span>
            <span className="text-[10px] tracking-widest text-muted-foreground uppercase">
              {LABELS[index]}
            </span>
          </div>
          {index < parts.length - 1 && (
            <span className="pb-6 font-mono text-xl text-muted-foreground" aria-hidden="true">
              :
            </span>
          )}
        </div>
      ))}
      <span className="sr-only">
        {active
          ? `${hours} hours ${minutes} minutes ${seconds} seconds remaining in this mining cycle`
          : 'Mining cycle not running'}
      </span>
    </div>
  )
}
