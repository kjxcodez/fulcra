"use client"

import * as React from "react"
import Link from "next/link"
import type { Job } from "@/lib/jobs/jobs-types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AuthGateDialog } from "@/components/fulcra/auth/auth-gate-dialog"
import { MapPin, DollarSign, Calendar, Sparkles } from "lucide-react"

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  const [authGateOpen, setAuthGateOpen] = React.useState(false)

  const formatSalary = (salary?: Job["salary"]) => {
    if (!salary || (!salary.min && !salary.max)) return "Salary not disclosed"
    const minStr = salary.min ? `$${(salary.min / 1000).toFixed(0)}k` : ""
    const maxStr = salary.max ? `$${(salary.max / 1000).toFixed(0)}k` : ""
    if (minStr && maxStr) return `${minStr} – ${maxStr}`
    return `${minStr || maxStr}`
  }

  const formatPostedDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <>
      <div className="group relative rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-border/60 hover:shadow-sm sm:p-6">
        {/* Top Header: Company, Title & Badges */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded bg-muted font-mono text-xs font-semibold text-foreground">
                {job.companyLogoText || job.company.slice(0, 2).toUpperCase()}
              </span>
              <span className="font-heading text-sm font-medium text-foreground">
                {job.company}
              </span>
              <span className="text-border">·</span>
              <Badge
                variant="outline"
                className="font-mono text-[10px] text-muted-foreground capitalize"
              >
                {job.source}
              </Badge>
            </div>

            <Link href={`/jobs/${job.slug || job.id}`}>
              <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                {job.title}
              </h3>
            </Link>
          </div>

          {/* Location & Seniority Badges */}
          <div className="flex shrink-0 flex-wrap items-center gap-1.5">
            <Badge
              variant="outline"
              className="border-border text-[11px] text-muted-foreground capitalize"
            >
              {job.seniority}
            </Badge>
            <Badge
              variant="default"
              className="text-[11px] font-medium capitalize"
            >
              {job.location.workType}
            </Badge>
          </div>
        </div>

        {/* Metadata Details Row */}
        <div className="mt-4 flex flex-wrap items-center gap-4 font-mono text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
            <span>
              {job.location.city ? `${job.location.city}, ` : ""}
              {job.location.state || job.location.country || "Global"}
            </span>
          </div>

          <div className="flex items-center gap-1 font-sans font-medium text-foreground">
            <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{formatSalary(job.salary)}</span>
          </div>

          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{formatPostedDate(job.postedAt)}</span>
          </div>
        </div>

        {/* Skills / Tags */}
        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {job.tags.slice(0, 5).map((tag) => (
            <span
              key={tag}
              className="rounded bg-muted/70 px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer: Match Banner & Action CTA */}
        <div className="mt-5 flex flex-col gap-3 border-t border-border/80 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => setAuthGateOpen(true)}
            className="flex cursor-pointer items-center gap-1.5 text-left text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-candidate" />
            <span>
              <b className="font-semibold text-foreground">Match unavailable</b>{" "}
              — Sign in to see your score
            </span>
          </button>

          <div className="flex items-center gap-2">
            <Link href={`/jobs/${job.slug || job.id}`}>
              <Button variant="outline" size="sm" className="text-xs">
                View role
              </Button>
            </Link>
            <Button
              size="sm"
              onClick={() => setAuthGateOpen(true)}
              className="gap-1 bg-candidate text-xs text-white hover:bg-candidate/90"
            >
              Weigh match
            </Button>
          </div>
        </div>
      </div>

      <AuthGateDialog
        open={authGateOpen}
        onOpenChange={setAuthGateOpen}
        actionName={`Weigh match for ${job.title}`}
        featureDescription={`See how your verified profile aligns with ${job.company}'s requirements across skills, experience, and compensation.`}
      />
    </>
  )
}
