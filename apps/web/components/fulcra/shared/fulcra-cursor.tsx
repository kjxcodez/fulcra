"use client"

import * as React from "react"

export function FulcraCursor() {
  const [mounted, setMounted] = React.useState(false)
  const dotRef = React.useRef<HTMLDivElement>(null)
  const ringRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    // Only activate on pointer devices that support hover and not reduced-motion
    const isTouch = window.matchMedia("(hover: none)").matches
    const isReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    if (isTouch || isReduced) return

    const frame = requestAnimationFrame(() => setMounted(true))

    let mouseX = 0
    let mouseY = 0
    let ringX = 0
    let ringY = 0
    let animFrameId: number

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (dotRef.current) {
        dotRef.current.style.left = `${mouseX}px`
        dotRef.current.style.top = `${mouseY}px`
      }
    }

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.18
      ringY += (mouseY - ringY) * 0.18
      if (ringRef.current) {
        ringRef.current.style.left = `${ringX}px`
        ringRef.current.style.top = `${ringY}px`
      }
      animFrameId = requestAnimationFrame(animateRing)
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return
      const interactive = target.closest(
        "a, button, [role='button'], input, select, .interactive"
      )
      if (interactive && ringRef.current) {
        ringRef.current.classList.add("cursor-hover")
      } else if (ringRef.current) {
        ringRef.current.classList.remove("cursor-hover")
      }
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    window.addEventListener("mouseover", handleMouseOver, { passive: true })
    animFrameId = requestAnimationFrame(animateRing)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseover", handleMouseOver)
      cancelAnimationFrame(animFrameId)
    }
  }, [])

  if (!mounted) return null

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-50 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground transition-opacity duration-150"
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="border-ink-300 pointer-events-none fixed top-0 left-0 z-50 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-[width,height,border-color,background-color] duration-200 ease-out [&.cursor-hover]:h-14 [&.cursor-hover]:w-14 [&.cursor-hover]:border-primary [&.cursor-hover]:bg-accent/40"
      />
    </>
  )
}
