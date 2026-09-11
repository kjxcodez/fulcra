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
import { Input } from "@/components/ui/input"
import type { CandidateSkillDto, CreateSkillInput } from "@/lib/api-client"
import { CodeIcon, PlusIcon, XIcon } from "lucide-react"

type SkillProficiency = "beginner" | "intermediate" | "advanced" | "expert"

interface SkillsSectionProps {
  skills: CandidateSkillDto[]
  onAddSkill: (data: CreateSkillInput) => Promise<boolean>
  onDeleteSkill: (id: string) => Promise<boolean>
}

export function SkillsSection({
  skills,
  onAddSkill,
  onDeleteSkill,
}: SkillsSectionProps) {
  const [skillName, setSkillName] = React.useState("")
  const [proficiency, setProficiency] =
    React.useState<SkillProficiency>("advanced")
  const [years, setYears] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!skillName.trim()) return

    setIsSubmitting(true)
    setError(null)

    try {
      const payload: CreateSkillInput = {
        name: skillName.trim(),
        displayName: skillName.trim(),
        proficiency,
        yearsOfExperience: years.trim() ? parseInt(years, 10) : undefined,
      }

      const success = await onAddSkill(payload)
      if (success) {
        setSkillName("")
        setYears("")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add skill")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-heading text-lg font-semibold">
          <CodeIcon className="size-5 text-primary" />
          Skills & Proficiencies
        </CardTitle>
        <CardDescription>
          Canonical skills with proficiency level and experience duration
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Add Skill Form */}
        <form onSubmit={handleAdd} className="space-y-2">
          <div className="flex flex-wrap items-end gap-2">
            <div className="min-w-[180px] flex-1 space-y-1">
              <label className="text-xs font-medium text-foreground">
                Skill Name
              </label>
              <Input
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                placeholder="e.g. TypeScript, Kubernetes, Go"
                disabled={isSubmitting}
              />
            </div>

            <div className="w-36 space-y-1">
              <label className="text-xs font-medium text-foreground">
                Proficiency
              </label>
              <select
                value={proficiency}
                onChange={(e) =>
                  setProficiency(e.target.value as SkillProficiency)
                }
                className="h-10 w-full rounded border border-input bg-transparent px-3 py-2 text-sm outline-none"
                disabled={isSubmitting}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            <div className="w-24 space-y-1">
              <label className="text-xs font-medium text-foreground">
                Years
              </label>
              <Input
                type="number"
                min={0}
                max={50}
                value={years}
                onChange={(e) => setYears(e.target.value)}
                placeholder="Years"
                disabled={isSubmitting}
              />
            </div>

            <Button type="submit" disabled={isSubmitting || !skillName.trim()}>
              <PlusIcon className="mr-1.5 size-3.5" />
              Add
            </Button>
          </div>

          {error && (
            <p className="text-xs font-medium text-destructive">{error}</p>
          )}
        </form>

        {/* Skill Badges */}
        {skills.length === 0 ? (
          <div className="rounded border border-dashed border-border py-6 text-center text-sm text-muted-foreground">
            No skills added yet. Add your core technical competencies above.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 pt-2">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="group flex items-center gap-1.5 rounded-md border border-border bg-muted/40 py-1 pr-1.5 pl-2.5 text-xs text-foreground transition-colors hover:border-primary/40 hover:bg-muted"
              >
                <span className="font-medium">
                  {skill.displayName || skill.name}
                </span>

                {skill.proficiency && (
                  <Badge
                    variant="outline"
                    className="text-[10px] tracking-wider uppercase"
                  >
                    {skill.proficiency}
                  </Badge>
                )}

                {skill.yearsOfExperience !== null &&
                  skill.yearsOfExperience !== undefined && (
                    <span className="text-[11px] text-muted-foreground">
                      {skill.yearsOfExperience}y
                    </span>
                  )}

                <button
                  type="button"
                  onClick={() => onDeleteSkill(skill.id)}
                  className="ml-0.5 rounded p-0.5 text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
                  title="Remove skill"
                >
                  <XIcon className="size-3" />
                  <span className="sr-only">Remove {skill.name}</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
