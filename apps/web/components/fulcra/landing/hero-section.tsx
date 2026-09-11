"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { InteractiveFulcrum } from "./interactive-fulcrum"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Copy & CTAs */}
          <div className="space-y-6 lg:col-span-5">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              <span>Live scoring, not a checklist</span>
            </div>

            {/* Title */}
            <h1 className="font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-[44px] lg:leading-[1.1]">
              Know what fits
              <br />
              before you apply.
            </h1>

            {/* Subtitle */}
            <p className="max-w-md text-base leading-relaxed text-muted-foreground">
              Fulcra reads the job the way it reads your resume, then shows you
              exactly where you stand — what matches, what&apos;s missing, and
              what to fix — before an application goes out.
            </p>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="/jobs">
                <Button
                  size="lg"
                  className="bg-primary font-medium text-white shadow-xs"
                >
                  Weigh your first job
                </Button>
              </Link>
              <a href="#matching">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-border text-foreground"
                >
                  See how scoring works
                </Button>
              </a>
            </div>

            {/* Monospace footnote */}
            <div className="pt-2 font-mono text-xs text-muted-foreground">
              no résumé rewrite guesswork · evidence-linked matching
            </div>
          </div>

          {/* Right Column: Visual Beam Card */}
          <div className="lg:col-span-7">
            <InteractiveFulcrum />
          </div>
        </div>
      </div>
    </section>
  )
}
