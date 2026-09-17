import * as React from "react"
import { Metadata } from "next"
import { PublicHeader } from "@/components/fulcra/navigation/public-header"
import { PublicFooter } from "@/components/fulcra/navigation/public-footer"
import { FulcraCursor } from "@/components/fulcra/shared/fulcra-cursor"
import { GrainOverlay } from "@/components/fulcra/shared/grain-overlay"
import { HeroSection } from "@/components/fulcra/landing/hero-section"
import { WhyFulcraExistsSection } from "@/components/fulcra/landing/why-fulcra-exists-section"
import { JobUnderstandingSurface } from "@/components/fulcra/landing/job-understanding-surface"
import { EvidenceComparisonSurface } from "@/components/fulcra/landing/evidence-comparison-surface"
import { SixStepLoop } from "@/components/fulcra/landing/six-step-loop"
import { MatchAnalysisSection } from "@/components/fulcra/landing/match-analysis-section"
import { ResumeTailoringSection } from "@/components/fulcra/landing/resume-tailoring-section"
import { ApplicationTrackingSection } from "@/components/fulcra/landing/application-tracking-section"
import { RealJobsPreviewSection } from "@/components/fulcra/landing/real-jobs-preview-section"
import { WhatFulcraIsSection } from "@/components/fulcra/landing/what-fulcra-is-section"
import { ModesSection } from "@/components/fulcra/landing/modes-section"
import { CtaBand } from "@/components/fulcra/landing/cta-band"

// Section 5.1 SEO Title and Description Template
export const metadata: Metadata = {
  title: "Fulcra — AI Job Search, Job Matching & Resume Intelligence",
  description:
    "Discover relevant jobs, compare your experience with real requirements, optimize your resume, and track every application with Fulcra.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Fulcra — AI Job Search, Job Matching & Resume Intelligence",
    description:
      "Discover relevant jobs, compare your experience with real requirements, optimize your resume, and track every application with Fulcra.",
    type: "website",
    url: "https://fulcra.app",
    siteName: "Fulcra",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fulcra — AI Job Search, Job Matching & Resume Intelligence",
    description:
      "Discover relevant jobs, compare your experience with real requirements, optimize your resume, and track every application with Fulcra.",
  },
}

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground selection:bg-accent selection:text-accent-foreground">
      <GrainOverlay />
      <FulcraCursor />
      <PublicHeader />
      <main className="flex-1">
        {/* 1. Hero with physical fulcrum balance & live recalculating evidence score */}
        <HeroSection />

        {/* 2. Core Narrative Collision: Company requirements vs. Candidate evidence */}
        <WhyFulcraExistsSection />

        {/* 3. Stage 1: See What Fulcra Sees (Raw -> Normalized -> Structured) */}
        <JobUnderstandingSurface />

        {/* 4. Stage 2: See What Fulcra Compares (Table with 4 honesty states) */}
        <EvidenceComparisonSurface />

        {/* 5. The Living 6-Step Loop with interactive evolving stages */}
        <SixStepLoop />

        {/* 6. Match Analysis: Interactive glass box with dimension drill-down */}
        <MatchAnalysisSection />

        {/* 7. Resume Tailoring: Interactive diff with provenance links & zero hallucination */}
        <ResumeTailoringSection />

        {/* 8. Application Tracking: Timeline audit trail with attached artifacts & logs */}
        <ApplicationTrackingSection />

        {/* 9. Real Jobs Preview: 3 verified index roles from fixtures */}
        <RealJobsPreviewSection />

        {/* 10. Positioning: What Fulcra is vs. is not + system architecture loop */}
        <WhatFulcraIsSection />

        {/* 11. Modes: Candidate Profile Loop vs. Recruiter Candidate Pool Ranking */}
        <ModesSection />

        {/* 12. Final High-Intent CTA Band */}
        <CtaBand />
      </main>
      <PublicFooter />
    </div>
  )
}
