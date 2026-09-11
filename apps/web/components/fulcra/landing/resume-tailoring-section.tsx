"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { FileText, GitCompare } from "lucide-react"

export function ResumeTailoringSection() {
  return (
    <section className="border-t border-border py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column (Panel on desktop) */}
          <div className="order-2 lg:order-1 lg:col-span-7">
            <div className="rounded-xl border border-border bg-card p-6 shadow-xs transition-shadow duration-300 hover:shadow-md sm:p-8">
              <div className="mb-4 flex items-center justify-between border-b border-border/80 pb-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="font-heading text-base font-semibold text-foreground">
                    Resume v14 → v15
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className="gap-1 font-mono text-[11px] text-muted-foreground"
                >
                  <GitCompare className="h-3 w-3" />
                  Evidence-Linked Diff
                </Badge>
              </div>

              {/* Diff Lines */}
              <div className="space-y-2 font-mono text-xs leading-relaxed">
                <div className="rounded bg-destructive/10 px-3 py-2 text-destructive line-through">
                  - Worked on backend systems and APIs
                </div>
                <div className="text-success-text rounded bg-success/15 px-3 py-2 font-medium">
                  + Built and scaled distributed backend services handling 40M+
                  daily requests
                </div>
              </div>

              {/* Attribution */}
              <div className="mt-5 border-t border-border/80 pt-4 text-xs leading-relaxed text-muted-foreground">
                <span className="mb-0.5 block font-mono text-[11px] font-semibold text-foreground">
                  Sourced from Candidate History:
                </span>
                Work history → RapidQuest Solutions, &quot;Platform scale&quot;
                evidence entry (verified 2024–2026).
              </div>
            </div>
          </div>

          {/* Right Column (Copy) */}
          <div className="order-1 space-y-5 lg:order-2 lg:col-span-5">
            <span className="block font-mono text-xs tracking-wider text-muted-foreground uppercase">
              resume tailoring
            </span>
            <h3 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Tailored to the job. Never invented.
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Every line Fulcra changes is traced back to something already in
              your profile — a project, a role, a certification. If the evidence
              isn&apos;t there, it tells you what to add instead of making it
              up.
            </p>
            <div className="font-mono text-[11px] text-muted-foreground">
              Conceptual illustration. Resume intelligence automation scheduled
              for Phase 10.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
