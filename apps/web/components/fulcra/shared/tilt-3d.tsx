"use client"

import * as React from "react"
import { motion, useMotionValue, useSpring, useTransform } from "motion/react"
import { cn } from "@/lib/utils"

interface Tilt3DProps {
  children: React.ReactNode
  className?: string
  maxTilt?: number
  maxAngle?: number
  scale?: number
}

export function Tilt3D({
  children,
  className,
  maxTilt,
  maxAngle,
  scale = 1,
}: Tilt3DProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const tilt = maxAngle ?? maxTilt ?? 7
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const springConfig = { damping: 20, stiffness: 220, mass: 0.3 }
  const smoothX = useSpring(mouseX, springConfig)
  const smoothY = useSpring(mouseY, springConfig)

  const rotateX = useTransform(smoothY, [0, 1], [tilt * 0.7, -tilt * 0.7])
  const rotateY = useTransform(smoothX, [0, 1], [-tilt, tilt])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const isTouch = window.matchMedia("(hover: none)").matches
    const isReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    if (isTouch || isReduced) return

    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0.5)
    mouseY.set(0.5)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={scale !== 1 ? { scale } : undefined}
      transition={{ duration: 0.2 }}
      style={{
        transformStyle: "preserve-3d",
        perspective: 1200,
        rotateX,
        rotateY,
      }}
      className={cn(
        "transition-shadow duration-300 hover:shadow-xl",
        className
      )}
    >
      {children}
    </motion.div>
  )
}
