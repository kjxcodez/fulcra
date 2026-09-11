"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AuthGateDialog } from "@/components/fulcra/auth/auth-gate-dialog"
import { Menu, X } from "lucide-react"

export function FulcraBrandMark({
  className = "h-6 w-6",
}: {
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <polygon points="50,28 78,78 22,78" fill="#14161F" />
      <g transform="rotate(-4 50 48)">
        <line
          x1="26"
          y1="52"
          x2="74"
          y2="44"
          stroke="#14161F"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx="27" cy="53" r="8" fill="#B08D3E" />
        <circle cx="73" cy="43" r="8" fill="#3552E0" />
      </g>
    </svg>
  )
}

export function PublicHeader() {
  const [authGateOpen, setAuthGateOpen] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/90 backdrop-blur-md transition-colors">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-2.5 transition-transform hover:opacity-90"
          >
            <FulcraBrandMark className="h-6 w-6 text-foreground" />
            <span className="font-heading text-lg font-semibold tracking-tight text-foreground">
              Fulcra
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            <Link
              href="/#loop"
              className="transition-colors hover:text-foreground"
            >
              How it works
            </Link>
            <Link
              href="/#matching"
              className="transition-colors hover:text-foreground"
            >
              Matching
            </Link>
            <Link
              href="/#modes"
              className="transition-colors hover:text-foreground"
            >
              For recruiters
            </Link>
            <Link
              href="/jobs"
              className="transition-colors hover:text-foreground"
            >
              Explore jobs
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 md:flex">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAuthGateOpen(true)}
              className="border-border/80 text-xs font-medium"
            >
              Log in
            </Button>
            <Link href="/jobs">
              <Button
                size="sm"
                className="bg-primary text-xs font-medium text-white shadow-xs"
              >
                Explore jobs
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="animate-in border-b border-border bg-background px-4 py-4 duration-200 fade-in-0 md:hidden">
            <nav className="flex flex-col gap-3 text-sm font-medium text-foreground">
              <Link
                href="/#loop"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 transition-colors hover:text-primary"
              >
                How it works
              </Link>
              <Link
                href="/#matching"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 transition-colors hover:text-primary"
              >
                Matching
              </Link>
              <Link
                href="/#modes"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 transition-colors hover:text-primary"
              >
                For recruiters
              </Link>
              <Link
                href="/jobs"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 font-semibold text-primary transition-colors hover:text-primary"
              >
                Explore jobs
              </Link>
              <div className="flex flex-col gap-2 border-t border-border pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    setAuthGateOpen(true)
                  }}
                  className="w-full text-xs"
                >
                  Log in
                </Button>
                <Link href="/jobs" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    size="sm"
                    className="w-full bg-primary text-xs text-white"
                  >
                    Explore jobs
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      <AuthGateDialog
        open={authGateOpen}
        onOpenChange={setAuthGateOpen}
        actionName="Sign in to Fulcra"
        featureDescription="Sign in to access your candidate profile, personalized match diagnostics, and tailored resumes."
      />
    </>
  )
}
