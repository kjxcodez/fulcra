"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import type {
  CandidatePreferencesDto,
  UpdatePreferencesInput,
} from "@/lib/api-client"
import { CheckCircle2Icon, CompassIcon } from "lucide-react"

type WorkLocation = "remote" | "hybrid" | "on-site" | "any"
type Relocation = "yes" | "no" | "negotiable"

interface PreferencesSectionProps {
  preferences: CandidatePreferencesDto | null
  onUpdate: (data: UpdatePreferencesInput) => Promise<boolean>
}

function PreferencesFormInner({
  preferences,
  onUpdate,
}: PreferencesSectionProps) {
  const [jobTitles, setJobTitles] = React.useState(
    (preferences?.desiredJobTitles || []).join(", ")
  )
  const [workLocation, setWorkLocation] = React.useState<WorkLocation>(
    (preferences?.workLocationPreference as WorkLocation) || "any"
  )
  const [locations, setLocations] = React.useState(
    (preferences?.preferredLocations || []).join(", ")
  )
  const [salaryCurrency, setSalaryCurrency] = React.useState(
    preferences?.salaryCurrency || "USD"
  )
  const [salaryMin, setSalaryMin] = React.useState(
    preferences?.salaryMinimum !== null &&
      preferences?.salaryMinimum !== undefined
      ? String(preferences.salaryMinimum)
      : ""
  )
  const [salaryMax, setSalaryMax] = React.useState(
    preferences?.salaryMaximum !== null &&
      preferences?.salaryMaximum !== undefined
      ? String(preferences.salaryMaximum)
      : ""
  )
  const [relocation, setRelocation] = React.useState<Relocation>(
    (preferences?.relocationPreference as Relocation) || "negotiable"
  )
  const [sponsorship, setSponsorship] = React.useState(
    Boolean(preferences?.sponsorshipRequired)
  )

  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSaved, setIsSaved] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setIsSaved(false)

    try {
      const minNum = salaryMin.trim() ? parseInt(salaryMin, 10) : undefined
      const maxNum = salaryMax.trim() ? parseInt(salaryMax, 10) : undefined

      if (minNum !== undefined && maxNum !== undefined && minNum > maxNum) {
        setError("Minimum salary cannot be greater than maximum salary.")
        setIsSubmitting(false)
        return
      }

      const payload: UpdatePreferencesInput = {
        desiredJobTitles: jobTitles
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        workLocationPreference: workLocation,
        preferredLocations: locations
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        salaryCurrency: salaryCurrency.trim() || "USD",
        salaryMinimum: minNum,
        salaryMaximum: maxNum,
        relocationPreference: relocation,
        sponsorshipRequired: sponsorship,
      }

      const success = await onUpdate(payload)
      if (success) {
        setIsSaved(true)
        setTimeout(() => setIsSaved(false), 3000)
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save preferences"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-border bg-card">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 font-heading text-lg font-semibold">
              <CompassIcon className="size-5 text-primary" />
              Career Preferences
            </CardTitle>
            {isSaved && (
              <Badge
                variant="outline"
                className="border-green-600/30 bg-green-500/10 text-green-700 dark:text-green-400"
              >
                <CheckCircle2Icon className="mr-1 size-3" />
                Saved
              </Badge>
            )}
          </div>
          <CardDescription>
            Target roles, location expectations, and compensation boundaries
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="rounded border border-destructive/30 bg-destructive/10 p-2.5 text-xs text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Target Job Titles (comma separated)
            </label>
            <Input
              value={jobTitles}
              onChange={(e) => setJobTitles(e.target.value)}
              placeholder="e.g. Staff Infrastructure Engineer, Technical Lead, Backend Architect"
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Work Location Preference
              </label>
              <select
                value={workLocation}
                onChange={(e) =>
                  setWorkLocation(e.target.value as WorkLocation)
                }
                className="h-10 w-full rounded border border-input bg-transparent px-3 py-2 text-sm outline-none"
                disabled={isSubmitting}
              >
                <option value="any">Any / Flexible</option>
                <option value="remote">Remote only</option>
                <option value="hybrid">Hybrid</option>
                <option value="on-site">On-site only</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Relocation Willingness
              </label>
              <select
                value={relocation}
                onChange={(e) => setRelocation(e.target.value as Relocation)}
                className="h-10 w-full rounded border border-input bg-transparent px-3 py-2 text-sm outline-none"
                disabled={isSubmitting}
              >
                <option value="negotiable">Negotiable</option>
                <option value="yes">Willing to relocate</option>
                <option value="no">Not willing to relocate</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Preferred Geographic Locations (comma separated)
            </label>
            <Input
              value={locations}
              onChange={(e) => setLocations(e.target.value)}
              placeholder="e.g. Remote - US, San Francisco, CA, New York, NY"
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Currency
              </label>
              <Input
                value={salaryCurrency}
                onChange={(e) => setSalaryCurrency(e.target.value)}
                placeholder="USD"
                maxLength={10}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Min Base Salary
              </label>
              <Input
                type="number"
                min={0}
                step={1000}
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                placeholder="160000"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Max / Target Salary
              </label>
              <Input
                type="number"
                min={0}
                step={1000}
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                placeholder="220000"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Checkbox
              id="sponsorship"
              checked={sponsorship}
              onCheckedChange={(checked) => setSponsorship(Boolean(checked))}
              disabled={isSubmitting}
            />
            <label
              htmlFor="sponsorship"
              className="cursor-pointer text-xs font-medium text-foreground"
            >
              Visa sponsorship required for employment
            </label>
          </div>
        </CardContent>

        <CardFooter className="justify-end border-t border-border pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Preferences"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export function PreferencesSection({
  preferences,
  onUpdate,
}: PreferencesSectionProps) {
  return (
    <PreferencesFormInner
      key={preferences?.id || "empty-preferences"}
      preferences={preferences}
      onUpdate={onUpdate}
    />
  )
}
