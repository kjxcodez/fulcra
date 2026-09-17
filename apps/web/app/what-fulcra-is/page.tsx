import * as React from "react"
import { Metadata } from "next"
import Link from "next/link"
import { PublicHeader } from "@/components/fulcra/navigation/public-header"
import { PublicFooter } from "@/components/fulcra/navigation/public-footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check, X, ShieldAlert } from "lucide-react"

export const metadata: Metadata = {
  title: "What Fulcra Is & Is Not — Explainable Job Search",
  description:
    "Understand Fulcra's positioning: why we are not a job board, resume builder, or auto-apply bot, but an evidence-linked decision layer.",
  alternates: {
    canonical: "/what-fulcra-is",
  },
}

const COMPARISONS = [
  {
    num: "01",
    category: "The Platform Role",
    notTitle: "Not a Job Board",
    notBody:
      "Traditional job boards monetize volume: the more listings they scrape, the more ads they show, and the more low-intent applications get sent. They have no incentive to tell a candidate that a role is a poor fit.",
    isTitle: "The Decision Layer",
    isBody:
      "Fulcra sits between you and the opportunity. We read the role's requirements with the same rigor we read your experience, then give you an honest recommendation on whether you should apply.",
  },
  {
    num: "02",
    category: "Resume Customization",
    notTitle: "Not a Generative Resume Builder",
    notBody:
      "Generic AI resume tools fabricate bullet points, invent metrics, and pad technologies you have never touched. In an interview, fabricated claims collapse immediately.",
    isTitle: "Evidence-Grounded Tailoring",
    isBody:
      "Fulcra only restructures, re-emphasizes, and surfaces evidence already verified in your profile. If you lack proof for a requirement, Fulcra surfaces the gap instead of inventing achievements.",
  },
  {
    num: "03",
    category: "Application Screening",
    notTitle: "Not an ATS Keyword Stuffer",
    notBody:
      "Tools that promise to 'beat the ATS' hide invisible white text or spam buzzwords. Modern ATS parsers flag keyword stuffing and hiring managers immediately discard generic buzzword soup.",
    isTitle: "Explainable Compatibility Simulation",
    isBody:
      "We simulate how semantic matching systems and hiring managers actually parse candidate evidence against role requirements, highlighting exact alignment and missing prerequisites.",
  },
  {
    num: "04",
    category: "Application Execution",
    notTitle: "Not an Auto-Apply Bot",
    notBody:
      "Bots that blast 500 applications overnight flood recruiting pipelines, trigger employer spam filters, and damage your personal professional standing across companies you might want to join later.",
    isTitle: "High-Intent Controlled Execution",
    isBody:
      "Every submission happens under rules you set, with authentic materials, complete version history, and direct attribution to the original employer ATS.",
  },
  {
    num: "05",
    category: "Scoring Transparency",
    notTitle: "Not a Black-Box Score",
    notBody:
      "Algorithms that output an arbitrary '88% Match' without explaining how they reached that number leave you guessing what to improve or why you were rejected.",
    isTitle: "A Score You Can Argue With",
    isBody:
      "Every match is decomposed into skills, experience, seniority, domain, and compensation. You can inspect every piece of candidate proof and challenge any assumption.",
  },
]

export default function WhatFulcraIsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <PublicHeader />

      <main className="mx-auto max-w-4xl flex-1 space-y-14 px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="space-y-4">
          <span className="font-mono text-xs font-semibold tracking-wider text-role uppercase">
            Architectural Manifesto
          </span>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            What Fulcra Is — and What It Is Not
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
            The job search has been overwhelmed by spam: auto-apply bots, fake
            resume bullet points, and opaque scoring systems. Fulcra exists to
            protect candidate credibility and give you back control.
          </p>
        </div>

        {/* Five Contrasts */}
        <div className="space-y-8">
          {COMPARISONS.map((comp) => (
            <div
              key={comp.num}
              className="space-y-6 rounded-xl border border-border bg-card p-6 sm:p-8"
            >
              <div className="flex items-center justify-between border-b border-border/80 pb-3">
                <span className="font-mono text-xs font-semibold text-role">
                  Principle {comp.num} · {comp.category}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  Fulcra Standard
                </span>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Not */}
                <div className="space-y-2 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                  <div className="flex items-center gap-2 font-mono text-xs font-semibold text-destructive">
                    <X className="h-4 w-4 shrink-0" />
                    <span>{comp.notTitle.toUpperCase()}</span>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {comp.notBody}
                  </p>
                </div>

                {/* What it is */}
                <div className="space-y-2 rounded-lg border border-candidate/30 bg-candidate/5 p-4">
                  <div className="flex items-center gap-2 font-mono text-xs font-semibold text-candidate">
                    <Check className="h-4 w-4 shrink-0" />
                    <span>{comp.isTitle.toUpperCase()}</span>
                  </div>
                  <p className="text-xs leading-relaxed font-medium text-foreground">
                    {comp.isBody}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Our Engineering Commitment */}
        <div className="space-y-4 rounded-xl border border-border/80 bg-muted/30 p-6 sm:p-8">
          <div className="flex items-center gap-2 font-mono text-xs font-semibold text-role uppercase">
            <ShieldAlert className="h-4 w-4" />
            <span>Non-Negotiable Positioning</span>
          </div>
          <h2 className="font-heading text-xl font-semibold text-foreground">
            Evidence and honesty over hype.
          </h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            We will never fabricate numbers, inflate user counts, simulate fake
            match statistics, or compromise candidate privacy. When the system
            lacks sufficient evidence to verify a fit, it says so plainly.
          </p>
          <div className="pt-2">
            <Link href="/jobs">
              <Button className="bg-candidate font-medium text-white hover:bg-[#8C6E2E]">
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
