"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { CandidateProfileDto } from "@/lib/api-client"
import {
  BriefcaseIcon,
  MapPinIcon,
  PhoneIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react"
import { ProfileFormDialog } from "./profile-form-dialog"
import type { CreateCandidateProfileInput } from "@/lib/api-client"

interface CandidateHeaderProps {
  profile: CandidateProfileDto
  onUpdate: (data: CreateCandidateProfileInput) => Promise<boolean>
  onDelete: () => Promise<boolean>
}

export function CandidateHeader({
  profile,
  onUpdate,
  onDelete,
}: CandidateHeaderProps) {
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)

  const locationParts = [
    profile.location.city,
    profile.location.state,
    profile.location.country,
  ].filter(Boolean)
  const locationString = locationParts.join(", ")

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your candidate profile? All experiences, education, skills, and preferences will be permanently removed."
      )
    ) {
      setIsDeleting(true)
      try {
        await onDelete()
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return (
    <>
      <Card className="border-border bg-card">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
                  {profile.displayName || "Candidate"}
                </h1>
                <Badge variant="role">Canonical Profile</Badge>
              </div>

              {profile.headline && (
                <p className="flex items-center gap-1.5 text-base font-medium text-foreground">
                  <BriefcaseIcon className="size-4 text-muted-foreground" />
                  {profile.headline}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                {locationString && (
                  <span className="flex items-center gap-1">
                    <MapPinIcon className="size-3.5" />
                    {locationString}
                  </span>
                )}
                {profile.phone && (
                  <span className="flex items-center gap-1">
                    <PhoneIcon className="size-3.5" />
                    {profile.phone}
                  </span>
                )}
              </div>

              {profile.summary && (
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                  {profile.summary}
                </p>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditOpen(true)}
              >
                <PencilIcon className="mr-1.5 size-3.5" />
                Edit Profile
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2Icon className="mr-1.5 size-3.5" />
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <ProfileFormDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        initialProfile={profile}
        onSubmit={onUpdate}
      />
    </>
  )
}
