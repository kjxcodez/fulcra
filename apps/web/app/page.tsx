"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Kbd } from "@/components/ui/kbd"
import {
  SearchIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  InfoIcon,
  XCircleIcon,
  ArrowUpRightIcon,
  SparklesIcon,
} from "lucide-react"

export default function FulcraShowcasePage() {
  const progressVal = 78
  const [checked, setChecked] = React.useState(true)
  const [switchOn, setSwitchOn] = React.useState(true)

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-card px-6 py-3.5">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded bg-primary font-heading text-sm font-bold text-primary-foreground">
              F
            </div>
            <span className="font-heading text-lg font-bold tracking-tight">
              Fulcra Design System
            </span>
            <Badge variant="role" className="ml-2">
              v1.0 Primitives
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Kbd>⌘K</Kbd>
            <span className="text-xs text-muted-foreground">
              Command Palette
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl space-y-12 px-6 py-10">
        {/* Hero Section */}
        <section className="space-y-3">
          <h1 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
            Semantic Component Foundation
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground">
            The Base UI and shadcn primitives configured with the Fulcra design
            tokens: Ink, Paper, Indigo, and Brass with restrained 4px/6px radii,
            borders over shadows, and IBM Plex typography.
          </p>
        </section>

        {/* 1. Color Palette Tokens */}
        <section className="space-y-4">
          <div className="border-b border-border pb-2">
            <h2 className="font-heading text-xl font-semibold">
              1. Core Semantic Colors
            </h2>
            <p className="text-sm text-muted-foreground">
              Harmonious light-mode paper-and-ink baseline palette.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-7">
            <div className="rounded border border-border bg-card p-3 shadow-xs">
              <div className="h-10 rounded border border-border bg-[#F1F2EE]" />
              <p className="mt-2 text-xs font-medium">Paper (Bg)</p>
              <p className="font-mono text-[11px] text-muted-foreground">
                #F1F2EE
              </p>
            </div>
            <div className="rounded border border-border bg-card p-3 shadow-xs">
              <div className="h-10 rounded bg-[#14161F]" />
              <p className="mt-2 text-xs font-medium">Ink-900 (Text)</p>
              <p className="font-mono text-[11px] text-muted-foreground">
                #14161F
              </p>
            </div>
            <div className="rounded border border-border bg-card p-3 shadow-xs">
              <div className="h-10 rounded bg-primary" />
              <p className="mt-2 text-xs font-medium">Indigo (Brand)</p>
              <p className="font-mono text-[11px] text-muted-foreground">
                #3552E0
              </p>
            </div>
            <div className="rounded border border-border bg-card p-3 shadow-xs">
              <div className="h-10 rounded bg-[var(--candidate)]" />
              <p className="mt-2 text-xs font-medium">Brass (Candidate)</p>
              <p className="font-mono text-[11px] text-muted-foreground">
                #B08D3E
              </p>
            </div>
            <div className="rounded border border-border bg-card p-3 shadow-xs">
              <div className="h-10 rounded bg-[var(--success)]" />
              <p className="mt-2 text-xs font-medium">Success</p>
              <p className="font-mono text-[11px] text-muted-foreground">
                #1C8C5E
              </p>
            </div>
            <div className="rounded border border-border bg-card p-3 shadow-xs">
              <div className="h-10 rounded bg-[var(--warning)]" />
              <p className="mt-2 text-xs font-medium">Warning</p>
              <p className="font-mono text-[11px] text-muted-foreground">
                #D97706
              </p>
            </div>
            <div className="rounded border border-border bg-card p-3 shadow-xs">
              <div className="h-10 rounded bg-[var(--danger)]" />
              <p className="mt-2 text-xs font-medium">Danger</p>
              <p className="font-mono text-[11px] text-muted-foreground">
                #C4432E
              </p>
            </div>
          </div>
        </section>

        {/* 2. Buttons */}
        <section className="space-y-4">
          <div className="border-b border-border pb-2">
            <h2 className="font-heading text-xl font-semibold">
              2. Canonical Button Primitive
            </h2>
            <p className="text-sm text-muted-foreground">
              40px default height, 48px large, 4px radius, IBM Plex Sans 500
              weight, Indigo focus ring.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="default">Primary (Indigo)</Button>
            <Button variant="outline">Secondary (Outline)</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link Style</Button>
            <Button size="lg">Large 48px</Button>
            <Button size="sm">Small 32px</Button>
            <Button disabled>Disabled</Button>
          </div>
        </section>

        {/* 3. Badges */}
        <section className="space-y-4">
          <div className="border-b border-border pb-2">
            <h2 className="font-heading text-xl font-semibold">
              3. Status Indicators & Badges
            </h2>
            <p className="text-sm text-muted-foreground">
              Soft-fill semantic styling (100-level bg + 700-level text) — never
              solid filled.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="default">Default Neutral</Badge>
            <Badge variant="outline">Outline Filter</Badge>
            <Badge variant="success">
              <CheckCircleIcon className="size-3" />
              Strong Match (Success)
            </Badge>
            <Badge variant="warning">
              <AlertTriangleIcon className="size-3" />
              Needs Review (Warning)
            </Badge>
            <Badge variant="danger">
              <XCircleIcon className="size-3" />
              Missing Skill (Danger)
            </Badge>
            <Badge variant="info">
              <InfoIcon className="size-3" />
              Informational
            </Badge>
            <Badge variant="candidate">
              <SparklesIcon className="size-3" />
              Candidate Context
            </Badge>
            <Badge variant="role">Role Context</Badge>
          </div>
        </section>

        {/* 4. Form Controls & Inputs */}
        <section className="space-y-4">
          <div className="border-b border-border pb-2">
            <h2 className="font-heading text-xl font-semibold">
              4. Form Controls & Inputs
            </h2>
            <p className="text-sm text-muted-foreground">
              40px height, hairline borders, Indigo focus states, tabular
              numerals.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">
                  Text Input (40px Default)
                </label>
                <Input placeholder="e.g. Senior Frontend Engineer" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">
                  Input Group with Addon & Icon
                </label>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <SearchIcon className="size-4 text-muted-foreground" />
                  </InputGroupAddon>
                  <Input placeholder="Search job titles, companies, or skills..." />
                </InputGroup>
              </div>
              <div className="flex items-center gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="checkbox-demo"
                    checked={checked}
                    onCheckedChange={(c) => setChecked(!!c)}
                  />
                  <label
                    htmlFor="checkbox-demo"
                    className="text-sm text-foreground select-none"
                  >
                    Remote Only
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="switch-demo"
                    checked={switchOn}
                    onCheckedChange={(c) => setSwitchOn(!!c)}
                  />
                  <label
                    htmlFor="switch-demo"
                    className="text-sm text-foreground select-none"
                  >
                    Realtime Sync
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">
                Textarea (6px Radius)
              </label>
              <Textarea
                placeholder="Paste job description or requirements..."
                className="min-h-[110px]"
              />
            </div>
          </div>
        </section>

        {/* 5. In-flow Cards & Elevation */}
        <section className="space-y-4">
          <div className="border-b border-border pb-2">
            <h2 className="font-heading text-xl font-semibold">
              5. Cards (Elevation-0 In-Flow)
            </h2>
            <p className="text-sm text-muted-foreground">
              Restrained border-only treatment (no drop shadow in normal flow),
              6px radius.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="role">Staff Engineer</Badge>
                  <span className="font-mono text-xs text-muted-foreground">
                    2d ago
                  </span>
                </div>
                <CardTitle>Principal Systems Architect</CardTitle>
                <CardDescription>
                  Acme Distributed Computing · San Francisco, CA (Hybrid)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      ATS Compatibility
                    </span>
                    <span className="font-mono font-semibold text-foreground tabular-nums">
                      {progressVal}%
                    </span>
                  </div>
                  <Progress value={progressVal} />
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <span className="font-mono text-xs text-muted-foreground">
                  $210,000 – $260,000
                </span>
                <Button size="sm">
                  View Analysis
                  <ArrowUpRightIcon className="ml-1 size-3.5" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="candidate">Candidate Evidence</Badge>
                  <span className="font-mono text-xs text-muted-foreground">
                    v3 Optimized
                  </span>
                </div>
                <CardTitle>Technical Resume Profile</CardTitle>
                <CardDescription>
                  Alexander Wright · 12 Years Experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Extracted 18 core competencies verified across 3 past roles.
                  All competencies have traceable evidence markers in source
                  documentation.
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <Badge variant="default">Distributed Systems</Badge>
                  <Badge variant="default">TypeScript</Badge>
                  <Badge variant="default">Next.js</Badge>
                  <Badge variant="success">Kubernetes</Badge>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <Button variant="outline" size="sm">
                  Inspect Gaps
                </Button>
                <Button size="sm">Tailor for Job</Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* 6. Tabs & Underline Indicator */}
        <section className="space-y-4">
          <div className="border-b border-border pb-2">
            <h2 className="font-heading text-xl font-semibold">
              6. Underline Tabs
            </h2>
            <p className="text-sm text-muted-foreground">
              Indigo active underline indicator with clean IBM Plex Sans
              typography.
            </p>
          </div>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="match">Match Analysis</TabsTrigger>
              <TabsTrigger value="ats">ATS Diagnostics</TabsTrigger>
              <TabsTrigger value="timeline">History</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="pt-4">
              <p className="text-sm text-muted-foreground">
                Overview of the target role and key requirement distributions.
              </p>
            </TabsContent>
            <TabsContent value="match" className="pt-4">
              <p className="text-sm text-muted-foreground">
                Diagnostic score breakdown mapping skills against candidate
                evidence.
              </p>
            </TabsContent>
            <TabsContent value="ats" className="pt-4">
              <p className="text-sm text-muted-foreground">
                Parser compatibility breakdown with keyword density analysis.
              </p>
            </TabsContent>
            <TabsContent value="timeline" className="pt-4">
              <p className="text-sm text-muted-foreground">
                Chronological application and tailoring audit trail.
              </p>
            </TabsContent>
          </Tabs>
        </section>

        {/* 7. Dense Data Table */}
        <section className="space-y-4">
          <div className="border-b border-border pb-2">
            <h2 className="font-heading text-xl font-semibold">
              7. Data Table & Tabular Numerals
            </h2>
            <p className="text-sm text-muted-foreground">
              Muted headers, hairline borders, accent selection, tabular number
              alignment.
            </p>
          </div>
          <div className="rounded-md border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Skill Dimension</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Match Score</TableHead>
                  <TableHead className="text-right">Evidence Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">
                    System Architecture
                  </TableCell>
                  <TableCell>
                    <Badge variant="success">Strong Match</Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono font-semibold tabular-nums">
                    94%
                  </TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground tabular-nums">
                    8 items
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    TypeScript & React Ecosystem
                  </TableCell>
                  <TableCell>
                    <Badge variant="success">Strong Match</Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono font-semibold tabular-nums">
                    92%
                  </TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground tabular-nums">
                    12 items
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Kubernetes & Container Orchestration
                  </TableCell>
                  <TableCell>
                    <Badge variant="warning">Review Recommended</Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono font-semibold tabular-nums">
                    68%
                  </TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground tabular-nums">
                    3 items
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    GraphQL Schema Design
                  </TableCell>
                  <TableCell>
                    <Badge variant="danger">Missing Evidence</Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono font-semibold tabular-nums">
                    32%
                  </TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground tabular-nums">
                    0 items
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </section>

        {/* 8. Alerts & Banners */}
        <section className="space-y-4">
          <div className="border-b border-border pb-2">
            <h2 className="font-heading text-xl font-semibold">
              8. Semantic Alerts
            </h2>
            <p className="text-sm text-muted-foreground">
              Soft-fill colored callouts matching Fulcra status guidelines.
            </p>
          </div>
          <div className="grid gap-3">
            <Alert variant="success">
              <CheckCircleIcon className="size-4" />
              <AlertTitle>Profile Optimization Complete</AlertTitle>
              <AlertDescription>
                All 5 requirements have verified source evidence. ATS
                compatibility estimated at 92%.
              </AlertDescription>
            </Alert>
            <Alert variant="warning">
              <AlertTriangleIcon className="size-4" />
              <AlertTitle>Resume Evidence Gap Detected</AlertTitle>
              <AlertDescription>
                The job description requires 3+ years of Kubernetes experience,
                which is currently unmentioned in your CV.
              </AlertDescription>
            </Alert>
            <Alert variant="info">
              <InfoIcon className="size-4" />
              <AlertTitle>Diagnostic Notice</AlertTitle>
              <AlertDescription>
                Scores represent diagnostic estimates based on common ATS parser
                algorithms, not guaranteed rankings.
              </AlertDescription>
            </Alert>
          </div>
        </section>

        {/* 9. Loading Skeletons */}
        <section className="space-y-4">
          <div className="border-b border-border pb-2">
            <h2 className="font-heading text-xl font-semibold">
              9. Loading States & Skeletons
            </h2>
            <p className="text-sm text-muted-foreground">
              Skeleton shimmer using Fulcra custom properties (--skeleton-base /
              --skeleton-shimmer).
            </p>
          </div>
          <div className="grid gap-4 rounded-md border border-border bg-card p-6 md:grid-cols-3">
            <div className="space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-20 w-full" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-20 w-full" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-border bg-card py-6 text-center text-xs text-muted-foreground">
        <p>Fulcra Design System · Base UI Primitives · Next.js Turbopack</p>
      </footer>
    </div>
  )
}
