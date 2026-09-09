import { Space_Grotesk, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google"

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

export const metadata = {
  title: "Fulcra",
  description: "Weighs a candidate against a role — and a role against a candidate pool — continuously, and shows its work.",
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
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
