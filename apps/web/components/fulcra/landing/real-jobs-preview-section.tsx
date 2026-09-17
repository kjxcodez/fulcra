import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { JOB_FIXTURES } from "@/lib/jobs/jobs-fixtures"
import { ArrowRight, MapPin, DollarSign, CheckCircle2 } from "lucide-react"
import { Tilt3D } from "@/components/fulcra/shared/tilt-3d"

export function RealJobsPreviewSection() {
  const previewJobs = JOB_FIXTURES.slice(0, 3)

  return (
    <section className="border-t border-border bg-muted/20 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold tracking-wider text-candidate uppercase">
                INDEXED OPPORTUNITIES
              </span>
              <span className="rounded bg-muted px-2 py-0.5 font-mono text-[10px] font-semibold text-muted-foreground">
                VERIFIED JOBS
              </span>
            </div>

            <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              Jobs parsed into proof, not keyword soup.
            </h2>

            <p className="text-sm leading-relaxed text-muted-foreground">
              Fulcra indexes public postings and extracts explicit, testable
              criteria before you apply. Every requirement is categorized so you
              know whether a role is worth your time.
            </p>
          </div>

          <Link
            href="/jobs"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "shrink-0 border-candidate/40 font-mono text-xs text-candidate hover:bg-candidate/10"
            )}
          >
            Browse all indexed roles{" "}
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Link>
        </div>

        {/* 3 Job Cards Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {previewJobs.map((job) => {
            const minSal = job.salary?.min
              ? `$${(job.salary.min / 1000).toFixed(0)}k`
              : ""
            const maxSal = job.salary?.max
              ? `$${(job.salary.max / 1000).toFixed(0)}k`
              : ""
            const salaryText =
              minSal && maxSal ? `${minSal} – ${maxSal}` : "Competitive"

            return (
              <Tilt3D key={job.id} maxAngle={4} scale={1.01}>
                <div className="flex h-full flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-border/90 hover:shadow-md">
                  <div>
                    {/* Header: Company & Badges */}
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground font-mono text-xs font-bold text-background">
                          {job.companyLogoText}
                        </div>
                        <div>
                          <div className="text-xs font-medium text-muted-foreground">
                            {job.company}
                          </div>
                          <h3 className="font-heading text-base leading-snug font-semibold text-foreground">
                            {job.title}
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* Meta pills: Location, Work Type, Compensation */}
                    <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        {job.location.city
                          ? `${job.location.city} (${job.location.workType})`
                          : job.location.workType}
                      </span>
                      <span className="flex items-center gap-1 font-mono text-[11px] font-semibold text-foreground">
                        <DollarSign className="h-3 w-3 text-candidate" />
                        {salaryText}
                      </span>
                    </div>

                    {/* Overview teaser */}
                    <p className="mb-5 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                      {job.overview}
                    </p>

                    {/* Extracted requirement tags */}
                    <div className="mb-6 space-y-1.5">
                      <span className="block font-mono text-[10px] text-muted-foreground uppercase">
                        Parsed Requirements:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {job.tags.slice(0, 4).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="bg-muted/60 font-mono text-[10px] text-muted-foreground"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Action */}
                  <div className="flex items-center justify-between border-t border-border/60 pt-4">
                    <span className="font-mono text-[10px] text-muted-foreground uppercase">
                      Source: {job.source}
                    </span>
                    <Link
                      href={`/jobs/${job.slug}`}
                      className={cn(
                        buttonVariants({ size: "sm" }),
                        "bg-candidate font-mono text-xs text-white shadow-xs hover:bg-candidate/90"
                      )}
                    >
                      Inspect Role <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </Tilt3D>
            )
          })}
        </div>

        {/* Honesty Callout */}
        <div className="mt-10 flex flex-col justify-between gap-3 rounded-lg border border-border bg-card/60 p-4 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-candidate" />
            <span>
              <strong>Zero phantom postings:</strong> Every role shown is
              active, verifiable via its host ATS, and parsed with structured
              requirements.
            </span>
          </div>
          <span className="font-mono text-[11px] text-muted-foreground">
            Updated daily
          </span>
        </div>
      </div>
    </section>
  )
}
