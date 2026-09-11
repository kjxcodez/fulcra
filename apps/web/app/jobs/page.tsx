"use client"

import * as React from "react"
import { PublicHeader } from "@/components/fulcra/navigation/public-header"
import { PublicFooter } from "@/components/fulcra/navigation/public-footer"
import { JobCard } from "@/components/fulcra/jobs/job-card"
import { JobFiltersBar } from "@/components/fulcra/jobs/job-filters-bar"
import { jobsClient } from "@/lib/jobs/jobs-client"
import type { JobFilters, JobSearchResult } from "@/lib/jobs/jobs-types"
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
  })
  const [page, setPage] = React.useState(1)
  const [isPending, startTransition] = React.useTransition()
  const [searchResult, setSearchResult] =
    React.useState<JobSearchResult | null>(null)

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

  const isLoading = isPending || searchResult === null

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <PublicHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        {/* Directory Header */}
        <div className="space-y-2">
          <div className="font-mono text-xs font-semibold tracking-wider text-primary uppercase">
            Public Job Discovery
          </div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Verified Engineering Roles
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Every listing is parsed, normalized, and ready for explainable
            matching against your candidate profile. Browse freely without an
            account.
          </p>
        </div>

        {/* Search & Filters */}
        <JobFiltersBar
          filters={filters}
          onFiltersChange={handleFiltersChange}
          totalCount={searchResult?.total || 0}
        />

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="animate-in space-y-4 duration-200 fade-in-0">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="space-y-4 rounded-xl border border-border bg-card p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-6 w-64" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && searchResult && searchResult.jobs.length === 0 && (
          <Empty className="rounded-xl border border-border bg-card p-12 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <SearchX className="size-6" />
            </div>
            <EmptyHeader className="mt-4">
              <EmptyTitle className="text-lg font-semibold">
                No matching jobs found
              </EmptyTitle>
              <EmptyDescription className="mx-auto max-w-sm text-xs text-muted-foreground">
                Try adjusting your search keywords, seniority filters, or
                location preferences to see more results.
              </EmptyDescription>
            </EmptyHeader>
            <div className="mt-6 flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleFiltersChange({
                    query: "",
                    workType: "all",
                    seniority: "all",
                    source: "all",
                    sortBy: "recent",
                  })
                }
              >
                Reset filters
              </Button>
            </div>
          </Empty>
        )}

        {/* Job Cards List */}
        {!isLoading && searchResult && searchResult.jobs.length > 0 && (
          <div className="space-y-4">
            {searchResult.jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {!isLoading && searchResult && searchResult.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border/80 pt-6">
            <span className="font-mono text-xs text-muted-foreground">
              Page {searchResult.page} of {searchResult.totalPages}
            </span>
            <div className="flex items-center gap-2">
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

      <PublicFooter />
    </div>
  )
}
