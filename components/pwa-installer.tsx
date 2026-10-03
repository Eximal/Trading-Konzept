'use client'

import { Download, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISS_KEY = 'jku:install-dismissed'

/**
 * Registers the service worker and surfaces the A2HS install prompt.
 */
export function PwaInstaller() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const installEventRef = useRef<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    const register = () => {
      navigator.serviceWorker.register('/sw.js').catch(() => undefined)
    }
    if (document.readyState === 'complete') register()
    else window.addEventListener('load', register, { once: true })
  }, [])

  useEffect(() => {
    const onPrompt = (event: Event) => {
      event.preventDefault()
      const promptEvent = event as BeforeInstallPromptEvent
      installEventRef.current = promptEvent
      setInstallEvent(promptEvent)
      if (window.localStorage.getItem(DISMISS_KEY) !== '1') setVisible(true)
    }
    const onInstalled = () => {
      setVisible(false)
      installEventRef.current = null
      setInstallEvent(null)
    }
    const onInstallRequest = () => {
      if (installEventRef.current) {
        setVisible(true)
      } else if (!window.matchMedia('(display-mode: standalone)').matches) {
        setShowInstructions(true)
      }
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    window.addEventListener('jku:request-install', onInstallRequest)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
      window.removeEventListener('jku:request-install', onInstallRequest)
    }
  }, [])

  if (!visible && !showInstructions) return null

  const dismiss = () => {
    setVisible(false)
    setShowInstructions(false)
    try {
      window.localStorage.setItem(DISMISS_KEY, '1')
    } catch {
      /* ignore */
    }
  }

  if (showInstructions && !installEvent) {
    return (
      <div className="fixed inset-x-3 bottom-20 z-50 mx-auto max-w-md rounded-2xl border border-cyan-300/25 bg-card p-4 shadow-lg shadow-black/50">
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-cyan-300/10 text-cyan-300 ring-1 ring-cyan-300/30 ring-inset">
            <Download className="size-4" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">CloudMiner installieren</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Desktop: Browser-Menü öffnen und „App installieren“ oder „Zum Startbildschirm“ wählen. Auf iPhone/iPad: Teilen → „Zum Home-Bildschirm“.
            </p>
            <p className="mt-2 text-[11px] text-muted-foreground">Die Installation funktioniert über HTTPS und benötigt keine zusätzliche Desktop-Software.</p>
          </div>
          <button type="button" onClick={dismiss} aria-label="Installationshinweis schließen" className="rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground">
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    )
  }

  if (!visible || !installEvent) return null

  return (
    <div className="fixed inset-x-3 bottom-20 z-50 mx-auto max-w-md rounded-2xl border border-cyan-300/25 bg-card p-3 shadow-lg shadow-black/50">
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#58a6ff]/12 text-[#58a6ff] ring-1 ring-[#58a6ff]/30 ring-inset">
          <Download className="size-4" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[#f0f6fc]">Install JKU Miner</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Add the rig to your home screen for offline access and faster cycles.
          </p>
          <button
            type="button"
            onClick={async () => {
              await installEvent.prompt()
              const choice = await installEvent.userChoice
              if (choice.outcome !== 'accepted') dismiss()
              installEventRef.current = null
              setInstallEvent(null)
              setVisible(false)
            }}
            className="mt-2.5 h-8 rounded-lg bg-[#238636] px-3 text-xs font-semibold text-[#f0f6fc] transition-colors hover:bg-[#2ea043]"
          >
            Install app
          </button>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss install prompt"
          className="rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
