'use client'

import { useEffect, useState } from 'react'
import { BASE_HASHRATE } from '@/lib/mining'

const HISTORY_LENGTH = 40

/**
 * Live hashrate counter. Ticks once per second with a small amount of variance
 * around `base * multiplier` so the rig reads as a real telemetry feed.
 */
export function useHashrate(active: boolean, multiplier: number) {
  const target = BASE_HASHRATE * multiplier
  const [value, setValue] = useState(0)
  const [history, setHistory] = useState<number[]>(() => Array(HISTORY_LENGTH).fill(0))
  useEffect(() => {
    if (!active) return

    const sample = () => {
      const jitter = (Math.random() - 0.5) * 0.14 * target
      const next = Math.max(0, target + jitter)
      setValue(next)
      setHistory((prev) => [...prev.slice(1), next])
    }

    sample()
    const id = window.setInterval(sample, 1000)
    return () => window.clearInterval(id)
  }, [active, target])

  return {
    hashrate: active ? value : 0,
    target,
    history: active ? history : Array(HISTORY_LENGTH).fill(0),
  }
}
