"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
} from "lucide-react"
import { Tilt3D } from "@/components/fulcra/shared/tilt-3d"
import { DIFF_ITEMS } from "./resume-tailoring-data"

export function ResumeTailoringSection() {
  const [selectedId, setSelectedId] = React.useState<string>("throughput")
  const [viewMode, setViewMode] = React.useState<
    "diff" | "provenance" | "final"
  >("diff")

  const activeItem =
    DIFF_ITEMS.find((item) => item.id === selectedId) ?? DIFF_ITEMS[0]

  return (
    <section className="border-t border-border py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Interactive Diff & Provenance Surface */}
          <div className="order-2 lg:order-1 lg:col-span-7">
            <Tilt3D maxAngle={4} scale={1.01}>
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-7">
                {/* Surface Header */}
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-role" />
                    <span className="font-heading text-sm font-semibold text-foreground">
                      Resume v14 → v15 (Tailored for Vela Systems)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-candidate/40 bg-candidate/10 font-mono text-[11px] font-semibold text-candidate"
                    >
                      PREVIEW
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-success-text border-success/30 bg-success/10 font-mono text-[11px] font-medium"
                    >
                      <ShieldCheck className="mr-1 h-3 w-3" />
                      Zero Hallucination
                    </Badge>
                  </div>
                </div>

                {/* Switcher & Bullet Selectors */}
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    {DIFF_ITEMS.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedId(item.id)}
                        className={`rounded px-2.5 py-1 font-mono text-xs transition-colors ${
                          selectedId === item.id
                            ? "bg-foreground font-medium text-background"
                            : "bg-muted/60 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center rounded-md border border-border bg-muted/40 p-0.5 font-mono text-xs">
                    <button
                      type="button"
                      onClick={() => setViewMode("diff")}
                      className={`rounded px-2 py-0.5 transition-colors ${
                        viewMode === "diff"
                          ? "bg-card font-semibold text-foreground shadow-xs"
                          : "text-muted-foreground"
                      }`}
                    >
                      Diff View
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("provenance")}
                      className={`rounded px-2 py-0.5 transition-colors ${
                        viewMode === "provenance"
                          ? "bg-card font-semibold text-foreground shadow-xs"
                          : "text-muted-foreground"
                      }`}
                    >
                      Provenance Link
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("final")}
                      className={`rounded px-2 py-0.5 transition-colors ${
                        viewMode === "final"
                          ? "bg-card font-semibold text-foreground shadow-xs"
                          : "text-muted-foreground"
                      }`}
                    >
                      Final Text
                    </button>
                  </div>
                </div>

                {/* Active Content Body */}
                <div className="min-h-[190px] rounded-lg border border-border/80 bg-background/70 p-4 font-mono text-xs">
                  <div className="mb-3 flex items-center justify-between border-b border-border/40 pb-2 text-[11px] text-muted-foreground">
                    <span className="font-semibold text-role">
                      {activeItem.targetReq}
                    </span>
                    <span className="text-muted-foreground">
                      Target Role Alignment
                    </span>
                  </div>

                  {viewMode === "diff" && (
                    <div className="space-y-2.5">
                      <div className="rounded border border-destructive/20 bg-destructive/10 px-3 py-2 text-destructive line-through">
                        - {activeItem.before}
                      </div>
                      <div className="text-success-text rounded border border-success/30 bg-success/15 px-3 py-2 font-medium">
                        + {activeItem.after}
                      </div>
                      <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <ArrowRight className="h-3 w-3 shrink-0 text-role" />
                        <span>{activeItem.impact}</span>
                      </div>
                    </div>
                  )}

                  {viewMode === "provenance" && (
                    <div className="space-y-3">
                      <div className="rounded border border-role/25 bg-role/5 p-3">
                        <div className="mb-1 flex items-center justify-between text-[11px] font-semibold text-role">
                          <span>SOURCE RECORD ANCHOR</span>
                          <ExternalLink className="h-3 w-3" />
                        </div>
                        <div className="font-semibold text-foreground">
                          {activeItem.evidenceSource}
                        </div>
                        <div className="mt-1 text-muted-foreground italic">
                          &ldquo;{activeItem.evidenceSnippet}&rdquo;
                        </div>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Fulcra pulled these verified metrics directly from your
                        uploaded repository commits and performance review
                        records. No terms or claims were fabricated.
                      </p>
                    </div>
                  )}

                  {viewMode === "final" && (
                    <div className="space-y-2">
                      <div className="rounded border border-border bg-card p-3 font-sans text-xs leading-relaxed text-foreground">
                        <p className="font-medium text-foreground">
                          {activeItem.after}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <CheckCircle2 className="text-success-text h-3.5 w-3.5" />
                        <span>
                          Ready to export to PDF or ATS-compatible plain text.
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Grounding Footer */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border/70 pt-3 font-mono text-[11px] text-muted-foreground">
                  <span>Policy: Evidence-Grounded Only</span>
                  <span className="font-semibold text-candidate">
                    Missing evidence is flagged, never invented.
                  </span>
                </div>
              </div>
            </Tilt3D>
          </div>

          {/* Right Column: Copy */}
          <div className="order-1 space-y-5 lg:order-2 lg:col-span-5">
            <div className="flex items-center gap-2">
              <span className="block font-mono text-xs tracking-wider text-role uppercase">
                RESUME TAILORING
              </span>
              <span className="rounded bg-muted px-2 py-0.5 font-mono text-[10px] font-semibold text-candidate">
                PREVIEW
              </span>
            </div>

            <h3 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Tailored to the job. Never invented.
            </h3>

            <p className="text-sm leading-relaxed text-muted-foreground">
              Every line Fulcra adapts is traced back to verified proof in your
              profile — a shipped feature, an architectural decision, or a
              metric. If the evidence does not exist, Fulcra reports the gap
              instead of hallucinating qualifications.
            </p>

            <div className="space-y-2.5 pt-2 text-xs text-muted-foreground">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-candidate" />
                <span>
                  <strong className="text-foreground">
                    Line-by-line provenance:
                  </strong>{" "}
                  Click any bullet to see the exact employment record,
                  repository commit, or metric verifying it.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-candidate" />
                <span>
                  <strong className="text-foreground">
                    Honest gap flagging:
                  </strong>{" "}
                  If a job requires 5 years of Kubernetes and you have 2, Fulcra
                  frames your real experience accurately without faking
                  seniority.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
