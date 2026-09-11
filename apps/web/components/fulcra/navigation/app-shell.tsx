"use client"

import * as React from "react"
import { AppHeader } from "./app-header"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      <AppHeader />
      <main className="flex-1">{children}</main>
    </div>
  )
}
