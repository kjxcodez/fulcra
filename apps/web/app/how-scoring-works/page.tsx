import * as React from "react"
import { Metadata } from "next"
import Link from "next/link"
import { PublicHeader } from "@/components/fulcra/navigation/public-header"
import { PublicFooter } from "@/components/fulcra/navigation/public-footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  XCircle,
  ArrowRight,
  ShieldCheck,
  Scale,
} from "lucide-react"

export const metadata: Metadata = {
  title: "How Fulcra's Job Match Scoring Works",
  description:
    "See exactly how Fulcra compares your skills, experience, and evidence against real job requirements — no black-box scores.",
  alternates: {
    canonical: "/how-scoring-works",
  },
}

const HONESTY_STATES = [
  {
    state: "Strong match",
    badgeClass: "border-success/40 bg-success/10 text-success-text",
    icon: CheckCircle2,
    desc: "Direct, verified evidence in your profile matches an explicit role requirement. Traceable to work history or production artifacts.",
  },
  {
    state: "Partial match",
    badgeClass: "border-candidate/40 bg-candidate/10 text-candidate",
    icon: Scale,
    desc: "Adjacent competency or transferable experience (e.g. deep PostgreSQL performance tuning applied to a CockroachDB requirement).",
  },
  {
    state: "Not verified",
    badgeClass: "border-warning/40 bg-warning/10 text-warning-text",
    icon: AlertTriangle,
    desc: "A candidate claim or skill mention that lacks supporting context, duration, or verifiable production proof.",
  },
  {
    state: "Evidence unavailable",
    badgeClass: "border-border bg-muted/60 text-muted-foreground",
    icon: HelpCircle,
    desc: "Neither the candidate profile nor the job listing provides sufficient structured data to evaluate compatibility honestly.",
  },
]

const DIMENSIONS = [
  {
    name: "1. Skills & Technologies",
    weight: "Primary",
    desc: "Evaluates exact and semantic tech stack match based on verifiable production usage rather than keyword stuffing.",
    example:
      "Requires Go + distributed systems. Candidate has 4 years of verified Go microservice development at 40M req/day.",
  },
  {
    name: "2. Experience Depth",
    weight: "Tenure & Scope",
    desc: "Calculates years in relevant functional roles, complexity of previous architectures, and team size/ownership.",
    example:
      "5+ years required vs 5.5 years verified in candidate career timeline.",
  },
  {
    name: "3. Seniority Tier",
    weight: "Autonomous Impact",
    desc: "Differentiates between task execution (Junior/Mid) and architectural ownership, mentoring, and technical strategy (Senior/Staff).",
    example:
      "Role is Senior level requiring cross-functional technical leadership; candidate was Staff-track lead.",
  },
  {
    name: "4. Domain & Scale",
    weight: "Operational Context",
    desc: "Assesses familiarity with industry constraints (e.g., fintech compliance, real-time telemetry, multi-region low latency).",
    example: "High-concurrency streaming vs batch processing background.",
  },
  {
    name: "5. Compensation Alignment",
    weight: "Objective Filter",
    desc: "Compares advertised salary/equity ranges against candidate target requirements to prevent wasted interview cycles.",
    example:
      "Posted $165k–$190k base aligns within candidate $170k target threshold.",
  },
]

export default function HowScoringWorksPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <PublicHeader />

      <main className="mx-auto max-w-4xl flex-1 space-y-16 px-4 py-12 sm:px-6 lg:px-8">
        {/* Page Hero */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold tracking-wider text-role uppercase">
              Methodology & Standards
            </span>
            <span className="rounded bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
              Glass-Box Architecture
            </span>
          </div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How Fulcra&apos;s Job Match Scoring Works
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
            Most hiring platforms produce an opaque percentage with zero
            explanation. Fulcra operates on a strict glass-box principle: every
            calculation is decomposed into five dimensions with explicit
            evidence provenance attached.
          </p>
        </div>

        {/* The 4 Honesty States */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="font-heading text-2xl font-semibold text-foreground">
              The Four Honesty States
            </h2>
            <p className="text-sm text-muted-foreground">
              We never collapse uncertainty into false confidence. When data is
              missing or unverified, Fulcra states the condition plainly.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {HONESTY_STATES.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.state}
                  className="space-y-3 rounded-xl border border-border bg-card p-5"
                >
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className={`gap-1.5 font-mono text-xs ${item.badgeClass}`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{item.state}</span>
                    </Badge>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </section>

        {/* The Five Dimensions */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="font-heading text-2xl font-semibold text-foreground">
              The Five Compatibility Dimensions
            </h2>
            <p className="text-sm text-muted-foreground">
              A candidate is never a single score. Fulcra weighs compatibility
              along five independent axes:
            </p>
          </div>

          <div className="space-y-4">
            {DIMENSIONS.map((dim) => (
              <div
                key={dim.name}
                className="space-y-2.5 rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-base font-semibold text-foreground">
                    {dim.name}
                  </h3>
                  <span className="font-mono text-xs text-muted-foreground">
                    {dim.weight}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {dim.desc}
                </p>
                <div className="rounded border border-border/70 bg-muted/40 p-3 font-mono text-[11px] text-foreground">
                  <span className="font-semibold text-role">
                    Worked Example:
                  </span>{" "}
                  {dim.example}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What We Infer vs What We Do Not */}
        <section className="space-y-6">
          <h2 className="font-heading text-2xl font-semibold text-foreground">
            What Fulcra Does and Does Not Infer
          </h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-3 rounded-xl border border-success/30 bg-success/5 p-6">
              <div className="text-success-text flex items-center gap-2 font-mono text-xs font-semibold">
                <ShieldCheck className="h-4 w-4" />
                <span>WHAT FULCRA INFERS</span>
              </div>
              <ul className="list-inside list-disc space-y-2 text-xs text-muted-foreground">
                <li>
                  Direct technical equivalencies (e.g. Next.js implies React
                  expertise).
                </li>
                <li>
                  Cumulative tenure calculated from dated work history spans.
                </li>
                <li>
                  System complexity deduced from documented scaling metrics.
                </li>
              </ul>
            </div>

            <div className="space-y-3 rounded-xl border border-destructive/30 bg-destructive/5 p-6">
              <div className="flex items-center gap-2 font-mono text-xs font-semibold text-destructive">
                <XCircle className="h-4 w-4" />
                <span>WHAT FULCRA NEVER INFERS</span>
              </div>
              <ul className="list-inside list-disc space-y-2 text-xs text-muted-foreground">
                <li>
                  Unlisted programming languages or tools never documented in
                  evidence.
                </li>
                <li>
                  Fabricated job achievements or unverified revenue claims.
                </li>
                <li>Guesses when role requirements are vaguely specified.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Footer Disclaimer & CTA */}
        <div className="space-y-4 rounded-xl border border-border bg-card p-6 text-center">
          <p className="mx-auto max-w-xl font-mono text-xs text-muted-foreground">
            Match scores and ATS diagnostics are compatibility estimates based
            on the information available — they simulate how a system is likely
            to treat your application, not a guarantee of any specific
            employer&apos;s or ATS&apos;s ranking.
          </p>
          <div className="flex justify-center pt-2">
            <Link href="/jobs">
              <Button
                size="lg"
                className="bg-candidate font-medium text-white hover:bg-[#8C6E2E]"
              >
                Explore normalized roles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
