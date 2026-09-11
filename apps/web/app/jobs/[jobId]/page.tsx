import * as React from "react"
import Link from "next/link"
import { PublicHeader } from "@/components/fulcra/navigation/public-header"
import { PublicFooter } from "@/components/fulcra/navigation/public-footer"
import { JobDetailView } from "@/components/fulcra/jobs/job-detail-view"
import { jobsClient } from "@/lib/jobs/jobs-client"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface JobPageProps {
  params: Promise<{
    jobId: string
  }>
}

export async function generateMetadata({ params }: JobPageProps) {
  const { jobId } = await params
  const job = await jobsClient.getById(jobId)

  if (!job) {
    return {
      title: "Job Not Found — Fulcra",
    }
  }

  return {
    title: `${job.title} at ${job.company} — Fulcra`,
    description: job.overview.slice(0, 160),
  }
}

export default async function JobDetailPage({ params }: JobPageProps) {
  const { jobId } = await params
  const job = await jobsClient.getById(jobId)

  if (!job) {
    return (
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <PublicHeader />
        <main className="flex flex-1 flex-col items-center justify-center p-8 text-center">
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Job Listing Not Found
          </h1>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            The role you requested may have expired or been removed by the
            employer.
          </p>
          <Link href="/jobs" className="mt-6">
            <Button variant="outline" className="gap-2 text-xs">
              <ArrowLeft className="h-3.5 w-3.5" />
              Return to job directory
            </Button>
          </Link>
        </main>
        <PublicFooter />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <PublicHeader />
      <main className="flex-1 pb-16">
        <JobDetailView job={job} />
      </main>
      <PublicFooter />
    </div>
  )
}
