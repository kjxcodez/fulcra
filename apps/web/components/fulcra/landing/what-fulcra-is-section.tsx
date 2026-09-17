"use client"

import * as React from "react"
import { Check, X, ArrowRight, Layers } from "lucide-react"
import Link from "next/link"

const COMPARISONS = [
  {
    isNot: "A traditional job board",
    isNotDesc:
      "Optimized for ad clicks, stale reposts, and inflating application vanity volume.",
    is: "The decision layer",
    isDesc:
      "Weighs whether a role fits your verified evidence before you spend your time applying.",
  },
  {
    isNot: "A generative resume builder",
    isNotDesc:
      "Inventing bullet points, exaggerating metrics, or hallucinating buzzwords.",
    is: "Evidence-grounded tailoring",
    isDesc:
      "Adapts phrasing only where traced directly to verified proof in your profile history.",
  },
  {
    isNot: "An auto-apply spam bot",
    isNotDesc:
      "Spraying 500 unreviewed applications, burning company bridges and candidate reputation.",
    is: "Deliberate application intent",
    isDesc:
      "Every application is submitted with deliberate intent, custom tailoring, and complete audit tracking.",
  },
  {
    isNot: "A black-box percentage score",
    isNotDesc:
      "An arbitrary '87% Match' with zero breakdown, zero explanation, and zero recourse.",
    is: "A score you can argue with",
    isDesc:
      "Full decomposition across skills, seniority, domain, and experience with explicit gap flags.",
  },
]

export function WhatFulcraIsSection() {
  return (
    <section className="border-t border-border bg-card/40 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-14 max-w-2xl">
          <span className="mb-3 block font-mono text-xs font-semibold tracking-wider text-role uppercase">
            POSITIONING & PRINCIPLES
          </span>
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            What Fulcra is — and what it is not.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            The job market does not need another spam engine or opaque AI
            filter. Fulcra exists to bring honesty, evidence, and transparency
            to every step between a candidate and a role.
          </p>
        </div>

        {/* Architecture Comparison Banner */}
        <div className="mb-10 rounded-xl border border-border bg-background/80 p-6 sm:p-8">
          <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
            <div className="max-w-xl space-y-2">
              <div className="flex items-center gap-2 font-mono text-xs font-semibold text-role uppercase">
                <Layers className="h-4 w-4" />
                SYSTEM ARCHITECTURE: THE CONNECTIVE DECISION LAYER
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground sm:text-xl">
                Connecting siloed tools into one continuous loop.
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                Rather than jumping between disconnected job boards, AI resume
                writers, and separate tracking sheets, Fulcra unifies Discovery,
                Requirement Parsing, Match Diagnostics, and Application Audit
                under one single profile truth.
              </p>
            </div>

            {/* Visual mini-pipeline */}
            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border/80 bg-muted/40 p-3 font-mono text-[11px]">
              <span className="rounded border border-border bg-card px-2.5 py-1 text-foreground">
                01 Discover
              </span>
              <span className="text-muted-foreground">→</span>
              <span className="rounded border border-border bg-card px-2.5 py-1 text-foreground">
                02 Understand
              </span>
              <span className="text-muted-foreground">→</span>
              <span className="rounded border border-role/30 bg-role/15 px-2.5 py-1 font-semibold text-role">
                03 Fulcra Decision
              </span>
              <span className="text-muted-foreground">→</span>
              <span className="rounded border border-border bg-card px-2.5 py-1 text-foreground">
                04 Apply & Track
              </span>
            </div>
          </div>
        </div>

        {/* Comparison Cards Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {COMPARISONS.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-xs transition-shadow duration-200 hover:shadow-md"
            >
              <div className="space-y-4">
                {/* What it is NOT */}
                <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3.5">
                  <div className="flex items-center gap-2 font-mono text-xs font-semibold text-destructive">
                    <X className="h-3.5 w-3.5 shrink-0" />
                    <span>NOT {item.isNot.toUpperCase()}</span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {item.isNotDesc}
                  </p>
                </div>

                {/* What it IS */}
                <div className="rounded-lg border border-candidate/30 bg-candidate/5 p-3.5">
                  <div className="flex items-center gap-2 font-mono text-xs font-semibold text-candidate">
                    <Check className="h-3.5 w-3.5 shrink-0" />
                    <span>WHAT FULCRA IS: {item.is.toUpperCase()}</span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed font-medium text-foreground">
                    {item.isDesc}
                  </p>
                </div>
              </div>

              {/* Number footer */}
              <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-3 font-mono text-[10px] text-muted-foreground">
                <span>Principle 0{idx + 1}</span>
                <span className="text-role">Glass-Box Verification</span>
              </div>
            </div>
          ))}
        </div>

        {/* Manifesto Link */}
        <div className="mt-8 text-center">
          <Link
            href="/what-fulcra-is"
            className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-role transition-colors hover:underline"
          >
            <span>
              Read our complete engineering principles and architectural
              commitment
            </span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
