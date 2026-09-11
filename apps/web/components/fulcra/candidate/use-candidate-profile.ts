"use client"

import * as React from "react"
import {
  candidateApi,
  type CandidateAggregateDto,
  type CreateCandidateProfileInput,
  type CreateEducationInput,
  type CreateExperienceInput,
  type CreateSkillInput,
  type UpdatePreferencesInput,
} from "@/lib/api-client"

export function useCandidateProfile() {
  const [loading, setLoading] = React.useState(true)
  const [candidate, setCandidate] =
    React.useState<CandidateAggregateDto | null>(null)
  const [isNotFound, setIsNotFound] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
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

  const handleCreateProfile = async (
    data: CreateCandidateProfileInput
  ): Promise<boolean> => {
    const res = await candidateApi.createProfile(data)
    if (res.success) {
      refreshCandidate()
      return true
    }
    throw new Error(res.error.message)
  }

  const handleUpdateProfile = async (
    data: CreateCandidateProfileInput
  ): Promise<boolean> => {
    const res = await candidateApi.updateProfile(data)
    if (res.success) {
      refreshCandidate()
      return true
    }
    throw new Error(res.error.message)
  }

  const handleDeleteProfile = async (): Promise<boolean> => {
    const res = await candidateApi.deleteProfile()
    if (res.success) {
      setCandidate(null)
      setIsNotFound(true)
      return true
    }
    throw new Error(res.error.message)
  }

  const handleCreateExperience = async (
    data: CreateExperienceInput
  ): Promise<boolean> => {
    const res = await candidateApi.createExperience(data)
    if (res.success) {
      refreshCandidate()
      return true
    }
    throw new Error(res.error.message)
  }

  const handleUpdateExperience = async (
    id: string,
    data: Partial<CreateExperienceInput>
  ): Promise<boolean> => {
    const res = await candidateApi.updateExperience(id, data)
    if (res.success) {
      refreshCandidate()
      return true
    }
    throw new Error(res.error.message)
  }

  const handleDeleteExperience = async (id: string): Promise<boolean> => {
    const res = await candidateApi.deleteExperience(id)
    if (res.success) {
      refreshCandidate()
      return true
    }
    throw new Error(res.error.message)
  }

  const handleCreateEducation = async (
    data: CreateEducationInput
  ): Promise<boolean> => {
    const res = await candidateApi.createEducation(data)
    if (res.success) {
      refreshCandidate()
      return true
    }
    throw new Error(res.error.message)
  }

  const handleUpdateEducation = async (
    id: string,
    data: Partial<CreateEducationInput>
  ): Promise<boolean> => {
    const res = await candidateApi.updateEducation(id, data)
    if (res.success) {
      refreshCandidate()
      return true
    }
    throw new Error(res.error.message)
  }

  const handleDeleteEducation = async (id: string): Promise<boolean> => {
    const res = await candidateApi.deleteEducation(id)
    if (res.success) {
      refreshCandidate()
      return true
    }
    throw new Error(res.error.message)
  }

  const handleCreateSkill = async (
    data: CreateSkillInput
  ): Promise<boolean> => {
    const res = await candidateApi.createSkill(data)
    if (res.success) {
      refreshCandidate()
      return true
    }
    throw new Error(res.error.message)
  }

  const handleDeleteSkill = async (id: string): Promise<boolean> => {
    const res = await candidateApi.deleteSkill(id)
    if (res.success) {
      refreshCandidate()
      return true
    }
    throw new Error(res.error.message)
  }

  const handleUpdatePreferences = async (
    data: UpdatePreferencesInput
  ): Promise<boolean> => {
    const res = await candidateApi.updatePreferences(data)
    if (res.success) {
      refreshCandidate()
      return true
    }
    throw new Error(res.error.message)
  }

  return {
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
  }
}
