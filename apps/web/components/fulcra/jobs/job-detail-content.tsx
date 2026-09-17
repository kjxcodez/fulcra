import * as React from "react"
import type { Job } from "@/lib/jobs/jobs-types"
import { Info } from "lucide-react"

interface JobDetailContentProps {
  job: Job
}

export function JobDetailContent({ job }: JobDetailContentProps) {
  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-6 text-sm sm:p-8">
      <div>
        <h2 className="mb-3 font-heading text-lg font-semibold text-foreground">
          Role Overview
        </h2>
        <p className="leading-relaxed text-muted-foreground">{job.overview}</p>
      </div>

      {job.responsibilities?.length > 0 && (
        <div>
          <h2 className="mb-3 font-heading text-lg font-semibold text-foreground">
            Key Responsibilities
          </h2>
          <ul className="space-y-2 text-muted-foreground">
            {job.responsibilities.map((r, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-xs leading-relaxed"
              >
                <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/60" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {job.requirements?.length > 0 && (
        <div>
          <h2 className="mb-3 font-heading text-lg font-semibold text-foreground">
            Parsed Requirements & Criteria
          </h2>
          <ul className="space-y-2 text-muted-foreground">
            {job.requirements.map((req, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-xs leading-relaxed"
              >
                <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/60" />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {job.benefits?.length > 0 && (
        <div>
          <h2 className="mb-3 font-heading text-lg font-semibold text-foreground">
            Benefits & Perks
          </h2>
          <ul className="grid grid-cols-1 gap-2 text-muted-foreground sm:grid-cols-2">
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
      <div className="flex items-start gap-3 rounded-lg border border-border/80 bg-muted/40 p-4 text-xs text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-role" />
        <div className="space-y-1">
          <span className="font-semibold text-foreground">
            Source Attribution & Direct Application
          </span>
          <p>
            This posting is sourced from {job.source.toUpperCase()} and
            normalized into structured requirements. Fulcra provides transparent
            match scoring and evidence diagnostics; your application is
            submitted directly to the employer&apos;s ATS.
          </p>
        </div>
      </div>
    </div>
  )
}
