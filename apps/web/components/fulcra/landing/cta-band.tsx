"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CtaBand() {
  return (
    <section className="relative overflow-hidden bg-[#14161F] py-20 text-white">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 -right-24 h-96 w-96 -translate-y-1/2 rounded-full bg-primary/25 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-xl space-y-3">
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Stop applying blind.
            </h2>
            <p className="text-ink-300 text-sm leading-relaxed">
              Bring one job and one resume — see the full breakdown in under a
              minute.
            </p>
          </div>

          <Link href="/jobs" className="shrink-0">
            <Button
              size="lg"
              className="gap-2 bg-primary px-6 text-sm font-medium text-white shadow-md hover:bg-primary/90"
            >
              Explore jobs
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
