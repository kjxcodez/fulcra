"use client"

import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
import { Tilt3D } from "@/components/fulcra/shared/tilt-3d"

const CANDIDATE_LOOP = [
  "Discover jobs matched to your actual profile, not keyword guesses",
  "See match and ATS scores before you spend an application",
  "Generate a tailored resume grounded in your real evidence",
  "Apply yourself, or automate under rules you control",
  "Track every application's full history in one place",
]

const RECRUITER_LOOP = [
  "Create a role and let Fulcra surface candidates who actually fit",
  "Rank by an explainable match score, not a black-box grade",
  "Screen with AI-assisted summaries grounded in resume evidence",
  "Move candidates through a pipeline your whole team can see",
  "Evaluate and hire with a full record of how you got there",
]

export function ModesSection() {
  const [mode, setMode] = React.useState<"candidate" | "recruiter">("candidate")

  return (
    <section
      id="modes"
      className="border-t border-border bg-card/60 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Mode Segmented Switch with Animated Pill */}
        <div className="mb-12 flex justify-center">
          <div className="relative inline-flex rounded-full border border-border bg-muted p-1">
            <button
              type="button"
              onClick={() => setMode("candidate")}
              className={cn(
                "relative z-10 cursor-pointer rounded-full px-5 py-2 text-xs font-semibold transition-colors duration-200",
                mode === "candidate"
                  ? "text-background"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {mode === "candidate" && (
                <motion.span
                  layoutId="activeModeThumb"
                  className="absolute inset-0 -z-10 rounded-full bg-foreground shadow-sm"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              Candidate
            </button>
            <button
              type="button"
              onClick={() => setMode("recruiter")}
              className={cn(
                "relative z-10 cursor-pointer rounded-full px-5 py-2 text-xs font-semibold transition-colors duration-200",
                mode === "recruiter"
                  ? "text-background"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {mode === "recruiter" && (
                <motion.span
                  layoutId="activeModeThumb"
                  className="absolute inset-0 -z-10 rounded-full bg-foreground shadow-sm"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              Recruiter
            </button>
          </div>
        </div>

        {/* Content Panel with AnimatePresence */}
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12"
          >
            <div className="space-y-4 lg:col-span-5">
              <div className="font-mono text-xs tracking-wider text-primary uppercase">
                {mode === "candidate" ? "For job seekers" : "For hiring teams"}
              </div>
              <h3 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {mode === "candidate"
                  ? "Built around one loop: discover, tailor, apply, track."
                  : "The same matching engine, pointed the other direction."}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {mode === "candidate"
                  ? "Your profile is the source of truth. Every resume, application, and score traces back to it — so the more you use Fulcra, the sharper it gets, not the more you have to re-explain."
                  : "Fulcra scores your candidate pool against a role the same way it scores jobs against candidates — explainable, evidence-linked, and ready to move a pipeline forward."}
              </p>
            </div>

            <div className="lg:col-span-7">
              <Tilt3D maxAngle={4} scale={1.01}>
                <div className="divide-y divide-border/80 rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
                  {(mode === "candidate" ? CANDIDATE_LOOP : RECRUITER_LOOP).map(
                    (text, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-4 py-3.5 text-xs text-foreground first:pt-0 last:pb-0 sm:text-sm"
                      >
                        <span
                          className={cn(
                            "w-7 shrink-0 font-mono text-xs font-semibold",
                            mode === "candidate"
                              ? "text-candidate"
                              : "text-role"
                          )}
                        >
                          0{idx + 1}
                        </span>
                        <span>{text}</span>
                      </div>
                    )
                  )}
                </div>
              </Tilt3D>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
