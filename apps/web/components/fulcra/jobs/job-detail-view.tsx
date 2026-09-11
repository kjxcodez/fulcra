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
  Info,
} from "lucide-react"

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
            <Badge variant="default" className="text-xs capitalize">
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

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={job.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none"
          >
            <Button
              size="default"
              className="w-full gap-2 bg-primary text-xs font-medium text-white"
            >
              <span>
                Apply on{" "}
                {job.source.charAt(0).toUpperCase() + job.source.slice(1)}
              </span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </a>

          <Button
            size="default"
            onClick={() => triggerAuthGate(`Weigh Match for ${job.title}`)}
            className="gap-2 bg-candidate text-xs text-white hover:bg-candidate/90"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>See how I match</span>
          </Button>

          <Button
            variant="outline"
            size="default"
            onClick={() => triggerAuthGate(`Save ${job.title}`)}
            className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <Bookmark className="h-3.5 w-3.5" />
            <span>Save</span>
          </Button>
        </div>
      </div>

      {/* Role Overview */}
      <div className="space-y-6 rounded-xl border border-border bg-card p-6 text-sm sm:p-8">
        <div>
          <h2 className="mb-3 font-heading text-lg font-semibold text-foreground">
            Role Overview
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            {job.overview}
          </p>
        </div>

        {/* Responsibilities */}
        {job.responsibilities?.length > 0 && (
          <div>
            <h2 className="mb-3 font-heading text-lg font-semibold text-foreground">
              Key Responsibilities
            </h2>
            <ul className="space-y-2 text-muted-foreground">
              {job.responsibilities.map((r, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Requirements */}
        {job.requirements?.length > 0 && (
          <div>
            <h2 className="mb-3 font-heading text-lg font-semibold text-foreground">
              Requirements & Must-Haves
            </h2>
            <ul className="space-y-2 text-muted-foreground">
              {job.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-candidate" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Benefits */}
        {job.benefits?.length > 0 && (
          <div>
            <h2 className="mb-3 font-heading text-lg font-semibold text-foreground">
              Benefits & Perks
            </h2>
            <ul className="grid grid-cols-1 gap-2.5 text-muted-foreground sm:grid-cols-2">
              {job.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-xs">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Source Attribution Notice */}
        <div className="flex items-start gap-3 rounded-lg border border-border/80 bg-muted/30 p-4 text-xs text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div className="space-y-1">
            <span className="font-semibold text-foreground">
              Source Attribution
            </span>
            <p>
              This posting is aggregated from {job.source.toUpperCase()}. Fulcra
              provides explainable match scoring and resume tailoring; actual
              application submission occurs directly on the company&apos;s ATS.
            </p>
          </div>
        </div>
      </div>

      <AuthGateDialog
        open={authGateOpen}
        onOpenChange={setAuthGateOpen}
        actionName={authGateAction}
        featureDescription={`Personalized match analysis for ${job.title} compares your verified candidate evidence with this role's requirements.`}
      />
    </div>
  )
}
