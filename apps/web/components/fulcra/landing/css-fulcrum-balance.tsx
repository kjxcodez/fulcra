"use client"

import * as React from "react"
import { Tilt3D } from "@/components/fulcra/shared/tilt-3d"

export function CssFulcrumBalance() {
  const [evidence, setEvidence] = React.useState(86)
  const [requirements, setRequirements] = React.useState(80)
  const [idleSway, setIdleSway] = React.useState(0)
  const [isInteracting, setIsInteracting] = React.useState(false)

  // Gentle breathing idle sway when user is not dragging sliders
  React.useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    if (reduced) return

    let frame: number
    const startTime = performance.now()

    const animate = (now: number) => {
      if (!isInteracting) {
        const elapsed = (now - startTime) / 1000
        // Very subtle ±0.6 degree breathing sway
        setIdleSway(Math.sin(elapsed * 1.5) * 0.6)
      } else {
        setIdleSway(0)
      }
      frame = requestAnimationFrame(animate)
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [isInteracting])

  // Weight differential determines physical tilt
  const diff = requirements - evidence
  const tiltDeg = Math.max(-12, Math.min(12, diff * 0.35 + idleSway))

  // Dynamically compute compatibility score
  const rawRatio = evidence / Math.max(requirements, 30)
  const computedScore = Math.min(
    99,
    Math.max(42, Math.round(rawRatio * 88 + (evidence > requirements ? 4 : -6)))
  )

  const skillsScore = Math.min(99, Math.round(evidence * 1.08))
  const expScore = Math.min(99, Math.round(evidence * 0.94))
  const locScore = Math.min(100, Math.round(85 + (evidence > 50 ? 15 : 0)))

  return (
    <Tilt3D maxAngle={6} scale={1.01} className="w-full">
      <div className="relative rounded-xl border border-border bg-card p-6 shadow-xs transition-shadow select-none hover:shadow-md sm:p-8">
        {/* Card Header */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-border/80 pb-3">
          <div className="font-mono text-xs text-muted-foreground">
            Weighing:{" "}
            <span className="font-sans font-semibold text-foreground">
              Sr. Backend Engineer · Vela Systems
            </span>
          </div>
          <span className="rounded bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
            Example — not your data
          </span>
        </div>

        {/* 3D Fulcrum Balance Stage */}
        <div
          className="relative flex h-52 w-full items-center justify-center overflow-hidden rounded-lg bg-muted/25 px-4"
          style={{ perspective: "1000px" }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-radial from-white/60 via-transparent to-transparent opacity-50 dark:from-white/5"
          />

          {/* Tilting Beam Assembly */}
          <div
            className="relative flex w-full max-w-md items-center justify-center transition-transform duration-300 ease-out"
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateZ(${tiltDeg}deg)`,
            }}
          >
            {/* Candidate Weight Pan (Brass) */}
            <div
              className="absolute -top-8 -left-2 z-10 flex flex-col items-center gap-1.5 transition-transform duration-300 sm:left-4"
              style={{ transform: `rotateZ(${-tiltDeg}deg)` }}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-candidate/40 bg-candidate text-white shadow-md">
                <span className="font-mono text-xs font-bold">{evidence}%</span>
              </div>
              <span className="rounded bg-card/90 px-1.5 py-0.5 font-mono text-[10px] font-medium text-candidate shadow-2xs">
                Evidence
              </span>
            </div>

            {/* Central Beam */}
            <div className="relative h-2 w-full max-w-sm rounded-full bg-foreground/80 shadow-xs">
              <div className="absolute top-1/2 left-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background bg-foreground shadow-sm" />
            </div>

            {/* Role Requirements Pan (Indigo) */}
            <div
              className="absolute -top-8 -right-2 flex flex-col items-center gap-1.5 transition-transform duration-300 sm:right-4"
              style={{ transform: `rotateZ(${-tiltDeg}deg)` }}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-role/40 bg-role text-white shadow-md">
                <span className="font-mono text-xs font-bold">
                  {requirements}%
                </span>
              </div>
              <span className="rounded bg-card/90 px-1.5 py-0.5 font-mono text-[10px] font-medium text-role shadow-2xs">
                Required
              </span>
            </div>
          </div>

          {/* Fulcrum Stand (Static Pivot) */}
          <div className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2">
            <svg width="44" height="36" viewBox="0 0 44 36" fill="none">
              <polygon points="22,4 42,36 2,36" fill="#14161F" />
              <line
                x1="2"
                y1="35"
                x2="42"
                y2="35"
                stroke="#A8AAB2"
                strokeWidth="2"
              />
            </svg>
          </div>

          <div className="pointer-events-none absolute bottom-4 left-1/2 h-2.5 w-48 -translate-x-1/2 rounded-full bg-foreground/10 blur-xs" />
        </div>

        {/* Dual Interactive Sliders Control Panel */}
        <div className="mt-5 grid grid-cols-1 gap-4 border-t border-border/80 pt-4 sm:grid-cols-2">
          {/* Slider 1: Candidate Evidence */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-medium text-candidate">
                <span className="inline-block h-2 w-2 rounded-full bg-candidate" />
                Candidate Evidence
              </span>
              <span className="font-mono text-xs font-semibold text-foreground">
                {evidence}%
              </span>
            </div>
            <input
              type="range"
              min="30"
              max="100"
              value={evidence}
              onPointerDown={() => setIsInteracting(true)}
              onPointerUp={() => setIsInteracting(false)}
              onChange={(e) => setEvidence(Number(e.target.value))}
              aria-label="Adjust Candidate Evidence weight"
              className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-[#B08D3E]"
            />
            <div className="font-mono text-[10px] text-muted-foreground">
              5.5 yrs exp · Go, PostgreSQL, Distributed
            </div>
          </div>

          {/* Slider 2: Role Requirements */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-medium text-role">
                <span className="inline-block h-2 w-2 rounded-full bg-role" />
                Role Requirements
              </span>
              <span className="font-mono text-xs font-semibold text-foreground">
                {requirements}%
              </span>
            </div>
            <input
              type="range"
              min="30"
              max="100"
              value={requirements}
              onPointerDown={() => setIsInteracting(true)}
              onPointerUp={() => setIsInteracting(false)}
              onChange={(e) => setRequirements(Number(e.target.value))}
              aria-label="Adjust Role Requirements weight"
              className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-[#3552E0]"
            />
            <div className="font-mono text-[10px] text-muted-foreground">
              5+ yrs required · PostgreSQL, K8s
            </div>
          </div>
        </div>

        {/* Dynamic Match Score & Dimension Breakdown */}
        <div className="mt-5 flex flex-col gap-4 border-t border-border/80 pt-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="font-mono text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {computedScore}
              <span className="text-base text-muted-foreground">%</span>
            </div>
            <div className="mt-0.5 font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
              calculated compatibility
            </div>
          </div>

          <div className="flex gap-4 sm:gap-6">
            {[
              { label: "Skills", score: skillsScore, color: "bg-candidate" },
              { label: "Experience", score: expScore, color: "bg-role" },
              { label: "Location", score: locScore, color: "bg-success" },
            ].map((bar) => (
              <div key={bar.label} className="w-20">
                <div className="mb-1 flex justify-between font-mono text-[11px] text-muted-foreground">
                  <span>{bar.label}</span>
                  <span>{bar.score}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full ${bar.color} transition-all duration-300 ease-out`}
                    style={{ width: `${bar.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Tilt3D>
  )
}
