"use client"

import * as React from "react"
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
  CandidateEducationDto,
  CreateEducationInput,
} from "@/lib/api-client"
import {
  CalendarIcon,
  GraduationCapIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react"

interface EducationSectionProps {
  education: CandidateEducationDto[]
  onCreate: (data: CreateEducationInput) => Promise<boolean>
  onUpdate: (
    id: string,
    data: Partial<CreateEducationInput>
  ) => Promise<boolean>
  onDelete: (id: string) => Promise<boolean>
}

export function EducationSection({
  education,
  onCreate,
  onUpdate,
  onDelete,
}: EducationSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingEdu, setEditingEdu] =
    React.useState<CandidateEducationDto | null>(null)

  const [institution, setInstitution] = React.useState("")
  const [degree, setDegree] = React.useState("")
  const [fieldOfStudy, setFieldOfStudy] = React.useState("")
  const [startDate, setStartDate] = React.useState("")
  const [endDate, setEndDate] = React.useState("")
  const [isCurrent, setIsCurrent] = React.useState(false)
  const [description, setDescription] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const openCreateDialog = () => {
    setEditingEdu(null)
    setInstitution("")
    setDegree("")
    setFieldOfStudy("")
    setStartDate("")
    setEndDate("")
    setIsCurrent(false)
    setDescription("")
    setError(null)
    setIsDialogOpen(true)
  }

  const openEditDialog = (edu: CandidateEducationDto) => {
    setEditingEdu(edu)
    setInstitution(edu.institution)
    setDegree(edu.degree || "")
    setFieldOfStudy(edu.fieldOfStudy || "")
    setStartDate(edu.startDate || "")
    setEndDate(edu.endDate || "")
    setIsCurrent(edu.isCurrent)
    setDescription(edu.description || "")
    setError(null)
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!institution.trim()) {
      setError("Institution is required.")
      return
    }

    if (
      !isCurrent &&
      startDate.trim() &&
      endDate.trim() &&
      startDate > endDate
    ) {
      setError("Start date cannot be after end date.")
      return
    }

    setIsSubmitting(true)

    try {
      const payload: CreateEducationInput = {
        institution: institution.trim(),
        degree: degree.trim() || undefined,
        fieldOfStudy: fieldOfStudy.trim() || undefined,
        startDate: startDate.trim() || undefined,
        endDate: isCurrent ? null : endDate.trim() || null,
        isCurrent,
        description: description.trim() || undefined,
      }

      let success = false
      if (editingEdu) {
        success = await onUpdate(editingEdu.id, payload)
      } else {
        success = await onCreate(payload)
      }

      if (success) {
        setIsDialogOpen(false)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save education")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="flex items-center gap-2 font-heading text-lg font-semibold">
            <GraduationCapIcon className="size-5 text-primary" />
            Education
          </CardTitle>
          <CardDescription>
            Academic background, degrees, and institutions
          </CardDescription>
        </div>
        <Button size="sm" onClick={openCreateDialog}>
          <PlusIcon className="mr-1.5 size-3.5" />
          Add Education
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {education.length === 0 ? (
          <div className="rounded border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
            No education records added yet.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {education.map((edu) => (
              <div
                key={edu.id}
                className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="space-y-1">
                  <h3 className="font-heading text-base font-semibold">
                    {edu.institution}
                  </h3>

                  {(edu.degree || edu.fieldOfStudy) && (
                    <p className="text-sm font-medium text-foreground">
                      {[edu.degree, edu.fieldOfStudy]
                        .filter(Boolean)
                        .join(" in ")}
                    </p>
                  )}

                  {(edu.startDate || edu.endDate || edu.isCurrent) && (
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <CalendarIcon className="size-3" />
                      {edu.startDate || "N/A"} –{" "}
                      {edu.isCurrent ? "Present" : edu.endDate || "N/A"}
                    </p>
                  )}

                  {edu.description && (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {edu.description}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="size-8 p-0"
                    onClick={() => openEditDialog(edu)}
                  >
                    <PencilIcon className="size-3.5" />
                    <span className="sr-only">Edit education</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="size-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => onDelete(edu.id)}
                  >
                    <Trash2Icon className="size-3.5" />
                    <span className="sr-only">Delete education</span>
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
                {editingEdu ? "Edit Education" : "Add Education"}
              </DialogTitle>
              <DialogDescription>
                Academic institution, field of study, and degree details.
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
                  Institution *
                </label>
                <Input
                  required
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. University of California, Berkeley"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Degree
                  </label>
                  <Input
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    placeholder="e.g. B.S., M.S., Ph.D."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Field of Study
                  </label>
                  <Input
                    value={fieldOfStudy}
                    onChange={(e) => setFieldOfStudy(e.target.value)}
                    placeholder="e.g. Computer Science"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Start Date (YYYY or YYYY-MM)
                  </label>
                  <Input
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="2018-09"
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
                    placeholder="2022-05"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="eduCurrent"
                  checked={isCurrent}
                  onCheckedChange={(checked) => setIsCurrent(Boolean(checked))}
                />
                <label
                  htmlFor="eduCurrent"
                  className="cursor-pointer text-xs font-medium text-foreground"
                >
                  I am currently studying here
                </label>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Description / Honors
                </label>
                <Textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Honors, thesis, activities..."
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
                  : editingEdu
                    ? "Save Changes"
                    : "Add Education"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
