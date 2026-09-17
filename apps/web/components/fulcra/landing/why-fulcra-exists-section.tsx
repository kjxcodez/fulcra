"use client"

import * as React from "react"
import {
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ArrowDown,
} from "lucide-react"

export function WhyFulcraExistsSection() {
  return (
    <section className="border-t border-border bg-card/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Editorial Narrative Header */}
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <span className="font-mono text-xs font-semibold tracking-wider text-role uppercase">
            The Fundamental Gap
          </span>
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl lg:leading-[1.15]">
            A job posting tells you what a company wants. Your resume tells you
            what you&apos;ve done.
            <br />
            <span className="font-normal text-muted-foreground">
              Neither tells you what happens when the two meet.
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Candidates apply blind, hoping an algorithm guesses right. Employers
            drown in generic applications, filtering with black-box scores.
            Fulcra exists to provide the transparent reasoning in between.
          </p>
        </div>

        {/* The Collision & Decision Diagram */}
        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-11 lg:items-center">
          {/* Side A: What the Company Wants (Role) */}
          <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-2xs lg:col-span-3">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <span className="font-mono text-xs font-semibold text-role uppercase">
                The Role
              </span>
              <span className="font-mono text-[11px] text-muted-foreground">
                Company Demand
              </span>
            </div>
            <div className="space-y-2.5 text-xs text-muted-foreground">
              <div className="rounded-md border border-border/60 bg-muted/30 p-2.5 font-mono text-[11px]">
                &quot;Senior Backend Engineer · 5+ yrs distributed systems, Go,
                PostgreSQL, AWS&quot;
              </div>
              <ul className="space-y-1.5 pl-1">
                <li>• Unspoken architecture constraints</li>
                <li>• Must-haves buried in prose</li>
                <li>• Strict budget and leveling bands</li>
              </ul>
            </div>
          </div>

          {/* Center: The Fulcra Fulcrum / Decision Engine */}
          <div className="flex flex-col items-center justify-center gap-3 text-center lg:col-span-5">
            <div className="hidden w-full items-center justify-center gap-2 font-mono text-xs text-muted-foreground lg:flex">
              <ArrowRight className="h-4 w-4 text-role" />
              <span>Collision Point</span>
              <ArrowRight className="h-4 w-4 rotate-180 text-candidate" />
            </div>

            <div className="w-full space-y-4 rounded-2xl border-2 border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-center gap-2">
                <span className="flex h-3 w-3 rounded-full bg-candidate" />
                <span className="font-heading text-lg font-bold text-foreground">
                  Fulcra Decision Layer
                </span>
                <span className="flex h-3 w-3 rounded-full bg-role" />
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Weighs verifiable candidate proof against normalized role
                demands. Shows the reasoning behind every dimension instead of a
                single black-box score.
              </p>

              {/* 4 Output Streams */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-left font-mono text-[11px]">
                <div className="text-success-text flex items-center gap-1.5 rounded border border-success/30 bg-success/10 p-2">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  <span>What matches</span>
                </div>
                <div className="text-warning-text flex items-center gap-1.5 rounded border border-warning/30 bg-warning/10 p-2">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                  <span>What is missing</span>
                </div>
                <div className="flex items-center gap-1.5 rounded border border-border bg-muted/60 p-2 text-muted-foreground">
                  <HelpCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>What is uncertain</span>
                </div>
                <div className="flex items-center gap-1.5 rounded border border-candidate/30 bg-candidate/10 p-2 text-candidate">
                  <ArrowDown className="h-3.5 w-3.5 shrink-0" />
                  <span>What to do next</span>
                </div>
              </div>
            </div>
          </div>

          {/* Side B: What You Have Done (Candidate) */}
          <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-2xs lg:col-span-3">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <span className="font-mono text-xs font-semibold text-candidate uppercase">
                Your Evidence
              </span>
              <span className="font-mono text-[11px] text-muted-foreground">
                Candidate Proof
              </span>
            </div>
            <div className="space-y-2.5 text-xs text-muted-foreground">
              <div className="rounded-md border border-border/60 bg-muted/30 p-2.5 font-mono text-[11px]">
                &quot;5.5 yrs backend engineering · RapidQuest Platform (40M
                req/day), Go, Postgres&quot;
              </div>
              <ul className="space-y-1.5 pl-1">
                <li>• Real production metrics and scale</li>
                <li>• Verified career history timeline</li>
                <li>• Exact skills proven in production</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
