"use client"

import * as React from "react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Lock, ArrowRight } from "lucide-react"

interface AuthGateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  actionName?: string
  featureDescription?: string
}

export function AuthGateDialog({
  open,
  onOpenChange,
  actionName = "Sign in to continue",
  featureDescription = "Personalized match scoring, resume tailoring, and 1-click tracking require an active candidate profile.",
}: AuthGateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader className="gap-2 text-left">
          <div className="flex items-center justify-between">
            <Badge
              variant="outline"
              className="border-brass/40 gap-1 bg-candidate-subtle font-mono text-[11px] text-candidate"
            >
              <Lock className="h-3 w-3" />
              Auth-Gated Surface
            </Badge>
            <span className="font-mono text-[11px] text-muted-foreground">
              Development Preview
            </span>
          </div>
          <DialogTitle className="font-heading text-xl font-semibold">
            {actionName}
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
            {featureDescription}
          </DialogDescription>
        </DialogHeader>

        <div className="my-3 space-y-2.5 rounded-md border border-border/80 bg-muted/40 p-3.5">
          <div className="font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Included with Candidate Profile
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
              <span>
                <b>Explainable match diagnostics</b> comparing skills,
                seniority, and compensation.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
              <span>
                <b>Evidence-linked resume tailoring</b> grounded exclusively in
                your real career history.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
              <span>
                <b>Unified application history</b> preserving sent resumes,
                answers, and recruiter replies.
              </span>
            </div>
          </div>
        </div>

        <div className="rounded border border-dashed border-border/70 p-2.5 font-mono text-[11px] text-muted-foreground">
          Note: Full identity provider integration (Auth.js / Clerk) is
          scheduled for a future phase. You can currently manage your candidate
          profile in development mode.
        </div>

        <DialogFooter className="mt-4 flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Continue browsing
          </Button>
          <Link
            href="/candidate"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            <Button size="sm" className="w-full gap-1.5 bg-primary text-white">
              Open Candidate Profile
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
