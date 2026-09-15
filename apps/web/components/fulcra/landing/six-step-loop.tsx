"use client"

import * as React from "react"
import { motion } from "motion/react"

const LOOP_STEPS = [
  {
    idx: "01",
    name: "Discover",
    desc: "Pulled from boards, ATS-hosted career pages, and company sites — deduplicated into one listing.",
  },
  {
    idx: "02",
    name: "Understand",
    desc: "Requirements, seniority, and must-haves extracted from the raw posting, not just keywords.",
  },
  {
    idx: "03",
    name: "Match",
    desc: "Weighed against your profile on skills, experience, location, and comp — with a reason for every number.",
  },
  {
    idx: "04",
    name: "Optimize",
    desc: "Resume and ATS gaps surfaced, with fixes grounded in evidence you actually have.",
  },
  {
    idx: "05",
    name: "Apply",
    desc: "Submit yourself, or hand it to automation under rules you set.",
  },
  {
    idx: "06",
    name: "Track",
    desc: "Every resume, answer, and reply attached to the application it belongs to.",
  },
]

export function SixStepLoop() {
  const [activeStep, setActiveStep] = React.useState<number | null>(null)
  const [scrollProgress, setScrollProgress] = React.useState(16)
  const sectionRef = React.useRef<HTMLElement>(null)

  React.useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const vh = window.innerHeight
      const total = rect.height + vh
      const scrolled = vh - rect.top
      const fraction = Math.min(Math.max(scrolled / total, 0.16), 1)
      setScrollProgress(fraction * 100)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section
      id="loop"
      ref={sectionRef}
      className="border-t border-border py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 max-w-xl">
          <span className="mb-3 block font-mono text-xs font-medium tracking-wider text-primary uppercase">
            the loop
          </span>
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Every job goes through the same six steps — for you and for it.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Discovery isn&apos;t the finish line. Fulcra keeps working after the
            job is found: understanding it, weighing it against you, tightening
            your application, and tracking what happens next.
          </p>
        </div>

        {/* Progress Rail Track */}
        <div className="relative mb-0 h-0.5 w-full overflow-hidden bg-border">
          <motion.div
            className="h-full bg-primary"
            animate={{
              width:
                activeStep !== null
                  ? `${((activeStep + 1) / LOOP_STEPS.length) * 100}%`
                  : `${scrollProgress}%`,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>

        {/* Six Steps Grid / Rail */}
        <div className="grid grid-cols-1 divide-y divide-border border-b border-border sm:grid-cols-2 sm:divide-x sm:divide-y-0 md:grid-cols-3 lg:grid-cols-6">
          {LOOP_STEPS.map((step, i) => {
            const isHovered = activeStep === i
            return (
              <motion.div
                key={step.idx}
                onMouseEnter={() => setActiveStep(i)}
                onMouseLeave={() => setActiveStep(null)}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className={`group relative cursor-pointer p-6 transition-colors duration-200 ${
                  isHovered
                    ? "border-b-2 border-primary bg-card shadow-sm"
                    : "hover:bg-card/40"
                }`}
              >
                <div
                  className={`font-mono text-xs font-semibold transition-colors duration-200 ${
                    isHovered
                      ? "font-bold text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.idx}
                </div>
                <div className="mt-3 font-heading text-base font-semibold text-foreground">
                  {step.name}
                </div>
                <div className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {step.desc}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
