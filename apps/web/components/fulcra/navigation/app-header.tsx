"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FulcraBrandMark } from "./public-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UserCircle, ExternalLink, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const APP_NAV_ITEMS = [
  { label: "Discover", href: "/jobs", isPublic: true },
  { label: "Candidate", href: "/candidate", active: true },
  { label: "Matches", href: "#", disabled: true, tag: "Phase 9" },
  { label: "Resumes", href: "#", disabled: true, tag: "Phase 10" },
  { label: "Applications", href: "#", disabled: true, tag: "Phase 11" },
]

export function AppHeader() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand & Main Navigation */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <FulcraBrandMark className="h-5 w-5" />
            <span className="font-heading text-base font-semibold tracking-tight">
              Fulcra
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {APP_NAV_ITEMS.map((item) => {
              const isCurrent = pathname === item.href
              if (item.disabled) {
                return (
                  <span
                    key={item.label}
                    className="flex cursor-not-allowed items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground/50"
                    title={`Scheduled for ${item.tag}`}
                  >
                    {item.label}
                    {item.tag && (
                      <span className="py-0.2 rounded bg-muted/60 px-1 font-mono text-[9px]">
                        {item.tag}
                      </span>
                    )}
                  </span>
                )
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                    isCurrent
                      ? "bg-accent font-semibold text-accent-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Right: Principal & Public View */}
        <div className="hidden items-center gap-3 sm:flex">
          <div className="flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-2.5 py-1 text-xs">
            <UserCircle className="h-3.5 w-3.5 text-candidate" />
            <span className="font-mono text-[11px] text-muted-foreground">
              dev-candidate-user
            </span>
            <Badge
              variant="outline"
              className="ml-1 border-candidate/40 font-mono text-[9px] text-candidate uppercase"
            >
              Dev Principal
            </Badge>
          </div>

          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <span>Public site</span>
              <ExternalLink className="h-3 w-3" />
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <div className="flex md:hidden">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile nav menu */}
      {mobileOpen && (
        <div className="border-b border-border bg-background px-4 py-3 md:hidden">
          <div className="flex flex-col gap-2">
            {APP_NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.disabled ? "#" : item.href}
                onClick={() => !item.disabled && setMobileOpen(false)}
                className={cn(
                  "flex items-center justify-between py-1.5 text-sm",
                  item.disabled
                    ? "cursor-not-allowed text-muted-foreground/50"
                    : pathname === item.href
                      ? "font-semibold text-primary"
                      : "text-foreground"
                )}
              >
                <span>{item.label}</span>
                {item.tag && (
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {item.tag}
                  </span>
                )}
              </Link>
            ))}
            <div className="mt-2 flex items-center justify-between border-t border-border pt-2 text-xs">
              <span className="font-mono text-[11px] text-muted-foreground">
                dev-candidate-user
              </span>
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-1 text-primary hover:underline"
              >
                Public site <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
