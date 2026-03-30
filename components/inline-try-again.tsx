"use client"

import { WifiOff } from "lucide-react"

interface InlineTryAgainProps {
  onTryAgain: () => void | Promise<void>
  className?: string
  trying?: boolean
}

export default function InlineTryAgain({ onTryAgain, className = "", trying = false }: InlineTryAgainProps) {
  return (
    <div className={`w-full flex items-center justify-center py-6 ${className}`}>
      <div
        role="button"
        tabIndex={0}
        onClick={onTryAgain}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            onTryAgain()
          }
        }}
        aria-disabled={trying}
        className={`group flex flex-col items-center gap-3 rounded-2xl border px-8 py-6 shadow-sm transition ${
          trying
            ? "cursor-wait border-slate-300 bg-slate-100 text-slate-500"
            : "cursor-pointer border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100"
        }`}
      >
        <WifiOff className={`h-20 w-20 ${trying ? "animate-pulse" : "group-hover:scale-105"} transition`} />
        <span className="text-base font-semibold">{trying ? "Trying again..." : "Disconnected"}</span>
        <span className="text-sm opacity-80">{trying ? "Please wait" : "Tap icon to try again"}</span>
      </div>
    </div>
  )
}