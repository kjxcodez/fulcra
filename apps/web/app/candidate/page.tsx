"use client"

import * as React from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
import { AppShell } from "@/components/fulcra/navigation/app-shell"
import { CandidateHeader } from "@/components/fulcra/candidate/candidate-header"
import { EducationSection } from "@/components/fulcra/candidate/education-section"
import { ExperienceSection } from "@/components/fulcra/candidate/experience-section"
import { PreferencesSection } from "@/components/fulcra/candidate/preferences-section"
import { ProfileFormDialog } from "@/components/fulcra/candidate/profile-form-dialog"
import { SkillsSection } from "@/components/fulcra/candidate/skills-section"
import { useCandidateProfile } from "@/components/fulcra/candidate/use-candidate-profile"
import { AlertTriangleIcon, RefreshCwIcon, UserPlusIcon } from "lucide-react"

export default function CandidateProfilePage() {
  const {
    loading,
    candidate,
    isNotFound,
    errorMessage,
    refreshCandidate,
    handleCreateProfile,
    handleUpdateProfile,
    handleDeleteProfile,
    handleCreateExperience,
    handleUpdateExperience,
    handleDeleteExperience,
    handleCreateEducation,
    handleUpdateEducation,
    handleDeleteEducation,
    handleCreateSkill,
    handleDeleteSkill,
    handleUpdatePreferences,
  } = useCandidateProfile()

  const [isCreateOpen, setIsCreateOpen] = React.useState(false)

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Error Alert */}
        {errorMessage && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangleIcon className="size-4" />
            <AlertTitle>Candidate Domain Error</AlertTitle>
            <AlertDescription className="flex items-center justify-between gap-4">
              <span>{errorMessage}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshCandidate}
                className="shrink-0"
              >
                <RefreshCwIcon className="mr-1.5 size-3.5" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="animate-in space-y-6 duration-200 fade-in-0">
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-start gap-4">
                <Skeleton className="size-16 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-72" />
                  <Skeleton className="h-3 w-36" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-40 w-full rounded-lg" />
              </div>
              <div className="space-y-6">
                <Skeleton className="h-36 w-full rounded-lg" />
                <Skeleton className="h-56 w-full rounded-lg" />
              </div>
            </div>
          </div>
        )}

        {/* Not Found / Empty State */}
        {!loading && isNotFound && (
          <Empty className="rounded-lg border border-border bg-card p-12 text-center">
            <EmptyMedia>
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-candidate-subtle text-candidate">
                <UserPlusIcon className="size-7" />
              </div>
            </EmptyMedia>
            <EmptyHeader className="mt-4">
              <EmptyTitle className="text-xl font-semibold">
                No Candidate Profile Found
              </EmptyTitle>
              <EmptyDescription className="mx-auto max-w-md text-sm text-muted-foreground">
                You do not have an active candidate profile record yet. Create
                your canonical candidate identity to begin tracking experiences,
                skills, education, and career preferences.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent className="mt-6 flex justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsCreateOpen(true)}
                className="gap-2 border-candidate text-candidate hover:bg-candidate-subtle"
              >
                <UserPlusIcon className="size-4" />
                Create Candidate Profile
              </Button>
            </EmptyContent>
          </Empty>
        )}

        {/* Candidate Profile Loaded */}
        {!loading && candidate && (
          <div className="animate-in space-y-6 duration-300 fade-in-0">
            <CandidateHeader
              profile={candidate.profile}
              onUpdate={handleUpdateProfile}
              onDelete={handleDeleteProfile}
            />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
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

              <div className="space-y-6">
                <SkillsSection
                  skills={candidate.skills}
                  onAddSkill={handleCreateSkill}
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

        {/* Create Profile Dialog */}
        <ProfileFormDialog
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          onSubmit={handleCreateProfile}
          isNew={true}
        />
      </div>
    </AppShell>
  )
}
