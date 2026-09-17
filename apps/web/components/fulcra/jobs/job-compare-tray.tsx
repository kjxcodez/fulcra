"use client"

import * as React from "react"
import type { Job } from "@/lib/jobs/jobs-types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { X, Scale, ExternalLink, ArrowRight } from "lucide-react"
import Link from "next/link"

interface JobCompareTrayProps {
  selectedJobs: Job[]
  onRemoveJob: (jobId: string) => void
  onClearAll: () => void
}

export function JobCompareTray({
  selectedJobs,
  onRemoveJob,
  onClearAll,
}: JobCompareTrayProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  if (selectedJobs.length === 0) return null

  const formatSalary = (salary?: Job["salary"]) => {
    if (!salary || (!salary.min && !salary.max)) return "Undisclosed"
    const minStr = salary.min ? `$${(salary.min / 1000).toFixed(0)}k` : ""
    const maxStr = salary.max ? `$${(salary.max / 1000).toFixed(0)}k` : ""
    if (minStr && maxStr) return `${minStr} – ${maxStr}`
    return minStr || maxStr
  }

  return (
    <>
      {/* Floating Bottom Compare Tray */}
      <div className="fixed bottom-5 left-1/2 z-40 w-full max-w-2xl -translate-x-1/2 animate-in px-4 duration-200 slide-in-from-bottom-5">
        <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card/95 p-3 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-3 overflow-x-auto">
            <div className="flex items-center gap-1.5 pl-2 font-mono text-xs font-semibold text-role">
              <Scale className="h-4 w-4 shrink-0" />
              <span>Compare ({selectedJobs.length}/3)</span>
            </div>

            <div className="flex items-center gap-2">
              {selectedJobs.map((job) => (
                <span
                  key={job.id}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/60 px-2.5 py-1 text-xs font-medium text-foreground"
                >
                  <span className="max-w-[120px] truncate sm:max-w-[160px]">
                    {job.company}: {job.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemoveJob(job.id)}
                    aria-label={`Remove ${job.title} from comparison`}
                    className="cursor-pointer text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </Button>
            <Button
              size="sm"
              onClick={() => setIsOpen(true)}
              className="h-8 gap-1.5 bg-role text-xs font-medium text-white hover:bg-role/90"
            >
              <span>Side-by-Side</span>
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-h-[85vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl font-semibold">
              Role Comparison
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="w-36 px-3 py-3 font-mono text-[11px] text-muted-foreground uppercase">
                    Dimension
                  </th>
                  {selectedJobs.map((job) => (
                    <th
                      key={job.id}
                      className="px-3 py-3 font-heading text-sm text-foreground"
                    >
                      <div>{job.title}</div>
                      <div className="font-mono text-xs font-normal text-muted-foreground">
                        {job.company}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {/* Work Mode */}
                <tr>
                  <td className="px-3 py-3 font-mono text-[11px] text-muted-foreground">
                    Work Model
                  </td>
                  {selectedJobs.map((job) => (
                    <td key={job.id} className="px-3 py-3">
                      <Badge variant="outline" className="capitalize">
                        {job.location.workType} ({job.location.city || "Remote"}
                        )
                      </Badge>
                    </td>
                  ))}
                </tr>

                {/* Seniority */}
                <tr>
                  <td className="px-3 py-3 font-mono text-[11px] text-muted-foreground">
                    Seniority
                  </td>
                  {selectedJobs.map((job) => (
                    <td
                      key={job.id}
                      className="px-3 py-3 font-medium capitalize"
                    >
                      {job.seniority}
                    </td>
                  ))}
                </tr>

                {/* Compensation */}
                <tr>
                  <td className="px-3 py-3 font-mono text-[11px] text-muted-foreground">
                    Compensation
                  </td>
                  {selectedJobs.map((job) => (
                    <td
                      key={job.id}
                      className="px-3 py-3 font-mono font-semibold text-foreground"
                    >
                      {formatSalary(job.salary)}
                    </td>
                  ))}
                </tr>

                {/* Core Stack */}
                <tr>
                  <td className="px-3 py-3 font-mono text-[11px] text-muted-foreground">
                    Key Stack
                  </td>
                  {selectedJobs.map((job) => (
                    <td key={job.id} className="px-3 py-3">
                      <div className="flex flex-wrap gap-1">
                        {job.tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Sourcing */}
                <tr>
                  <td className="px-3 py-3 font-mono text-[11px] text-muted-foreground">
                    Source
                  </td>
                  {selectedJobs.map((job) => (
                    <td
                      key={job.id}
                      className="px-3 py-3 font-mono text-muted-foreground capitalize"
                    >
                      {job.source}
                    </td>
                  ))}
                </tr>

                {/* Action Links */}
                <tr>
                  <td className="px-3 py-3 font-mono text-[11px] text-muted-foreground">
                    Actions
                  </td>
                  {selectedJobs.map((job) => (
                    <td key={job.id} className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <Link href={`/jobs/${job.slug || job.id}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 text-xs"
                          >
                            View details
                          </Button>
                        </Link>
                        <a
                          href={job.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            size="sm"
                            className="h-7 gap-1 bg-role px-2 text-xs text-white"
                          >
                            <span>Apply</span>
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </a>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
