"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { Magnetic } from "@/components/fulcra/shared/magnetic"
import { InteractiveFulcrum } from "./interactive-fulcrum"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-14 sm:py-20 lg:py-24">
      {/* Subtle ambient lighting behind fulcrum */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-1/4 -z-10 h-96 w-96 -translate-y-1/2 rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(53,82,224,0.18) 0%, rgba(176,141,62,0.12) 50%, rgba(20,22,31,0) 80%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Copy & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6 lg:col-span-5"
          >
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
              <Magnetic strength={0.25}>
                <Link href="/jobs">
                  <Button
                    size="lg"
                    className="bg-primary font-medium text-white shadow-sm transition-shadow hover:shadow-md"
                  >
                    Weigh your first job
                  </Button>
                </Link>
              </Magnetic>

              <Magnetic strength={0.25}>
                <a href="#matching">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-border text-foreground hover:bg-muted/50"
                  >
                    See how scoring works
                  </Button>
                </a>
              </Magnetic>
            </div>

            {/* Monospace footnote */}
            <div className="pt-2 font-mono text-xs text-muted-foreground">
              no résumé rewrite guesswork · evidence-linked matching
            </div>
          </motion.div>

          {/* Right Column: Visual Beam Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <InteractiveFulcrum />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
