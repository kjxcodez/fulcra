"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react"

interface ComparisonRow {
  requirement: string
  evidence: string
  source: string
  status: "strong" | "partial" | "unverified" | "unavailable"
  statusLabel: string
}

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    requirement: "Go (Golang) · 5+ years production backend",
    evidence: "5.5 years verified Go backend development across 2 roles",
    source: "RapidQuest Solutions (2024–2026), Veloce Logic (2020–2024)",
    status: "strong",
    statusLabel: "Strong match",
  },
  {
    requirement: "PostgreSQL · Query performance & complex schema design",
    evidence: "Designed sharded relational schemas; optimized sub-10ms queries",
    source: "RapidQuest Solutions · Verified tenure artifact",
    status: "strong",
    statusLabel: "Strong match",
  },
  {
    requirement:
      "Distributed Systems · High-throughput microservice architecture",
    evidence:
      "Built and scaled distributed services handling 40M+ daily requests",
    source: "RapidQuest Solutions · 'Platform scale' verified entry",
    status: "strong",
    statusLabel: "Strong match",
  },
  {
    requirement: "Cloud Infrastructure · AWS (ECS, RDS, S3, CloudWatch)",
    evidence:
      "Production infrastructure maintenance & automated CI/CD deployment",
    source: "Veloce Logic · Cloud infrastructure experience",
    status: "strong",
    statusLabel: "Strong match",
  },
  {
    requirement:
      "Kubernetes · Cluster administration and container orchestration",
    evidence:
      "Mentioned on resume; no verified production cluster admin in history",
    source: "Unverified claim — evidence unavailable in work history",
    status: "unverified",
    statusLabel: "Not verified",
  },
]

export function EvidenceComparisonSurface() {
  return (
    <section className="border-t border-border bg-card/40 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 max-w-2xl space-y-3">
          <span className="font-mono text-xs font-semibold tracking-wider text-candidate uppercase">
            evidence alignment
          </span>
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            See how Fulcra compares evidence — line by line.
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            A match is not an opaque number. We weigh every explicit requirement
            against proven evidence from your profile history. Where proof is
            missing, we surface the gap honestly instead of guessing.
          </p>
        </div>

        {/* Evidence Comparison Matrix Table */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40 font-mono text-[11px] text-muted-foreground uppercase">
                  <th className="w-1/3 px-4 py-3">Role Requirement</th>
                  <th className="w-5/12 px-4 py-3">
                    Candidate Evidence & Source
                  </th>
                  <th className="w-1/4 px-4 py-3 text-right">Honesty State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {COMPARISON_ROWS.map((row, idx) => (
                  <tr key={idx} className="transition-colors hover:bg-muted/20">
                    {/* Requirement */}
                    <td className="px-4 py-4 align-top">
                      <div className="text-xs font-semibold text-foreground sm:text-sm">
                        {row.requirement.split(" · ")[0]}
                      </div>
                      <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                        {row.requirement.split(" · ")[1]}
                      </div>
                    </td>

                    {/* Evidence */}
                    <td className="px-4 py-4 align-top">
                      <div className="text-xs font-medium text-foreground">
                        {row.evidence}
                      </div>
                      <div className="mt-1 flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
                        <span className="shrink-0 text-role">Source:</span>
                        <span>{row.source}</span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-4 py-4 text-right align-top">
                      {row.status === "strong" ? (
                        <Badge
                          variant="outline"
                          className="text-success-text gap-1.5 border-success/40 bg-success/10 font-mono text-[11px]"
                        >
                          <CheckCircle2 className="h-3 w-3 text-success" />
                          <span>{row.statusLabel}</span>
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-warning-text gap-1.5 border-warning/40 bg-warning/10 font-mono text-[11px]"
                        >
                          <AlertTriangle className="h-3 w-3 text-warning" />
                          <span>{row.statusLabel}</span>
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Matrix Footnote / Provenance Guarantee */}
          <div className="flex flex-col items-center justify-between gap-3 border-t border-border/80 bg-muted/20 p-4 font-mono text-xs text-muted-foreground sm:flex-row">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0 text-candidate" />
              <span>
                Kubernetes flagged as &quot;Not verified&quot; because work
                history lacks production cluster ownership.
              </span>
            </div>
            <span className="font-medium text-role">
              4 Strong Matches · 1 Gap Flagged
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
