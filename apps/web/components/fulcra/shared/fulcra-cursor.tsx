"use client"

import * as React from "react"

export function FulcraCursor() {
  const [mounted, setMounted] = React.useState(false)
  const [isHovered, setIsHovered] = React.useState(false)
  const dotRef = React.useRef<HTMLDivElement>(null)
  const ringRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const isTouch = window.matchMedia("(hover: none)").matches
    const isReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    if (isTouch || isReduced) return

    const frame = requestAnimationFrame(() => setMounted(true))
    document.body.classList.add("fulcra-custom-cursor")

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
        "a, button, [role='button'], input, select, .interactive, .tilt-3d, .loop-step"
      )
      setIsHovered(Boolean(interactive))
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    window.addEventListener("mouseover", handleMouseOver, { passive: true })
    animFrameId = requestAnimationFrame(animateRing)

    return () => {
      cancelAnimationFrame(frame)
      cancelAnimationFrame(animFrameId)
      document.body.classList.remove("fulcra-custom-cursor")
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseover", handleMouseOver)
    }
  }, [])

  if (!mounted) return null

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-50 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#14161F]"
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className={`pointer-events-none fixed top-0 left-0 z-50 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-200 ease-out ${
          isHovered
            ? "h-14 w-14 border border-[#3552E0] bg-[#EFF2FD]/60 shadow-xs"
            : "h-7 w-7 border border-[#A8AAB2] bg-transparent"
        }`}
      />
    </>
  )
}
