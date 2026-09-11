"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

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
        {/* Mode Segmented Switch */}
        <div className="mb-12 flex justify-center">
          <div className="inline-flex rounded-full border border-border bg-muted p-1">
            <button
              type="button"
              onClick={() => setMode("candidate")}
              className={cn(
                "cursor-pointer rounded-full px-5 py-2 text-xs font-semibold transition-all duration-200",
                mode === "candidate"
                  ? "bg-foreground text-background shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Candidate
            </button>
            <button
              type="button"
              onClick={() => setMode("recruiter")}
              className={cn(
                "cursor-pointer rounded-full px-5 py-2 text-xs font-semibold transition-all duration-200",
                mode === "recruiter"
                  ? "bg-foreground text-background shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Recruiter
            </button>
          </div>
        </div>

        {/* Content Panel */}
        <div className="grid animate-in grid-cols-1 items-start gap-10 duration-200 fade-in-0 lg:grid-cols-12 lg:gap-12">
          <div className="space-y-4 lg:col-span-5">
            <div className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
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
            <div className="divide-y divide-border/80 rounded-xl border border-border bg-card p-6 shadow-xs sm:p-8">
              {(mode === "candidate" ? CANDIDATE_LOOP : RECRUITER_LOOP).map(
                (text, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 py-3.5 text-xs text-foreground first:pt-0 last:pb-0 sm:text-sm"
                  >
                    <span
                      className={cn(
                        "w-7 shrink-0 font-mono text-xs font-semibold",
                        mode === "candidate" ? "text-candidate" : "text-role"
                      )}
                    >
                      0{idx + 1}
                    </span>
                    <span>{text}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
