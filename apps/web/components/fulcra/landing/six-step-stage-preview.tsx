"use client"

import * as React from "react"
import { motion } from "motion/react"
import { Badge } from "@/components/ui/badge"
import {
  Compass,
  BookOpen,
  Scale,
  Sparkles,
  Send,
  Activity,
  ArrowRight,
} from "lucide-react"

interface StagePreviewProps {
  activeStep: number
}

export function SixStepStagePreview({ activeStep }: StagePreviewProps) {
  return (
    <div className="min-h-[220px] rounded-2xl border border-border bg-card p-6 shadow-xs sm:p-8">
      {activeStep === 0 && (
        <motion.div
          key="step-0"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between border-b border-border/80 pb-3">
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-role" />
              <span className="font-heading text-sm font-semibold text-foreground">
                Stage 01: Canonical Job Ingestion & Deduplication
              </span>
            </div>
            <Badge
              variant="outline"
              className="text-success-text border-success/30 bg-success/10 font-mono text-[10px]"
            >
              3 Duplicates Merged
            </Badge>
          </div>
          <div className="grid grid-cols-1 gap-4 font-mono text-xs sm:grid-cols-3">
            <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
              <span className="block text-[10px] text-muted-foreground">
                Sources Detected:
              </span>
              <span className="font-semibold text-foreground">
                Lever, Greenhouse, Company Careers
              </span>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
              <span className="block text-[10px] text-muted-foreground">
                Deduplication Hash:
              </span>
              <span className="font-semibold text-foreground">
                sha256:vela-be-9201a
              </span>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
              <span className="block text-[10px] text-muted-foreground">
                Freshness:
              </span>
              <span className="text-success-text font-semibold">
                Active · Posted 2d ago
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {activeStep === 1 && (
        <motion.div
          key="step-1"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between border-b border-border/80 pb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-role" />
              <span className="font-heading text-sm font-semibold text-foreground">
                Stage 02: Structured Role Normalization
              </span>
            </div>
            <span className="font-mono text-xs text-muted-foreground">
              Vela Systems · Senior Backend
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 font-mono text-xs sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-muted/20 p-3">
              <span className="block text-[10px] text-muted-foreground">
                Work Model:
              </span>
              <span className="font-semibold text-foreground">
                Remote (Global UTC-8 to UTC+2)
              </span>
            </div>
            <div className="rounded-lg border border-border bg-muted/20 p-3">
              <span className="block text-[10px] text-muted-foreground">
                Compensation Band:
              </span>
              <span className="font-semibold text-foreground">
                $160,000 – $190,000 + Equity
              </span>
            </div>
            <div className="rounded-lg border border-border bg-muted/20 p-3">
              <span className="block text-[10px] text-muted-foreground">
                Must-Haves Extracted:
              </span>
              <span className="font-semibold text-role">
                Go, PostgreSQL, Distributed
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {activeStep === 2 && (
        <motion.div
          key="step-2"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between border-b border-border/80 pb-3">
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-candidate" />
              <span className="font-heading text-sm font-semibold text-foreground">
                Stage 03: Glass-Box Compatibility Weighing
              </span>
            </div>
            <span className="font-mono text-base font-bold text-foreground">
              94% Aggregate
            </span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="text-success-text rounded bg-success/15 px-2.5 py-1 font-mono">
              ✓ Skills: Go (5.5y), Postgres (sharding), Distributed (40M req/d)
            </span>
            <span className="text-warning-text rounded bg-warning/15 px-2.5 py-1 font-mono">
              ? Kubernetes: Unverified in work history
            </span>
          </div>
        </motion.div>
      )}

      {activeStep === 3 && (
        <motion.div
          key="step-3"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between border-b border-border/80 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-candidate" />
              <span className="font-heading text-sm font-semibold text-foreground">
                Stage 04: Evidence-Grounded Resume Tailoring
              </span>
            </div>
            <Badge
              variant="outline"
              className="border-candidate/40 font-mono text-[10px] text-candidate"
            >
              0% Hallucination
            </Badge>
          </div>
          <div className="rounded-lg border border-border bg-background p-3 font-mono text-xs text-muted-foreground">
            <span className="text-success-text">+ Highlighted:</span> Scaled Go
            telemetry microservices at RapidQuest Solutions handling 40M+
            events/day.
          </div>
        </motion.div>
      )}

      {activeStep === 4 && (
        <motion.div
          key="step-4"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between border-b border-border/80 pb-3">
            <div className="flex items-center gap-2">
              <Send className="h-4 w-4 text-role" />
              <span className="font-heading text-sm font-semibold text-foreground">
                Stage 05: Direct Submission Control
              </span>
            </div>
            <span className="font-mono text-xs text-muted-foreground">
              Greenhouse ATS Integration
            </span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 p-3 font-mono text-xs text-muted-foreground">
            <span>Payload: Resume v15 + Cover Letter v3</span>
            <span className="text-success-text font-semibold">
              Ready for submission review
            </span>
          </div>
        </motion.div>
      )}

      {activeStep === 5 && (
        <motion.div
          key="step-5"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between border-b border-border/80 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-role" />
              <span className="font-heading text-sm font-semibold text-foreground">
                Stage 06: Continuous Audit & Loop Refinement
              </span>
            </div>
            <span className="font-mono text-xs text-role">Pipeline Active</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3 font-mono text-xs">
            <span>
              Interviewer notes logged: Focus on Raft failover recovery.
            </span>
            <span className="flex items-center gap-1 font-semibold text-candidate">
              Feed back into profile <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </motion.div>
      )}
    </div>
  )
}
