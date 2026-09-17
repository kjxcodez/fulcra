import * as React from "react"
import { Metadata } from "next"
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

export async function generateMetadata({
  params,
}: JobPageProps): Promise<Metadata> {
  const { jobId } = await params
  const job = await jobsClient.getById(jobId)

  if (!job) {
    return {
      title: "Job Not Found — Fulcra",
    }
  }

  // Section 5.1 Title template: [Role] — [Work Model] | [Company] | Fulcra
  const workModel =
    job.location.workType.charAt(0).toUpperCase() +
    job.location.workType.slice(1)
  const title = `${job.title} — ${workModel} | ${job.company} | Fulcra`
  const description = `Explore the ${job.title} role at ${job.company}, including requirements, compensation, location, and application details.`

  return {
    title,
    description,
    alternates: {
      canonical: `/jobs/${job.slug || job.id}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
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

  // Structured JobPosting JSON-LD matching visible content exactly per Section 4.2 & 5.3
  const jobPostingSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.overview,
    datePosted: job.postedAt,
    employmentType: job.employmentType
      ? job.employmentType.toUpperCase().replace("-", "_")
      : "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: job.company,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location.city || "Remote",
        addressRegion: job.location.state || "",
        addressCountry: job.location.country || "US",
      },
    },
    ...(job.salary?.min || job.salary?.max
      ? {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: job.salary.currency || "USD",
            value: {
              "@type": "QuantitativeValue",
              minValue: job.salary.min,
              maxValue: job.salary.max,
              unitText: "YEAR",
            },
          },
        }
      : {}),
    directApply: true,
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <PublicHeader />
      {/* JobPosting JSON-LD here only per Rule 12 and Section 4.2 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }}
      />
      <main className="flex-1 pb-16">
        <JobDetailView job={job} />
      </main>
      <PublicFooter />
    </div>
  )
}
