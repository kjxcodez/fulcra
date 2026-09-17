"use client"

import * as React from "react"
import Link from "next/link"
import type { Job } from "@/lib/jobs/jobs-types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AuthGateDialog } from "@/components/fulcra/auth/auth-gate-dialog"
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Calendar,
  ExternalLink,
  Sparkles,
  Bookmark,
  CheckCircle2,
} from "lucide-react"
import { JobDetailContent } from "./job-detail-content"

interface JobDetailViewProps {
  job: Job
}

export function JobDetailView({ job }: JobDetailViewProps) {
  const [authGateOpen, setAuthGateOpen] = React.useState(false)
  const [authGateAction, setAuthGateAction] = React.useState(
    "Sign in to continue"
  )

  const formatSalary = (salary?: Job["salary"]) => {
    if (!salary || (!salary.min && !salary.max)) return "Salary not disclosed"
    const minStr = salary.min ? `$${(salary.min / 1000).toFixed(0)}k` : ""
    const maxStr = salary.max ? `$${(salary.max / 1000).toFixed(0)}k` : ""
    if (minStr && maxStr) return `${minStr} – ${maxStr} / yr`
    return `${minStr || maxStr} / yr`
  }

  const triggerAuthGate = (action: string) => {
    setAuthGateAction(action)
    setAuthGateOpen(true)
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Link */}
      <Link
        href="/jobs"
        className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to all jobs
      </Link>

      {/* Main Header Card */}
      <div className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-xs sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded bg-muted font-mono text-xs font-semibold text-foreground">
                {job.companyLogoText || job.company.slice(0, 2).toUpperCase()}
              </span>
              <span className="font-heading text-sm font-semibold text-foreground">
                {job.company}
              </span>
              <span className="text-border">·</span>
              <Badge
                variant="outline"
                className="font-mono text-[10px] capitalize"
              >
                {job.source}
              </Badge>
            </div>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {job.title}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant="default"
              className="border border-border bg-muted text-xs text-foreground capitalize hover:bg-muted"
            >
              {job.location.workType}
            </Badge>
            <Badge variant="outline" className="text-xs capitalize">
              {job.seniority}
            </Badge>
          </div>
        </div>

        {/* Details Row */}
        <div className="flex flex-wrap items-center gap-6 border-y border-border/80 py-3 font-mono text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            <span>
              {job.location.city ? `${job.location.city}, ` : ""}
              {job.location.state || job.location.country || "Global"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-sans font-medium text-foreground">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>{formatSalary(job.salary)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>Posted {new Date(job.postedAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Role Intelligence Snapshot */}
        <div className="grid grid-cols-1 gap-3 rounded-lg border border-border/80 bg-muted/25 p-3.5 font-mono text-xs sm:grid-cols-3">
          <div>
            <div className="text-[10px] text-muted-foreground uppercase">
              Target Compensation
            </div>
            <div className="mt-0.5 font-semibold text-foreground">
              {formatSalary(job.salary)}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase">
              What Matters Most
            </div>
            <div className="mt-0.5 truncate font-semibold text-role">
              {job.tags?.slice(0, 3).join(" · ") || "Engineering"}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase">
              Parsing Audit
            </div>
            <div className="text-success-text mt-0.5 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="h-3.5 w-3.5" /> Structured Requirements
            </div>
          </div>
        </div>

        {/* Action Buttons: Apply (Indigo), See Match (Brass), Save (Outline) */}
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={job.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none"
          >
            <Button
              size="default"
              className="w-full gap-2 bg-role text-xs font-semibold text-white hover:bg-role/90"
            >
              <span>
                Apply on{" "}
                {job.source.charAt(0).toUpperCase() + job.source.slice(1)} ATS
              </span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </a>

          <Button
            size="default"
            onClick={() => triggerAuthGate(`Weigh Match for ${job.title}`)}
            className="gap-2 bg-candidate text-xs font-semibold text-white hover:bg-[#8C6E2E]"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>See how it&apos;d match</span>
          </Button>

          <Button
            variant="outline"
            size="default"
            onClick={() => triggerAuthGate(`Save ${job.title}`)}
            className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <Bookmark className="h-3.5 w-3.5" />
            <span>Save role</span>
          </Button>
        </div>
      </div>

      {/* Role Overview, Parsed Requirements & Benefits */}
      <JobDetailContent job={job} />

      <AuthGateDialog
        open={authGateOpen}
        onOpenChange={setAuthGateOpen}
        actionName={authGateAction}
        featureDescription={`Personalized match analysis for ${job.title} compares your verified candidate evidence with this role's requirements.`}
      />
    </div>
  )
}
