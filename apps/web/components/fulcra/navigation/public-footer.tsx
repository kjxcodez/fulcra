import * as React from "react"
import Link from "next/link"
import { FulcraBrandMark } from "./public-header"

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-background py-12 text-muted-foreground transition-colors sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 border-b border-border/80 pb-10 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <FulcraBrandMark className="h-5 w-5" />
              <span className="font-heading text-base font-semibold text-foreground">
                Fulcra
              </span>
            </div>
            <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
              Weighs a candidate against a role — continuously, explainably, and
              with full evidence attribution.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-10 text-xs sm:grid-cols-3 sm:gap-14">
            <div className="space-y-3">
              <div className="font-mono text-[11px] font-semibold tracking-wider text-foreground uppercase">
                Product
              </div>
              <ul className="space-y-2">
                <li>
                  <Link href="/#loop" className="hover:text-foreground">
                    How it works
                  </Link>
                </li>
                <li>
                  <Link href="/#matching" className="hover:text-foreground">
                    Matching
                  </Link>
                </li>
                <li>
                  <Link href="/#modes" className="hover:text-foreground">
                    For recruiters
                  </Link>
                </li>
                <li>
                  <Link
                    href="/jobs"
                    className="font-medium text-primary hover:text-foreground"
                  >
                    Explore jobs
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="font-mono text-[11px] font-semibold tracking-wider text-foreground uppercase">
                Candidates
              </div>
              <ul className="space-y-2">
                <li>
                  <Link href="/candidate" className="hover:text-foreground">
                    Candidate profile
                  </Link>
                </li>
                <li>
                  <span className="cursor-not-allowed text-muted-foreground/60">
                    Resume intelligence (soon)
                  </span>
                </li>
                <li>
                  <span className="cursor-not-allowed text-muted-foreground/60">
                    Application tracker (soon)
                  </span>
                </li>
              </ul>
            </div>

            <div className="col-span-2 space-y-3 sm:col-span-1">
              <div className="font-mono text-[11px] font-semibold tracking-wider text-foreground uppercase">
                Platform
              </div>
              <ul className="space-y-2">
                <li>
                  <span className="cursor-pointer hover:text-foreground">
                    Privacy Policy
                  </span>
                </li>
                <li>
                  <span className="cursor-pointer hover:text-foreground">
                    Terms of Service
                  </span>
                </li>
                <li>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    v0.8.0-beta
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="max-w-4xl pt-6 font-mono text-[11px] leading-relaxed text-muted-foreground">
          Match scores and ATS diagnostics are compatibility estimates based on
          the information available — they simulate how a system is likely to
          read your application, not a guarantee of any specific employer&apos;s
          or ATS&apos;s ranking.
        </div>
      </div>
    </footer>
  )
}
