"use client"

import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
import { Tilt3D } from "@/components/fulcra/shared/tilt-3d"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Users, ShieldCheck, ArrowRight } from "lucide-react"
import { CANDIDATE_STEPS, RECRUITER_CANDIDATES } from "./modes-section-data"

export function ModesSection() {
  const [mode, setMode] = React.useState<"candidate" | "recruiter">("candidate")

  return (
    <section
      id="modes"
      className="border-t border-border bg-card/40 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Switcher */}
        <div className="mb-12 flex justify-center">
          <div className="relative inline-flex rounded-full border border-border bg-muted p-1">
            <button
              type="button"
              onClick={() => setMode("candidate")}
              className={cn(
                "relative z-10 cursor-pointer rounded-full px-5 py-2 text-xs font-semibold transition-colors duration-200",
                mode === "candidate"
                  ? "text-background"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {mode === "candidate" && (
                <motion.span
                  layoutId="activeModeThumb"
                  className="absolute inset-0 -z-10 rounded-full bg-candidate shadow-xs"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              For Candidates
            </button>
            <button
              type="button"
              onClick={() => setMode("recruiter")}
              className={cn(
                "relative z-10 cursor-pointer rounded-full px-5 py-2 text-xs font-semibold transition-colors duration-200",
                mode === "recruiter"
                  ? "text-background"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {mode === "recruiter" && (
                <motion.span
                  layoutId="activeModeThumb"
                  className="absolute inset-0 -z-10 rounded-full bg-role shadow-xs"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              For Hiring Teams
            </button>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12"
          >
            {/* Left Copy */}
            <div className="space-y-4 lg:col-span-5">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "font-mono text-xs font-semibold tracking-wider uppercase",
                    mode === "candidate" ? "text-candidate" : "text-role"
                  )}
                >
                  {mode === "candidate"
                    ? "CANDIDATE INTELLIGENCE"
                    : "RECRUITER INTELLIGENCE"}
                </span>
                {mode === "recruiter" && (
                  <Badge
                    variant="outline"
                    className="border-role/40 bg-role/10 font-mono text-[10px] font-medium text-role"
                  >
                    Partner Alpha
                  </Badge>
                )}
              </div>

              <h3 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {mode === "candidate"
                  ? "Your evidence is the source of truth."
                  : "Explainable candidate ranking. Never a black box."}
              </h3>

              <p className="text-sm leading-relaxed text-muted-foreground">
                {mode === "candidate"
                  ? "Every resume bullet, score breakdown, and application traces directly to your profile. The more you use Fulcra, the sharper it gets without having to re-explain yourself."
                  : "Screen candidate pools against explicit role requirements with direct citations to verified work. No arbitrary keyword rejections or hallucinated qualification summaries."}
              </p>

              {mode === "recruiter" ? (
                <div className="pt-2">
                  <Button
                    size="sm"
                    className="bg-role font-mono text-xs text-white shadow-xs hover:bg-role/90"
                  >
                    Request Hiring Team Access{" "}
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </div>
              ) : (
                <div className="pt-2">
                  <Link
                    href="/candidate"
                    className={cn(
                      buttonVariants({ size: "sm" }),
                      "bg-candidate font-mono text-xs text-white shadow-xs hover:bg-candidate/90"
                    )}
                  >
                    Inspect Candidate Profile{" "}
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </div>

            {/* Right Surface */}
            <div className="lg:col-span-7">
              <Tilt3D maxAngle={4} scale={1.01}>
                {mode === "candidate" ? (
                  <div className="divide-y divide-border/70 rounded-xl border border-border bg-card p-6 shadow-sm">
                    {CANDIDATE_STEPS.map((item) => (
                      <div
                        key={item.step}
                        className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0"
                      >
                        <div className="flex items-start gap-3.5">
                          <span className="mt-0.5 font-mono text-xs font-bold text-candidate">
                            {item.step}
                          </span>
                          <div>
                            <div className="font-heading text-sm font-semibold text-foreground">
                              {item.title}
                            </div>
                            <div className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                              {item.desc}
                            </div>
                          </div>
                        </div>
                        {item.tag && (
                          <Badge
                            variant="outline"
                            className="shrink-0 border-candidate/30 bg-candidate/10 font-mono text-[10px] text-candidate"
                          >
                            {item.tag}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
                    {/* Recruiter Pool Preview Header */}
                    <div className="mb-4 flex items-center justify-between border-b border-border/70 pb-3.5">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-role" />
                        <span className="font-heading text-sm font-semibold text-foreground">
                          Pool Ranking · Senior Backend Engineer
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className="border-role/30 bg-role/10 font-mono text-[11px] font-medium text-role"
                      >
                        127 Candidates Indexed
                      </Badge>
                    </div>

                    {/* Candidate Pool Ranking List */}
                    <div className="space-y-3 font-mono text-xs">
                      {RECRUITER_CANDIDATES.map((cand) => (
                        <div
                          key={cand.name}
                          className="rounded-lg border border-border/70 bg-background/70 p-3.5"
                        >
                          <div className="mb-1.5 flex items-center justify-between">
                            <span className="text-xs font-semibold text-foreground">
                              {cand.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-role">
                                {cand.score}
                              </span>
                              <Badge
                                variant="outline"
                                className="px-1.5 py-0 text-[10px] font-medium"
                              >
                                {cand.verdict}
                              </Badge>
                            </div>
                          </div>
                          <p className="font-sans text-xs leading-relaxed text-muted-foreground">
                            {cand.detail}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-border/70 pt-3 font-mono text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5 text-role" />
                        Audit trail for compliance & DE&I reporting
                      </span>
                      <span className="font-medium text-role">Coming soon</span>
                    </div>
                  </div>
                )}
              </Tilt3D>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
