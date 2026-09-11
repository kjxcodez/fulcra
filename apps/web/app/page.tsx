import * as React from "react"
import { PublicHeader } from "@/components/fulcra/navigation/public-header"
import { PublicFooter } from "@/components/fulcra/navigation/public-footer"
import { FulcraCursor } from "@/components/fulcra/shared/fulcra-cursor"
import { HeroSection } from "@/components/fulcra/landing/hero-section"
import { SixStepLoop } from "@/components/fulcra/landing/six-step-loop"
import { MatchAnalysisSection } from "@/components/fulcra/landing/match-analysis-section"
import { ResumeTailoringSection } from "@/components/fulcra/landing/resume-tailoring-section"
import { ApplicationTrackingSection } from "@/components/fulcra/landing/application-tracking-section"
import { ModesSection } from "@/components/fulcra/landing/modes-section"
import { CtaBand } from "@/components/fulcra/landing/cta-band"

export const metadata = {
  title: "Fulcra — Know what fits before you apply",
  description:
    "Live scoring, not a checklist. Fulcra reads the job the way it reads your resume, then shows you exactly where you stand with explainable, evidence-linked matching.",
}

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-accent selection:text-accent-foreground">
      <FulcraCursor />
      <PublicHeader />
      <main className="flex-1">
        <HeroSection />
        <SixStepLoop />
        <MatchAnalysisSection />
        <ResumeTailoringSection />
        <ApplicationTrackingSection />
        <ModesSection />
        <CtaBand />
      </main>
      <PublicFooter />
    </div>
  )
}
