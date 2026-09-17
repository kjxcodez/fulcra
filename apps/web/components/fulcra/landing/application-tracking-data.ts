export interface TimelineEvent {
  id: string
  stage: string
  date: string
  actor: string
  active?: boolean
  artifacts: {
    resume: string
    answers: string
    notes: string
    nextAction: string
  }
}

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: "stage-3",
    stage: "Moved to Technical Screen",
    date: "2026-09-08 · 14:20 UTC",
    actor: "Recruiter: A. Reyes · Vela Systems",
    active: true,
    artifacts: {
      resume: "Resume v15 (Tailored for distributed Go & Raft consensus)",
      answers:
        "Salary expectation: $195,000 – $215,000 base · Notice period: 3 weeks",
      notes:
        "Hiring Manager wants to deep-dive on RFD-84 failover semantics and p99 latency tuning.",
      nextAction:
        "Review Raft leader-election edge cases prior to Thursday 14:00 UTC technical screen.",
    },
  },
  {
    id: "stage-2",
    stage: "Hiring Manager Qualification Review",
    date: "2026-09-04 · 09:15 UTC",
    actor: "Engineering Lead · Vela Infrastructure Team",
    active: false,
    artifacts: {
      resume: "Resume v15",
      answers: "Work authorization verified: US Citizen · Remote US/Canada",
      notes:
        "Evidence for Go scale confirmed via RapidQuest metrics. Cleared for interview loop.",
      nextAction: "Recruiter screen scheduled.",
    },
  },
  {
    id: "stage-1",
    stage: "Submitted via ATS Integration",
    date: "2026-09-02 · 18:02 UTC",
    actor: "Automated Greenhouse ATS Sync",
    active: false,
    artifacts: {
      resume: "Resume v15 · SHA-256: 8f4e...912a",
      answers:
        "Custom answers: Why Vela? Scaled telemetry architecture challenge.",
      notes: "Receipt acknowledged by ATS endpoint. No duplicate submissions.",
      nextAction: "Awaiting recruiter qualification triage (typically 48-72h).",
    },
  },
]
