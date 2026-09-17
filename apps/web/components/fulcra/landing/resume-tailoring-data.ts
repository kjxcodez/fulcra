export interface DiffItem {
  id: string
  label: string
  targetReq: string
  before: string
  after: string
  evidenceSource: string
  evidenceSnippet: string
  impact: string
}

export const DIFF_ITEMS: DiffItem[] = [
  {
    id: "throughput",
    label: "Distributed Scale",
    targetReq: "Vela Systems Req #2: Scalable Go backend services",
    before: "Worked on backend systems and internal APIs for analytics team",
    after:
      "Architected and deployed distributed Go microservices handling 40M+ daily events across 4 regional clusters with 99.98% SLA",
    evidenceSource: "RapidQuest Solutions · Staff Backend Engineer (2024–2026)",
    evidenceSnippet:
      "Production deploy metric: 40.2M daily events, p99 latency reduced from 140ms to 24ms.",
    impact:
      "Closes hard technical filter for high-concurrency distributed systems.",
  },
  {
    id: "consensus",
    label: "Consensus & Storage",
    targetReq: "Vela Systems Req #3: Raft / distributed key-value storage",
    before:
      "Configured Redis and Postgres database instances for team services",
    after:
      "Implemented Raft consensus engine replication layer in Go for distributed state store with automated failover",
    evidenceSource: "Open Source / RapidQuest Internal RFD #84",
    evidenceSnippet:
      "Authored RFD-84: High-availability metadata store failover semantics.",
    impact:
      "Turns vague 'database setup' bullet into direct proof of distributed consensus mastery.",
  },
]
