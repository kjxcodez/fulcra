import { Space_Grotesk, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google"
import { Metadata } from "next"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

/**
 * Fulcra typography system:
 * - Space Grotesk  → display / headings / brand moments
 * - IBM Plex Sans  → body / UI / buttons / navigation
 * - IBM Plex Mono  → scores / IDs / source tags / timestamps
 */
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
})

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://fulcra.app"
  ),
  title: {
    default: "Fulcra — AI Job Search, Job Matching & Resume Intelligence",
    template: "%s | Fulcra",
  },
  description:
    "Discover relevant jobs, compare your experience with real requirements, optimize your resume, and track every application with Fulcra.",
  keywords: [
    "job matching",
    "resume intelligence",
    "explainable ATS scoring",
    "engineering roles",
    "career decision layer",
  ],
  authors: [{ name: "Fulcra Team" }],
  creator: "Fulcra",
  publisher: "Fulcra",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}

const siteSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://fulcra.app/#organization",
      name: "Fulcra",
      url: "https://fulcra.app",
      description: "Evidence-linked job compatibility and decision layer.",
    },
    {
      "@type": "WebSite",
      "@id": "https://fulcra.app/#website",
      url: "https://fulcra.app",
      name: "Fulcra",
      publisher: {
        "@id": "https://fulcra.app/#organization",
      },
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        spaceGrotesk.variable,
        ibmPlexSans.variable,
        ibmPlexMono.variable
      )}
    >
      <head>
        {/* Sitewide Organization & WebSite structured data per Section 5.3 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
