"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type {
  CandidateExperienceDto,
  CreateExperienceInput,
} from "@/lib/api-client"
import {
  BriefcaseIcon,
  CalendarIcon,
  MapPinIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react"

type EmploymentType =
  "full-time" | "part-time" | "contract" | "internship" | "freelance"

interface ExperienceSectionProps {
  experiences: CandidateExperienceDto[]
  onCreate: (data: CreateExperienceInput) => Promise<boolean>
  onUpdate: (
    id: string,
    data: Partial<CreateExperienceInput>
  ) => Promise<boolean>
  onDelete: (id: string) => Promise<boolean>
}

export function ExperienceSection({
  experiences,
  onCreate,
  onUpdate,
  onDelete,
}: ExperienceSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingExp, setEditingExp] =
    React.useState<CandidateExperienceDto | null>(null)

  const [companyName, setCompanyName] = React.useState("")
  const [title, setTitle] = React.useState("")
  const [employmentType, setEmploymentType] =
    React.useState<EmploymentType>("full-time")
  const [location, setLocation] = React.useState("")
  const [startDate, setStartDate] = React.useState("")
  const [endDate, setEndDate] = React.useState("")
  const [isCurrent, setIsCurrent] = React.useState(false)
  const [description, setDescription] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const openCreateDialog = () => {
    setEditingExp(null)
    setCompanyName("")
    setTitle("")
    setEmploymentType("full-time")
    setLocation("")
    setStartDate("")
    setEndDate("")
    setIsCurrent(false)
    setDescription("")
    setError(null)
    setIsDialogOpen(true)
  }

  const openEditDialog = (exp: CandidateExperienceDto) => {
    setEditingExp(exp)
    setCompanyName(exp.companyName)
    setTitle(exp.title)
    setEmploymentType((exp.employmentType as EmploymentType) || "full-time")
    setLocation(exp.location || "")
    setStartDate(exp.startDate)
    setEndDate(exp.endDate || "")
    setIsCurrent(exp.isCurrent)
    setDescription(exp.description || "")
    setError(null)
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!companyName.trim() || !title.trim() || !startDate.trim()) {
      setError("Company, Title, and Start Date are required.")
      return
    }

    if (!isCurrent && endDate.trim() && startDate > endDate) {
      setError("Start date cannot be after end date.")
      return
    }

    setIsSubmitting(true)

    try {
      const payload: CreateExperienceInput = {
        companyName: companyName.trim(),
        title: title.trim(),
        employmentType,
        location: location.trim() || undefined,
        startDate: startDate.trim(),
        endDate: isCurrent ? null : endDate.trim() || null,
        isCurrent,
        description: description.trim() || undefined,
      }

      let success = false
      if (editingExp) {
        success = await onUpdate(editingExp.id, payload)
      } else {
        success = await onCreate(payload)
      }

      if (success) {
        setIsDialogOpen(false)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save experience")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="flex items-center gap-2 font-heading text-lg font-semibold">
            <BriefcaseIcon className="size-5 text-primary" />
            Experience
          </CardTitle>
          <CardDescription>
            Work history and career accomplishments
          </CardDescription>
        </div>
        <Button size="sm" onClick={openCreateDialog}>
          <PlusIcon className="mr-1.5 size-3.5" />
          Add Experience
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {experiences.length === 0 ? (
          <div className="rounded border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
            No experience records added yet.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {experiences.map((exp) => (
              <div
                key={exp.id}
                className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-heading text-base font-semibold">
                      {exp.title}
                    </h3>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-sm font-medium text-foreground">
                      {exp.companyName}
                    </span>
                    {exp.employmentType && (
                      <Badge
                        variant="outline"
                        className="text-[11px] capitalize"
                      >
                        {exp.employmentType}
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="size-3" />
                      {exp.startDate} –{" "}
                      {exp.isCurrent ? "Present" : exp.endDate || "N/A"}
                    </span>
                    {exp.location && (
                      <span className="flex items-center gap-1">
                        <MapPinIcon className="size-3" />
                        {exp.location}
                      </span>
                    )}
                  </div>

                  {exp.description && (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {exp.description}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="size-8 p-0"
                    onClick={() => openEditDialog(exp)}
                  >
                    <PencilIcon className="size-3.5" />
                    <span className="sr-only">Edit experience</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="size-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => onDelete(exp.id)}
                  >
                    <Trash2Icon className="size-3.5" />
                    <span className="sr-only">Delete experience</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editingExp ? "Edit Experience" : "Add Experience"}
              </DialogTitle>
              <DialogDescription>
                Record your employer, role details, and dates.
              </DialogDescription>
            </DialogHeader>

            {error && (
              <div className="my-3 rounded border border-destructive/30 bg-destructive/10 p-2.5 text-xs text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-4 py-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Job Title *
                </label>
                <Input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Company / Employer *
                </label>
                <Input
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Acme Innovations"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Employment Type
                  </label>
                  <select
                    value={employmentType}
                    onChange={(e) =>
                      setEmploymentType(e.target.value as EmploymentType)
                    }
                    className="h-10 w-full rounded border border-input bg-transparent px-3 py-2 text-sm outline-none"
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="freelance">Freelance</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Location
                  </label>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Remote or Seattle, WA"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Start Date (YYYY or YYYY-MM) *
                  </label>
                  <Input
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="2022-03"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    End Date (YYYY or YYYY-MM)
                  </label>
                  <Input
                    disabled={isCurrent}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="2024-01"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="isCurrent"
                  checked={isCurrent}
                  onCheckedChange={(checked) => setIsCurrent(Boolean(checked))}
                />
                <label
                  htmlFor="isCurrent"
                  className="cursor-pointer text-xs font-medium text-foreground"
                >
                  I am currently working in this role
                </label>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Description / Responsibilities
                </label>
                <Textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Key responsibilities and achievements..."
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Saving..."
                  : editingExp
                    ? "Save Changes"
                    : "Add Experience"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
