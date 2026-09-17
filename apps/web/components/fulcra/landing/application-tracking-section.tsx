"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import {
  Clock,
  Archive,
  FileText,
  CheckCircle2,
  ChevronRight,
  MessageSquare,
  AlertCircle,
} from "lucide-react"
import { Tilt3D } from "@/components/fulcra/shared/tilt-3d"
import { TIMELINE_EVENTS } from "./application-tracking-data"

export function ApplicationTrackingSection() {
  const [selectedEventId, setSelectedEventId] =
    React.useState<string>("stage-3")
  const activeEvent =
    TIMELINE_EVENTS.find((e) => e.id === selectedEventId) ?? TIMELINE_EVENTS[0]

  return (
    <section className="border-t border-border py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Copy */}
          <div className="space-y-5 lg:col-span-5">
            <div className="flex items-center gap-2">
              <span className="block font-mono text-xs tracking-wider text-role uppercase">
                APPLICATION TRACKING
              </span>
              <span className="rounded bg-muted px-2 py-0.5 font-mono text-[10px] font-semibold text-candidate">
                PREVIEW
              </span>
            </div>

            <h3 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Nothing you&apos;ve sent gets lost.
            </h3>

            <p className="text-sm leading-relaxed text-muted-foreground">
              Which resume revision, which salary expectation, which custom
              answers, and which interviewer notes — attached to every
              application automatically, so you never have to reconstruct what
              you told an employer six weeks ago.
            </p>

            <div className="space-y-3 pt-2 text-xs text-muted-foreground">
              <div className="flex items-start gap-2.5">
                <Archive className="mt-0.5 h-4 w-4 shrink-0 text-role" />
                <span>
                  <strong className="text-foreground">
                    Full artifact archive:
                  </strong>{" "}
                  Inspect the exact PDF hash and responses submitted for every
                  single role.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-candidate" />
                <span>
                  <strong className="text-foreground">
                    Contextual interview prep:
                  </strong>{" "}
                  Next steps automatically highlight the specific requirements
                  interviewers intend to probe.
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Timeline Panel + Interactive Artifact Inspector */}
          <div className="lg:col-span-7">
            <Tilt3D maxAngle={4} scale={1.01}>
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-7">
                {/* Header */}
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-heading text-base font-semibold text-foreground">
                        Senior Backend Engineer
                      </span>
                      <span className="text-xs text-muted-foreground">
                        · Vela Systems
                      </span>
                    </div>
                    <div className="font-mono text-xs text-muted-foreground">
                      Pipeline ID: app-2026-09-vela · Greenhouse ATS
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-candidate/40 bg-candidate/10 font-mono text-[11px] font-semibold text-candidate"
                    >
                      PREVIEW
                    </Badge>
                    <Badge
                      variant="outline"
                      className="gap-1 border-role/30 bg-accent font-mono text-[11px] text-role"
                    >
                      <Clock className="h-3 w-3" />
                      Active Pipeline
                    </Badge>
                  </div>
                </div>

                {/* Interactive Timeline Rail */}
                <div className="relative mb-6 space-y-4 pl-2">
                  <div
                    aria-hidden="true"
                    className="absolute top-3 bottom-3 left-[15px] w-0.5 bg-border"
                  />
                  {TIMELINE_EVENTS.map((event) => {
                    const isSelected = event.id === selectedEventId
                    return (
                      <button
                        key={event.id}
                        type="button"
                        onClick={() => setSelectedEventId(event.id)}
                        className={`relative flex w-full items-start gap-3.5 rounded-lg p-2 text-left transition-colors ${
                          isSelected
                            ? "bg-muted/70 ring-1 ring-border"
                            : "hover:bg-muted/30"
                        }`}
                      >
                        <div
                          className={`mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-card ${
                            event.active
                              ? "bg-role ring-4 ring-role/20"
                              : "bg-muted-foreground/40"
                          }`}
                        />
                        <div className="flex-1 space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-xs font-semibold ${isSelected ? "text-foreground" : "text-muted-foreground"}`}
                            >
                              {event.stage}
                            </span>
                            <ChevronRight
                              className={`h-3.5 w-3.5 transition-transform ${isSelected ? "rotate-90 text-role" : "text-muted-foreground/40"}`}
                            />
                          </div>
                          <div className="font-mono text-[11px] text-muted-foreground">
                            {event.date} · {event.actor}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Inspectable Artifact Drawer */}
                <div className="rounded-lg border border-border/80 bg-background/80 p-4 font-mono text-xs">
                  <div className="mb-3 flex items-center justify-between border-b border-border/40 pb-2">
                    <span className="flex items-center gap-1.5 font-semibold text-role">
                      <Archive className="h-3.5 w-3.5" />
                      ATTACHED ARTIFACTS & LOGS
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Click stages above to inspect
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-foreground">
                        <FileText className="h-3 w-3 text-role" />
                        SUBMITTED RESUME VERSION
                      </div>
                      <div className="mt-0.5 text-muted-foreground">
                        {activeEvent.artifacts.resume}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-foreground">
                        <MessageSquare className="h-3 w-3 text-candidate" />
                        RECORDED DISCLOSURES & ANSWERS
                      </div>
                      <div className="mt-0.5 text-muted-foreground">
                        {activeEvent.artifacts.answers}
                      </div>
                    </div>

                    <div className="rounded border border-role/20 bg-role/5 p-2.5">
                      <div className="text-[11px] font-semibold text-role">
                        INTERVIEWER / SYSTEM NOTES
                      </div>
                      <div className="mt-0.5 font-sans text-xs text-foreground">
                        {activeEvent.artifacts.notes}
                      </div>
                    </div>

                    <div className="rounded border border-candidate/30 bg-candidate/10 p-2.5">
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-candidate">
                        <AlertCircle className="h-3 w-3" />
                        PREPARATION ACTION
                      </div>
                      <div className="mt-0.5 font-sans text-xs font-medium text-foreground">
                        {activeEvent.artifacts.nextAction}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Tilt3D>
          </div>
        </div>
      </div>
    </section>
  )
}
