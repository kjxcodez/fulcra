"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { Magnetic } from "@/components/fulcra/shared/magnetic"

export function CtaBand() {
  return (
    <section className="relative overflow-hidden bg-[#14161F] py-20 text-white">
      {/* Ambient glowing radial auras */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 -right-24 h-96 w-96 -translate-y-1/2 rounded-full bg-primary/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-candidate/15 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-xl space-y-3"
          >
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Stop applying blind.
            </h2>
            <p className="text-sm leading-relaxed text-zinc-400">
              Bring one job and one resume — see the full breakdown in under a
              minute.
            </p>
          </motion.div>

          <Magnetic strength={0.3}>
            <Link href="/jobs" className="shrink-0">
              <Button
                size="lg"
                className="gap-2 bg-primary px-6 text-sm font-medium text-white shadow-lg transition-transform hover:bg-primary/90"
              >
                Explore jobs
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  )
}
