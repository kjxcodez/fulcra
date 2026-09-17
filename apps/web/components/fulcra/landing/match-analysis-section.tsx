"use client"

import * as React from "react"
import { Check, AlertCircle, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tilt3D } from "@/components/fulcra/shared/tilt-3d"

interface DimensionDetail {
  label: string
  value: string
  isCandidate: boolean
  requirement: string
  evidence: string
  reason: string
}

const DIMENSIONS: DimensionDetail[] = [
  {
    label: "Skills",
    value: "94%",
    isCandidate: true,
    requirement: "Go, PostgreSQL, High-throughput systems, Redis, AWS",
    evidence:
      "5.5 yrs Go in production; advanced PostgreSQL query tuning; Redis clustering",
    reason:
      "Direct match on all mandatory backend skills. Minor gap on Kubernetes admin.",
  },
  {
    label: "Experience",
    value: "78%",
    isCandidate: false,
    requirement: "5+ years backend engineering in SaaS or platform engineering",
    evidence: "5.5 years cumulative tenure across 2 verified engineering roles",
    reason:
      "Exceeds tenure floor; scope matches mid-to-high scale SaaS operations.",
  },
  {
    label: "Seniority",
    value: "100%",
    isCandidate: true,
    requirement: "Senior Level: Autonomous ownership of distributed components",
    evidence:
      "Tech lead on RapidQuest platform core; mentored 3 junior engineers",
    reason: "Exact alignment with Senior leveling criteria.",
  },
  {
    label: "Domain",
    value: "82%",
    isCandidate: false,
    requirement: "High-concurrency streaming, telemetry, distributed telemetry",
    evidence: "Built services handling 40M+ daily events at RapidQuest",
    reason:
      "High concurrency experience verified; telemetry domain is partially adjacent.",
  },
  {
    label: "Compensation",
    value: "79%",
    isCandidate: false,
    requirement: "Posted range: $160,000 – $190,000 base + equity",
    evidence: "Candidate target threshold: $170,000 base",
    reason:
      "Candidate target is comfortably within the employer's published band.",
  },
]

export function MatchAnalysisSection() {
  const [selectedIdx, setSelectedIdx] = React.useState(0)
  const activeDetail = DIMENSIONS[selectedIdx]

  return (
    <section id="matching" className="border-t border-border py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Copy Column */}
          <div className="space-y-5 lg:col-span-5">
            <span className="block font-mono text-xs tracking-wider text-role uppercase">
              glass-box diagnostics
            </span>
            <h3 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              A score you can argue with — because you can see inside it.
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              No single opaque number. Every score decomposes into five
              independent dimensions. Click any dimension on the card to inspect
              the exact requirements and candidate proof behind it.
            </p>

            {/* Interactive Gap Badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => setSelectedIdx(0)}
                className="cursor-pointer"
              >
                <Badge
                  variant="outline"
                  className="text-success-text inline-flex items-center gap-1.5 border-success/30 bg-success/10 px-2.5 py-1 text-xs transition-colors hover:bg-success/20"
                >
                  <Check className="h-3.5 w-3.5 text-success" />
                  <span>Strong: Go, PostgreSQL, Distributed</span>
                </Badge>
              </button>
              <button
                type="button"
                onClick={() => setSelectedIdx(0)}
                className="cursor-pointer"
              >
                <Badge
                  variant="outline"
                  className="text-warning-text inline-flex items-center gap-1.5 border-warning/30 bg-warning/10 px-2.5 py-1 text-xs transition-colors hover:bg-warning/20"
                >
                  <AlertCircle className="h-3.5 w-3.5 text-warning" />
                  <span>Missing: Kubernetes</span>
                </Badge>
              </button>
            </div>

            {/* Inspected Dimension Detail Panel */}
            <div className="space-y-2 rounded-xl border border-border bg-card p-4 font-mono text-xs shadow-2xs">
              <div className="flex items-center justify-between font-semibold text-role">
                <span>
                  Inspecting: {activeDetail.label} ({activeDetail.value})
                </span>
                <Info className="h-3.5 w-3.5" />
              </div>
              <div>
                <span className="text-muted-foreground">Requirement:</span>{" "}
                {activeDetail.requirement}
              </div>
              <div>
                <span className="font-semibold text-candidate">Proof:</span>{" "}
                {activeDetail.evidence}
              </div>
              <div className="border-t border-border/60 pt-1 text-[11px] text-muted-foreground">
                {activeDetail.reason}
              </div>
            </div>
          </div>

          {/* Panel Column with 3D Tilt */}
          <div className="lg:col-span-7">
            <Tilt3D maxAngle={5} scale={1.01}>
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg sm:p-8">
                <div className="mb-4 flex items-center justify-between border-b border-border/80 pb-4">
                  <div className="font-heading text-base font-semibold text-foreground">
                    Match breakdown · Glass-Box View
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">
                    Role: Senior Backend Engineer
                  </span>
                </div>

                {/* Clickable Dimension Rows */}
                <div className="space-y-3">
                  {DIMENSIONS.map((row, idx) => {
                    const isSelected = selectedIdx === idx
                    return (
                      <button
                        key={row.label}
                        type="button"
                        onClick={() => setSelectedIdx(idx)}
                        className={`flex w-full cursor-pointer items-center justify-between gap-4 rounded-lg border p-2.5 text-left text-xs font-medium transition-all ${
                          isSelected
                            ? "border-role bg-accent/40 shadow-2xs"
                            : "border-transparent hover:bg-muted/40"
                        }`}
                      >
                        <span className="w-28 text-foreground">
                          {row.label}
                        </span>
                        <div className="flex flex-1 items-center gap-3">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                            <div
                              className={`h-full transition-all duration-500 ${
                                row.isCandidate ? "bg-candidate" : "bg-role"
                              }`}
                              style={{ width: row.value }}
                            />
                          </div>
                          <span className="w-10 text-right font-mono text-xs font-bold text-foreground">
                            {row.value}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Legend & Aggregate */}
                <div className="mt-6 flex items-center justify-between border-t border-border/80 pt-4 font-mono text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5">
                      <span className="inline-block h-2 w-2 rounded-full bg-candidate" />
                      Candidate evidence
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="inline-block h-2 w-2 rounded-full bg-role" />
                      Role requirement
                    </span>
                  </div>
                  <span className="font-semibold text-foreground">
                    94% aggregate
                  </span>
                </div>
              </div>
            </Tilt3D>

            {/* Standing Disclaimer */}
            <p className="mt-3 text-center font-mono text-[11px] text-muted-foreground sm:text-left">
              Match scores are compatibility estimates, not a guarantee of any
              employer&apos;s or ATS&apos;s ranking.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
