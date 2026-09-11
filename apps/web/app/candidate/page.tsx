"use client"

import * as React from "react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { CandidateHeader } from "@/components/fulcra/candidate/candidate-header"
import { EducationSection } from "@/components/fulcra/candidate/education-section"
import { ExperienceSection } from "@/components/fulcra/candidate/experience-section"
import { PreferencesSection } from "@/components/fulcra/candidate/preferences-section"
import { ProfileFormDialog } from "@/components/fulcra/candidate/profile-form-dialog"
import { SkillsSection } from "@/components/fulcra/candidate/skills-section"
import {
  candidateApi,
  type CandidateAggregateDto,
  type CreateCandidateProfileInput,
  type CreateEducationInput,
  type CreateExperienceInput,
  type CreateSkillInput,
  type UpdatePreferencesInput,
} from "@/lib/api-client"
import {
  AlertTriangleIcon,
  ArrowLeftIcon,
  RefreshCwIcon,
  UserPlusIcon,
} from "lucide-react"

export default function CandidateProfilePage() {
  const [loading, setLoading] = React.useState(true)
  const [candidate, setCandidate] =
    React.useState<CandidateAggregateDto | null>(null)
  const [isNotFound, setIsNotFound] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [refreshIndex, setRefreshIndex] = React.useState(0)

  const refreshCandidate = React.useCallback(() => {
    setLoading(true)
    setRefreshIndex((prev) => prev + 1)
  }, [])

  React.useEffect(() => {
    let ignore = false

    candidateApi
      .getCandidate()
      .then((res) => {
        if (ignore) return
        if (res.success) {
          setCandidate(res.data)
          setIsNotFound(false)
          setErrorMessage(null)
        } else if (res.error.code === "CANDIDATE_NOT_FOUND") {
          setIsNotFound(true)
          setCandidate(null)
          setErrorMessage(null)
        } else {
          setErrorMessage(
            res.error.message || "Failed to load candidate profile"
          )
        }
      })
      .catch((err) => {
        if (ignore) return
        setErrorMessage(
          err instanceof Error ? err.message : "Unexpected connection error"
        )
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false)
        }
      })

    return () => {
      ignore = true
    }
  }, [refreshIndex])

  // Handlers
  const handleCreateProfile = async (
    data: CreateCandidateProfileInput
  ): Promise<boolean> => {
    const res = await candidateApi.createProfile(data)
    if (res.success) {
      refreshCandidate()
      return true
    } else {
      throw new Error(res.error.message)
    }
  }

  const handleUpdateProfile = async (
    data: CreateCandidateProfileInput
  ): Promise<boolean> => {
    const res = await candidateApi.updateProfile(data)
    if (res.success) {
      refreshCandidate()
      return true
    } else {
      throw new Error(res.error.message)
    }
  }

  const handleDeleteProfile = async (): Promise<boolean> => {
    const res = await candidateApi.deleteProfile()
    if (res.success) {
      setCandidate(null)
      setIsNotFound(true)
      return true
    } else {
      throw new Error(res.error.message)
    }
  }

  const handleCreateExperience = async (
    data: CreateExperienceInput
  ): Promise<boolean> => {
    const res = await candidateApi.createExperience(data)
    if (res.success) {
      refreshCandidate()
      return true
    } else {
      throw new Error(res.error.message)
    }
  }

  const handleUpdateExperience = async (
    id: string,
    data: Partial<CreateExperienceInput>
  ): Promise<boolean> => {
    const res = await candidateApi.updateExperience(id, data)
    if (res.success) {
      refreshCandidate()
      return true
    } else {
      throw new Error(res.error.message)
    }
  }

  const handleDeleteExperience = async (id: string): Promise<boolean> => {
    const res = await candidateApi.deleteExperience(id)
    if (res.success) {
      refreshCandidate()
      return true
    } else {
      throw new Error(res.error.message)
    }
  }

  const handleCreateEducation = async (
    data: CreateEducationInput
  ): Promise<boolean> => {
    const res = await candidateApi.createEducation(data)
    if (res.success) {
      refreshCandidate()
      return true
    } else {
      throw new Error(res.error.message)
    }
  }

  const handleUpdateEducation = async (
    id: string,
    data: Partial<CreateEducationInput>
  ): Promise<boolean> => {
    const res = await candidateApi.updateEducation(id, data)
    if (res.success) {
      refreshCandidate()
      return true
    } else {
      throw new Error(res.error.message)
    }
  }

  const handleDeleteEducation = async (id: string): Promise<boolean> => {
    const res = await candidateApi.deleteEducation(id)
    if (res.success) {
      refreshCandidate()
      return true
    } else {
      throw new Error(res.error.message)
    }
  }

  const handleAddSkill = async (data: CreateSkillInput): Promise<boolean> => {
    const res = await candidateApi.createSkill(data)
    if (res.success) {
      refreshCandidate()
      return true
    } else {
      throw new Error(res.error.message)
    }
  }

  const handleDeleteSkill = async (id: string): Promise<boolean> => {
    const res = await candidateApi.deleteSkill(id)
    if (res.success) {
      refreshCandidate()
      return true
    } else {
      throw new Error(res.error.message)
    }
  }

  const handleUpdatePreferences = async (
    data: UpdatePreferencesInput
  ): Promise<boolean> => {
    const res = await candidateApi.updatePreferences(data)
    if (res.success) {
      refreshCandidate()
      return true
    } else {
      throw new Error(res.error.message)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-card px-6 py-3.5">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeftIcon className="size-3.5" />
              Showcase
            </Link>
            <span className="text-border">|</span>
            <div className="flex size-7 items-center justify-center rounded bg-primary font-heading text-xs font-bold text-primary-foreground">
              F
            </div>
            <span className="font-heading text-base font-bold tracking-tight sm:text-lg">
              Fulcra Candidate
            </span>
            <Badge variant="role" className="ml-1">
              Phase 7 Domain
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshCandidate}
              disabled={loading}
              title="Refresh candidate data"
            >
              <RefreshCwIcon
                className={`size-3.5 ${loading ? "animate-spin" : ""}`}
              />
              <span className="sr-only sm:not-sr-only sm:ml-1.5 sm:text-xs">
                Refresh
              </span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* Loading State */}
        {loading && (
          <div className="space-y-6">
            <div className="rounded-md border border-border bg-card p-8">
              <div className="space-y-3">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="mt-4 h-16 w-full" />
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && errorMessage && (
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangleIcon className="size-4" />
              <AlertTitle>API Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
            <Button onClick={refreshCandidate} variant="outline" size="sm">
              <RefreshCwIcon className="mr-1.5 size-3.5" />
              Try Again
            </Button>
          </div>
        )}

        {/* Empty State: No Candidate Profile exists */}
        {!loading && isNotFound && (
          <div className="mx-auto max-w-lg py-12">
            <Empty className="p-8">
              <EmptyMedia variant="icon">
                <UserPlusIcon className="size-5 text-primary" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>No Candidate Profile Found</EmptyTitle>
                <EmptyDescription>
                  You haven&apos;t created a canonical candidate profile for
                  your account yet. Create one now to begin managing your
                  experience, skills, and preferences.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button onClick={() => setIsCreateOpen(true)}>
                  <UserPlusIcon className="mr-1.5 size-3.5" />
                  Create Candidate Profile
                </Button>
              </EmptyContent>
            </Empty>

            <ProfileFormDialog
              open={isCreateOpen}
              onOpenChange={setIsCreateOpen}
              onSubmit={handleCreateProfile}
              isNew
            />
          </div>
        )}

        {/* Success State: Aggregate Candidate View */}
        {!loading && candidate && (
          <div className="space-y-8">
            {/* Header Hero */}
            <CandidateHeader
              profile={{
                id: candidate.id,
                userId: candidate.userId,
                displayName: candidate.profile.displayName,
                headline: candidate.profile.headline,
                summary: candidate.profile.summary,
                phone: candidate.profile.phone,
                location: candidate.profile.location,
                createdAt: candidate.createdAt,
                updatedAt: candidate.updatedAt,
              }}
              onUpdate={handleUpdateProfile}
              onDelete={handleDeleteProfile}
            />

            {/* Sections Grid */}
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Left Column (2 cols): Experiences & Education */}
              <div className="space-y-8 lg:col-span-2">
                <ExperienceSection
                  experiences={candidate.experiences}
                  onCreate={handleCreateExperience}
                  onUpdate={handleUpdateExperience}
                  onDelete={handleDeleteExperience}
                />

                <EducationSection
                  education={candidate.education}
                  onCreate={handleCreateEducation}
                  onUpdate={handleUpdateEducation}
                  onDelete={handleDeleteEducation}
                />
              </div>

              {/* Right Column (1 col): Skills & Preferences */}
              <div className="space-y-8">
                <SkillsSection
                  skills={candidate.skills}
                  onAddSkill={handleAddSkill}
                  onDeleteSkill={handleDeleteSkill}
                />

                <PreferencesSection
                  preferences={candidate.preferences}
                  onUpdate={handleUpdatePreferences}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
