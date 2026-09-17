"use client"

import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { PublicHeader } from "@/components/fulcra/navigation/public-header"
import { PublicFooter } from "@/components/fulcra/navigation/public-footer"
import { JobCard } from "@/components/fulcra/jobs/job-card"
import { JobFiltersBar } from "@/components/fulcra/jobs/job-filters-bar"
import { JobCompareTray } from "@/components/fulcra/jobs/job-compare-tray"
import { jobsClient } from "@/lib/jobs/jobs-client"
import type { Job, JobFilters, JobSearchResult } from "@/lib/jobs/jobs-types"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { SearchX, ChevronLeft, ChevronRight } from "lucide-react"

export default function JobsDirectoryPage() {
  const [filters, setFilters] = React.useState<JobFilters>({
    query: "",
    workType: "all",
    seniority: "all",
    source: "all",
    sortBy: "recent",
    minSalary: 0,
  })
  const [page, setPage] = React.useState(1)
  const [isPending, startTransition] = React.useTransition()
  const [searchResult, setSearchResult] =
    React.useState<JobSearchResult | null>(null)
  const [selectedForCompare, setSelectedForCompare] = React.useState<Job[]>([])

  React.useEffect(() => {
    let ignore = false

    startTransition(() => {
      jobsClient.list(filters, page, 8).then((res) => {
        if (!ignore) {
          setSearchResult(res)
        }
      })
    })

    return () => {
      ignore = true
    }
  }, [filters, page])

  const handleFiltersChange = (newFilters: JobFilters) => {
    setFilters(newFilters)
    setPage(1)
  }

  const handleToggleCompare = (job: Job) => {
    setSelectedForCompare((prev) => {
      const exists = prev.some((j) => j.id === job.id)
      if (exists) {
        return prev.filter((j) => j.id !== job.id)
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), job] // Keep max 3
      }
      return [...prev, job]
    })
  }

  const isLoading = isPending || searchResult === null

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <PublicHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        {/* Directory Header with Honesty Copy per Rule 4 & Section 4.1 */}
        <div className="space-y-2">
          <div className="font-mono text-xs font-semibold tracking-wider text-role uppercase">
            Public Job Discovery
          </div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Sourced & Normalized Engineering Roles
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Every listing is parsed, deduplicated, and normalized into
            structured intelligence. Browse, filter, and compare roles freely
            with zero authentication.
          </p>
        </div>

        {/* Search & Filters with Compensation Slider */}
        <JobFiltersBar
          filters={filters}
          onFiltersChange={handleFiltersChange}
          totalCount={searchResult?.total || 0}
        />

        {/* Loading Skeletons with Shimmer per Section 4.1 */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="skeleton-shimmer space-y-4 rounded-xl border border-border bg-card p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32 bg-border" />
                    <Skeleton className="h-6 w-64 bg-border" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full bg-border" />
                </div>
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-28 bg-border" />
                  <Skeleton className="h-4 w-28 bg-border" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Actionable Empty State per Section 4.1 */}
        {!isLoading && searchResult && searchResult.jobs.length === 0 && (
          <Empty className="rounded-xl border border-border bg-card p-12 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <SearchX className="size-6" />
            </div>
            <EmptyHeader className="mt-4">
              <EmptyTitle className="text-lg font-semibold">
                No matching roles found with active filters
              </EmptyTitle>
              <EmptyDescription className="mx-auto max-w-md space-y-2 text-xs text-muted-foreground">
                <p>
                  No open postings currently match all your criteria
                  simultaneously.
                </p>
                <p className="font-medium text-foreground">
                  Suggested next actions:
                </p>
              </EmptyDescription>
            </EmptyHeader>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {filters.seniority !== "all" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleFiltersChange({ ...filters, seniority: "all" })
                  }
                  className="text-xs"
                >
                  Widen seniority to All
                </Button>
              )}
              {filters.workType !== "all" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleFiltersChange({ ...filters, workType: "all" })
                  }
                  className="text-xs"
                >
                  Include Remote & On-site
                </Button>
              )}
              {(filters.minSalary || 0) > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleFiltersChange({ ...filters, minSalary: 0 })
                  }
                  className="text-xs"
                >
                  Reset compensation floor
                </Button>
              )}
              <Button
                variant="default"
                size="sm"
                onClick={() =>
                  handleFiltersChange({
                    query: "",
                    workType: "all",
                    seniority: "all",
                    source: "all",
                    sortBy: "recent",
                    minSalary: 0,
                  })
                }
                className="bg-role text-xs text-white"
              >
                Reset all filters
              </Button>
            </div>
          </Empty>
        )}

        {/* Staggered Job Cards with Compare Tray Integration */}
        {!isLoading && searchResult && searchResult.jobs.length > 0 && (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {searchResult.jobs.map((job, idx) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25, delay: idx * 0.05 }}
                >
                  <JobCard
                    job={job}
                    isCompared={selectedForCompare.some((j) => j.id === job.id)}
                    onToggleCompare={() => handleToggleCompare(job)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && searchResult && searchResult.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border/80 pt-6">
            <span className="font-mono text-xs text-muted-foreground">
              Page {searchResult.page} of {searchResult.totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="gap-1 text-xs"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= searchResult.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="gap-1 text-xs"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Compare Tray Dock */}
      <JobCompareTray
        selectedJobs={selectedForCompare}
        onRemoveJob={(id) =>
          setSelectedForCompare((prev) => prev.filter((j) => j.id !== id))
        }
        onClearAll={() => setSelectedForCompare([])}
      />

      <PublicFooter />
    </div>
  )
}
