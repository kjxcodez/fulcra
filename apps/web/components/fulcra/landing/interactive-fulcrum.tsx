"use client"

import * as React from "react"
import { drawFulcrumScene } from "./fulcrum-renderer"

export function InteractiveFulcrum() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [score, setScore] = React.useState(0)
  const [barsFilled, setBarsFilled] = React.useState(false)

  React.useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    if (reduced) {
      const frame = requestAnimationFrame(() => {
        setScore(94)
        setBarsFilled(true)
      })
      return () => cancelAnimationFrame(frame)
    }

    let start: number | null = null
    const target = 94
    const duration = 1200
    let frameId: number

    const step = (ts: number) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      setScore(Math.round(progress * target))
      if (progress < 1) {
        frameId = requestAnimationFrame(step)
      } else {
        setBarsFilled(true)
      }
    }
    frameId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frameId)
  }, [])

  React.useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    let targetRotY = 0
    let targetRotX = 0
    let curRotY = 0
    let curRotX = 0
    let animId: number

    const handleMouseMove = (e: MouseEvent) => {
      if (reduced) return
      const rect = container.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1
      targetRotY = x * 0.35
      targetRotX = -y * 0.15
    }

    const handleMouseLeave = () => {
      targetRotY = 0
      targetRotX = 0
    }

    container.addEventListener("mousemove", handleMouseMove)
    container.addEventListener("mouseleave", handleMouseLeave)

    const render = (time: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = container.clientWidth
      const h = container.clientHeight

      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr
        canvas.height = h * dpr
      }

      ctx.save()
      ctx.scale(dpr, dpr)
      ctx.clearRect(0, 0, w, h)

      if (!reduced) {
        const idle = Math.sin(time / 1600) * 0.02
        curRotY += (targetRotY + idle - curRotY) * 0.08
        curRotX += (targetRotX - curRotX) * 0.08
      } else {
        curRotY = 0
        curRotX = 0
      }

      drawFulcrumScene(ctx, w, h, curRotX, curRotY)
      ctx.restore()

      animId = requestAnimationFrame(render)
    }

    animId = requestAnimationFrame(render)

    return () => {
      container.removeEventListener("mousemove", handleMouseMove)
      container.removeEventListener("mouseleave", handleMouseLeave)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative rounded-xl border border-border bg-card p-6 transition-shadow duration-300 select-none hover:shadow-lg sm:p-8"
    >
      <div className="mb-2 font-mono text-xs text-muted-foreground">
        Weighing your profile against{" "}
        <b className="font-sans font-semibold text-foreground">
          Senior Backend Engineer, Vela Systems
        </b>
      </div>

      <div className="relative h-60 w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 block h-full w-full touch-none"
        />

        <div className="pointer-events-none absolute top-4 left-2 flex w-40 flex-col gap-0.5 rounded border border-l-[3px] border-border border-l-candidate bg-card/95 p-2.5 shadow-xs">
          <span className="font-mono text-[10px] text-muted-foreground uppercase">
            from your profile
          </span>
          <span className="text-xs font-semibold text-foreground">
            5.5 yrs · distributed systems
          </span>
        </div>

        <div className="pointer-events-none absolute top-8 right-2 flex w-36 flex-col gap-0.5 rounded border border-l-[3px] border-border border-l-role bg-card/95 p-2.5 shadow-xs">
          <span className="font-mono text-[10px] text-muted-foreground uppercase">
            from the listing
          </span>
          <span className="text-xs font-semibold text-foreground">
            5+ yrs required
          </span>
        </div>
      </div>

      <div className="mt-2 flex flex-col gap-4 border-t border-border/80 pt-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="font-mono text-4xl font-medium tracking-tight text-foreground">
            {score}
            <span className="text-lg text-muted-foreground">%</span>
          </div>
          <div className="mt-0.5 font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
            overall match
          </div>
        </div>

        <div className="flex gap-4 sm:gap-6">
          <div className="w-20">
            <div className="mb-1 font-mono text-[11px] text-muted-foreground">
              Skills
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-candidate transition-all duration-1000 ease-out"
                style={{ width: barsFilled ? "96%" : "0%" }}
              />
            </div>
          </div>

          <div className="w-20">
            <div className="mb-1 font-mono text-[11px] text-muted-foreground">
              Experience
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-role transition-all duration-1000 ease-out"
                style={{ width: barsFilled ? "88%" : "0%" }}
              />
            </div>
          </div>

          <div className="w-20">
            <div className="mb-1 font-mono text-[11px] text-muted-foreground">
              Location
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-success transition-all duration-1000 ease-out"
                style={{ width: barsFilled ? "100%" : "0%" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
