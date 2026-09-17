"use client"

import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { Badge } from "@/components/ui/badge"

type Stage = "raw" | "normalized" | "structured"

export function JobUnderstandingSurface() {
  const [stage, setStage] = React.useState<Stage>("structured")

  return (
    <section className="border-t border-border py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold tracking-wider text-role uppercase">
                job intelligence
              </span>
              <Badge
                variant="outline"
                className="border-candidate/40 bg-candidate/10 font-mono text-[10px] text-candidate"
              >
                Preview
              </Badge>
            </div>
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              A job is more than a title and a pile of keywords.
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Most job boards treat postings as unindexed text blocks. Fulcra
              strips out buzzword padding, normalizes compensation and work
              models, and extracts verifiable requirement criteria.
            </p>
          </div>

          {/* 3-Stage Segmented Controller */}
          <div className="flex shrink-0 self-start rounded-lg border border-border bg-muted p-1 text-xs sm:self-auto">
            <button
              type="button"
              onClick={() => setStage("raw")}
              className={`cursor-pointer rounded-md px-3 py-1.5 font-mono text-xs transition-colors ${
                stage === "raw"
                  ? "bg-card font-semibold text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              01 Raw Listing
            </button>
            <button
              type="button"
              onClick={() => setStage("normalized")}
              className={`cursor-pointer rounded-md px-3 py-1.5 font-mono text-xs transition-colors ${
                stage === "normalized"
                  ? "bg-card font-semibold text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              02 Normalized
            </button>
            <button
              type="button"
              onClick={() => setStage("structured")}
              className={`cursor-pointer rounded-md px-3 py-1.5 font-mono text-xs transition-colors ${
                stage === "structured"
                  ? "bg-card font-semibold text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              03 Structured Requirements
            </button>
          </div>
        </div>

        {/* The Interactive Surface Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs sm:p-8">
          {/* Card Meta Bar */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-4">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded bg-muted font-mono text-xs font-semibold text-foreground">
                VS
              </span>
              <div>
                <span className="font-heading text-sm font-semibold text-foreground">
                  Senior Backend Engineer · Vela Systems
                </span>
                <span className="ml-2 font-mono text-xs text-muted-foreground">
                  via Greenhouse ATS
                </span>
              </div>
            </div>
            <span className="font-mono text-[11px] text-muted-foreground">
              Parser state:{" "}
              <span className="font-semibold text-role capitalize">
                {stage}
              </span>
            </span>
          </div>

          <AnimatePresence mode="wait">
            {stage === "raw" && (
              <motion.div
                key="raw"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="max-h-72 space-y-4 overflow-y-auto rounded-xl border border-border/70 bg-muted/30 p-5 font-mono text-xs text-muted-foreground"
              >
                <div className="font-semibold text-foreground">
                  About the role (Unstructured raw text):
                </div>
                <p>
                  &quot;We are seeking a rockstar, highly passionate Senior
                  Software Engineer to join our fast-paced, disruptive
                  engineering squad. The ideal candidate lives and breathes
                  distributed backend infrastructure, has 5+ years of
                  demonstrable hands-on experience in Go or equivalent systems
                  languages, and is comfortable navigating PostgreSQL and
                  high-throughput Redis caching layers...&quot;
                </p>
                <p>
                  &quot;Compensation target is around $160,000 to $190,000
                  depending on seniority, equity included. Position is 100%
                  remote within North America or equivalent timezone.&quot;
                </p>
              </motion.div>
            )}

            {stage === "normalized" && (
              <motion.div
                key="normalized"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 gap-4 sm:grid-cols-3"
              >
                {[
                  {
                    title: "Work Model",
                    val: "100% Remote",
                    note: "Normalized from geographic timezone clauses",
                    mono: false,
                  },
                  {
                    title: "Compensation Band",
                    val: "$160k – $190k / yr",
                    note: "Extracted base range + equity tier",
                    mono: true,
                  },
                  {
                    title: "Seniority Level",
                    val: "Senior (5+ yrs)",
                    note: "Architectural ownership & distributed scale",
                    mono: false,
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="space-y-1.5 rounded-xl border border-border bg-muted/20 p-4"
                  >
                    <span className="font-mono text-[11px] text-muted-foreground uppercase">
                      {item.title}
                    </span>
                    <div
                      className={`text-base font-semibold text-foreground ${item.mono ? "font-mono" : "font-heading"}`}
                    >
                      {item.val}
                    </div>
                    <p className="text-xs text-muted-foreground">{item.note}</p>
                  </div>
                ))}
              </motion.div>
            )}

            {stage === "structured" && (
              <motion.div
                key="structured"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-3 rounded-xl border border-border/80 bg-muted/20 p-4">
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="font-semibold text-foreground">
                        Verified Must-Haves
                      </span>
                      <span className="text-role">Primary Evaluation</span>
                    </div>
                    <ul className="space-y-2 text-xs text-muted-foreground">
                      {[
                        "Go (Golang) — 5+ years production backend",
                        "PostgreSQL — complex query optimization & schemas",
                        "Distributed Systems — high concurrency microservices",
                      ].map((req) => (
                        <li key={req} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-role" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3 rounded-xl border border-border/80 bg-muted/20 p-4">
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="font-semibold text-foreground">
                        Nice-to-Haves & Infrastructure
                      </span>
                      <span className="text-muted-foreground">
                        Secondary Signals
                      </span>
                    </div>
                    <ul className="space-y-2 text-xs text-muted-foreground">
                      {[
                        "AWS Cloud (ECS, RDS, S3, CloudWatch)",
                        "Kubernetes container orchestration",
                        "Telemetry & distributed tracing (OpenTelemetry)",
                      ].map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 font-mono text-xs text-muted-foreground">
                  <span>Source: Greenhouse ATS · Job ID: vela-be-2901</span>
                  <span className="text-success-text font-medium">
                    Ready for candidate evidence matching →
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
