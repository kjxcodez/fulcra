"use client"

import * as React from "react"
import { RotateCw, ArrowRight } from "lucide-react"
import { STEPS } from "./six-step-loop-data"
import { SixStepStagePreview } from "./six-step-stage-preview"

export function SixStepLoop() {
  const [activeStep, setActiveStep] = React.useState(0)

  return (
    <section
      id="loop"
      className="overflow-hidden border-t border-border py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-role uppercase">
            <RotateCw className="h-3.5 w-3.5" />
            THE EVOLVING DECISION LOOP
          </span>
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Every job goes through the same six steps — for you and for it.
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Discovery is not the finish line. Fulcra keeps working after the
            role is found. Use the loop rail below to inspect how a single job
            transforms through each phase of the system.
          </p>
        </div>

        {/* The 6-Step Loop Interactive Controller Rail */}
        <div className="mb-8 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {STEPS.map((step, i) => {
            const Icon = step.icon
            const isActive = activeStep === i
            return (
              <button
                key={step.idx}
                type="button"
                onClick={() => setActiveStep(i)}
                className={`flex cursor-pointer flex-col rounded-xl border p-4 text-left transition-all ${
                  isActive
                    ? "-translate-y-1 border-role bg-card shadow-sm ring-1 ring-role/30"
                    : "border-border bg-muted/30 hover:border-border/80 hover:bg-card"
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span
                    className={`font-mono text-xs font-bold ${isActive ? "text-role" : "text-muted-foreground"}`}
                  >
                    {step.idx}
                  </span>
                  <Icon
                    className={`h-4 w-4 ${isActive ? "text-role" : "text-muted-foreground"}`}
                  />
                </div>
                <div className="mt-3 font-heading text-sm font-semibold text-foreground">
                  {step.name}
                </div>
                <div className="mt-1 line-clamp-2 text-[11px] leading-snug text-muted-foreground">
                  {step.summary}
                </div>
              </button>
            )
          })}
        </div>

        {/* The Active Evolving Stage Surface */}
        <SixStepStagePreview activeStep={activeStep} />

        {/* Return Loop Explanation Bar */}
        <div className="mt-6 flex flex-col justify-between gap-3 rounded-xl border border-border/80 bg-muted/20 p-4 font-mono text-xs text-muted-foreground sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <span className="flex size-5 items-center justify-center rounded-full bg-role/10 text-[10px] font-bold text-role">
              ↻
            </span>
            <span>
              <strong className="text-foreground">Continuous Learning:</strong>{" "}
              What you learn in Step 06 flows directly back into Step 01.
            </span>
          </div>
          <span className="flex items-center gap-1 font-semibold text-role">
            Zero repetitive resume editing <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </section>
  )
}
