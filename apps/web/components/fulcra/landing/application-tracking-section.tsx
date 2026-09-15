"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"
import { Tilt3D } from "@/components/fulcra/shared/tilt-3d"

const TIMELINE_EVENTS = [
  {
    title: "Moved to Interview",
    meta: "2026-09-08 · recruiter: A. Reyes",
    active: true,
  },
  {
    title: "Application viewed",
    meta: "2026-09-04",
    active: false,
  },
  {
    title: "Submitted — resume v15, cover v3",
    meta: "2026-09-02 · via company ATS",
    active: false,
  },
]

export function ApplicationTrackingSection() {
  return (
    <section className="border-t border-border py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Copy */}
          <div className="space-y-5 lg:col-span-5">
            <span className="block font-mono text-xs tracking-wider text-primary uppercase">
              application tracking
            </span>
            <h3 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Nothing you&apos;ve sent gets lost.
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Which resume, which cover letter, which answers, which recruiter —
              attached to every application, automatically, so you never have to
              reconstruct what you told a company six weeks ago.
            </p>
            <div className="font-mono text-[11px] text-muted-foreground">
              Lifecycle visualization preview. Application automation scheduled
              for Phase 11.
            </div>
          </div>

          {/* Right Column: Timeline Panel with 3D Tilt */}
          <div className="lg:col-span-7">
            <Tilt3D maxAngle={5} scale={1.01}>
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg sm:p-8">
                <div className="mb-5 flex items-center justify-between border-b border-border/80 pb-4">
                  <span className="font-heading text-base font-semibold text-foreground">
                    Senior Backend Engineer · Vela Systems
                  </span>
                  <Badge
                    variant="outline"
                    className="gap-1 border-primary/30 bg-accent font-mono text-[11px] text-primary"
                  >
                    <Clock className="h-3 w-3" />
                    In Progress
                  </Badge>
                </div>

                {/* Timeline Items with connecting rail */}
                <div className="relative space-y-5 pl-2">
                  <div
                    aria-hidden="true"
                    className="absolute top-2 bottom-2 left-[13px] w-0.5 bg-border"
                  />
                  {TIMELINE_EVENTS.map((item, idx) => (
                    <div key={idx} className="relative flex items-start gap-4">
                      <div
                        className={`mt-1 h-3 w-3 shrink-0 rounded-full border-2 border-card ${
                          item.active
                            ? "bg-primary ring-4 ring-primary/20"
                            : "bg-muted-foreground/40"
                        }`}
                      />
                      <div className="space-y-0.5">
                        <div className="text-xs font-semibold text-foreground">
                          {item.title}
                        </div>
                        <div className="font-mono text-[11px] text-muted-foreground">
                          {item.meta}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Tilt3D>
          </div>
        </div>
      </div>
    </section>
  )
}
