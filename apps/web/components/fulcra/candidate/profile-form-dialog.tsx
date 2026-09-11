"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
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
  CandidateProfileDto,
  CreateCandidateProfileInput,
} from "@/lib/api-client"

interface ProfileFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialProfile?: CandidateProfileDto | null
  onSubmit: (data: CreateCandidateProfileInput) => Promise<boolean>
  isNew?: boolean
}

function ProfileFormInner({
  initialProfile,
  onSubmit,
  onClose,
  isNew,
}: {
  initialProfile?: CandidateProfileDto | null
  onSubmit: (data: CreateCandidateProfileInput) => Promise<boolean>
  onClose: () => void
  isNew: boolean
}) {
  const [displayName, setDisplayName] = React.useState(
    initialProfile?.displayName || ""
  )
  const [headline, setHeadline] = React.useState(initialProfile?.headline || "")
  const [summary, setSummary] = React.useState(initialProfile?.summary || "")
  const [phone, setPhone] = React.useState(initialProfile?.phone || "")
  const [city, setCity] = React.useState(initialProfile?.location?.city || "")
  const [state, setState] = React.useState(
    initialProfile?.location?.state || ""
  )
  const [country, setCountry] = React.useState(
    initialProfile?.location?.country || ""
  )
  const [postalCode, setPostalCode] = React.useState(
    initialProfile?.location?.postalCode || ""
  )
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const payload: CreateCandidateProfileInput = {
        displayName: displayName.trim() || undefined,
        headline: headline.trim() || undefined,
        summary: summary.trim() || undefined,
        phone: phone.trim() || undefined,
        location: {
          city: city.trim() || undefined,
          state: state.trim() || undefined,
          country: country.trim() || undefined,
          postalCode: postalCode.trim() || undefined,
        },
      }

      const success = await onSubmit(payload)
      if (success) {
        onClose()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>
          {isNew ? "Create Candidate Profile" : "Edit Profile"}
        </DialogTitle>
        <DialogDescription>
          {isNew
            ? "Establish your canonical candidate identity on Fulcra."
            : "Update your identity, summary, and location details."}
        </DialogDescription>
      </DialogHeader>

      {error && (
        <div className="my-3 rounded border border-destructive/30 bg-destructive/10 p-2.5 text-xs text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-4 py-4">
        <div className="space-y-1.5">
          <label
            htmlFor="displayName"
            className="text-xs font-medium text-foreground"
          >
            Display / Preferred Name
          </label>
          <Input
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="e.g. Alex Rivera"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="headline"
            className="text-xs font-medium text-foreground"
          >
            Professional Headline
          </label>
          <Input
            id="headline"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="e.g. Staff Infrastructure Engineer"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="summary"
            className="text-xs font-medium text-foreground"
          >
            Professional Summary
          </label>
          <Textarea
            id="summary"
            rows={3}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Brief summary of your expertise and focus..."
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="phone"
            className="text-xs font-medium text-foreground"
          >
            Contact Phone
          </label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. +1 (555) 012-3456"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label
              htmlFor="city"
              className="text-xs font-medium text-foreground"
            >
              City
            </label>
            <Input
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. San Francisco"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="state"
              className="text-xs font-medium text-foreground"
            >
              State / Province
            </label>
            <Input
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="e.g. CA"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="country"
              className="text-xs font-medium text-foreground"
            >
              Country
            </label>
            <Input
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="e.g. United States"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="postalCode"
              className="text-xs font-medium text-foreground"
            >
              Postal Code
            </label>
            <Input
              id="postalCode"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="e.g. 94105"
            />
          </div>
        </div>
      </div>

      <DialogFooter className="gap-2 sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : isNew
              ? "Create Profile"
              : "Save Changes"}
        </Button>
      </DialogFooter>
    </form>
  )
}

export function ProfileFormDialog({
  open,
  onOpenChange,
  initialProfile,
  onSubmit,
  isNew = false,
}: ProfileFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        {open && (
          <ProfileFormInner
            key={initialProfile?.id || (isNew ? "new" : "edit")}
            initialProfile={initialProfile}
            onSubmit={onSubmit}
            onClose={() => onOpenChange(false)}
            isNew={isNew}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
