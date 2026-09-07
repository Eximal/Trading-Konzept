'use client'

import { BarChart3, Gauge, Pickaxe } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

const ITEMS = [
  { id: 'rig', label: 'Rig', Icon: Pickaxe },
  { id: 'boost', label: 'Boost', Icon: Gauge },
  { id: 'stats', label: 'Stats', Icon: BarChart3 },
] as const

export function BottomNav() {
  const [active, setActive] = useState<string>('rig')

  useEffect(() => {
    const sections = ITEMS.map((item) => document.getElementById(item.id)).filter(
      (el): el is HTMLElement => !!el,
    )
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-[#0d1117]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md"
    >
      <ul className="mx-auto flex w-full max-w-3xl items-stretch">
        {ITEMS.map(({ id, label, Icon }) => {
          const isActive = active === id
          return (
            <li key={id} className="flex-1">
              <a
                href={`#${id}`}
                aria-current={isActive ? 'true' : undefined}
                className={cn(
                  'flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors',
                  isActive ? 'text-[#58a6ff]' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
                {label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
