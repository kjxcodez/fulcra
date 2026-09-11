"use client"

import * as React from "react"
import type {
  JobFilters,
  JobSeniority,
  JobSource,
  JobWorkType,
} from "@/lib/jobs/jobs-types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { NativeSelect } from "@/components/ui/native-select"
import { Search, X, SlidersHorizontal } from "lucide-react"

interface JobFiltersBarProps {
  filters: JobFilters
  onFiltersChange: (newFilters: JobFilters) => void
  totalCount: number
}

export function JobFiltersBar({
  filters,
  onFiltersChange,
  totalCount,
}: JobFiltersBarProps) {
  const [searchInput, setSearchInput] = React.useState(filters.query || "")

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFiltersChange({ ...filters, query: searchInput })
  }

  const hasActiveFilters = Boolean(
    filters.query ||
    (filters.workType && filters.workType !== "all") ||
    (filters.seniority && filters.seniority !== "all") ||
    (filters.source && filters.source !== "all") ||
    (filters.sortBy && filters.sortBy !== "recent")
  )

  const clearAllFilters = () => {
    setSearchInput("")
    onFiltersChange({
      query: "",
      workType: "all",
      seniority: "all",
      source: "all",
      sortBy: "recent",
    })
  }

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-4 shadow-2xs sm:p-5">
      {/* Top Search Input Row */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by role title, company, or skills (e.g. Go, React, Distributed Systems)..."
            className="h-10 pl-9 text-sm"
          />
        </div>
        <Button
          type="submit"
          size="default"
          className="shrink-0 bg-primary text-xs text-white"
        >
          Search
        </Button>
      </form>

      {/* Dropdown Filters Row */}
      <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span className="font-mono text-[11px] tracking-wider uppercase">
            Filters:
          </span>
        </div>

        {/* Work Type Select */}
        <NativeSelect
          value={filters.workType || "all"}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              workType: e.target.value as JobWorkType | "all",
            })
          }
          className="h-8 w-28 text-xs"
        >
          <option value="all">All Modes</option>
          <option value="remote">Remote</option>
          <option value="hybrid">Hybrid</option>
          <option value="on-site">On-site</option>
        </NativeSelect>

        {/* Seniority Select */}
        <NativeSelect
          value={filters.seniority || "all"}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              seniority: e.target.value as JobSeniority | "all",
            })
          }
          className="h-8 w-32 text-xs"
        >
          <option value="all">All Seniority</option>
          <option value="junior">Junior</option>
          <option value="mid">Mid-Level</option>
          <option value="senior">Senior</option>
          <option value="staff">Staff</option>
          <option value="lead">Lead</option>
        </NativeSelect>

        {/* Source Select */}
        <NativeSelect
          value={filters.source || "all"}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              source: e.target.value as JobSource | "all",
            })
          }
          className="h-8 w-32 text-xs"
        >
          <option value="all">All Sources</option>
          <option value="lever">Lever</option>
          <option value="greenhouse">Greenhouse</option>
          <option value="workday">Workday</option>
          <option value="direct">Direct Site</option>
        </NativeSelect>

        {/* Sort Select */}
        <div className="ml-auto flex items-center gap-2">
          <span className="font-mono text-[11px] text-muted-foreground">
            Sort:
          </span>
          <NativeSelect
            value={filters.sortBy || "recent"}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                sortBy: e.target.value as "recent" | "salary" | "title",
              })
            }
            className="h-8 w-32 text-xs"
          >
            <option value="recent">Most Recent</option>
            <option value="salary">Highest Salary</option>
            <option value="title">Role Title A-Z</option>
          </NativeSelect>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-8 gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" />
            Reset
          </Button>
        )}
      </div>

      {/* Result Count Banner */}
      <div className="flex items-center justify-between border-t border-border/60 pt-2 font-mono text-xs text-muted-foreground">
        <span>
          Showing <b>{totalCount}</b> verified technical{" "}
          {totalCount === 1 ? "role" : "roles"}
        </span>
        <span>Same-origin public discovery</span>
      </div>
    </div>
  )
}
