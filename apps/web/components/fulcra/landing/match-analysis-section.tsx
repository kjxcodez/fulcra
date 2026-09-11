"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"

const BREAKDOWN_ROWS = [
  { label: "Skills", value: "94%", isCandidate: true },
  { label: "Experience", value: "78%", isCandidate: false },
  { label: "Seniority", value: "100%", isCandidate: true },
  { label: "Domain", value: "82%", isCandidate: false },
  { label: "Compensation", value: "79%", isCandidate: false },
]

export function MatchAnalysisSection() {
  return (
    <section id="matching" className="border-t border-border py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Copy Column */}
          <div className="space-y-5 lg:col-span-5">
            <span className="block font-mono text-xs tracking-wider text-muted-foreground uppercase">
              match analysis
            </span>
            <h3 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              A score you can argue with — because you can see inside it.
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              No single opaque number. Every match breaks down into skills,
              seniority, domain, location, and comp, each with the evidence
              behind it.
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              <Badge
                variant="outline"
                className="text-success-text border-success/30 bg-success-subtle text-xs"
              >
                Strong: React, TypeScript, PostgreSQL
              </Badge>
              <Badge
                variant="outline"
                className="text-warning-text border-warning/30 bg-warning-subtle text-xs"
              >
                Missing: Kubernetes
              </Badge>
            </div>

            <div className="pt-2 font-mono text-[11px] text-muted-foreground">
              Representative diagnostic breakdown. Real calculation requires
              Candidate Domain & Matching Engine.
            </div>
          </div>

          {/* Panel Column */}
          <div className="lg:col-span-7">
            <div className="rounded-xl border border-border bg-card p-6 shadow-xs transition-shadow duration-300 hover:shadow-md sm:p-8">
              <div className="mb-4 flex items-center justify-between border-b border-border/80 pb-4">
                <div className="font-heading text-base font-semibold text-foreground">
                  Match breakdown
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  Role: Senior Backend Engineer
                </span>
              </div>

              <div className="space-y-4">
                {BREAKDOWN_ROWS.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between gap-4 text-xs font-medium"
                  >
                    <span className="w-28 text-foreground">{row.label}</span>
                    <div className="flex flex-1 items-center gap-3">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full transition-all duration-700 ${
                            row.isCandidate ? "bg-candidate" : "bg-role"
                          }`}
                          style={{ width: row.value }}
                        />
                      </div>
                      <span className="w-10 text-right font-mono text-xs text-muted-foreground">
                        {row.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

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
                <span>94% aggregate</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
