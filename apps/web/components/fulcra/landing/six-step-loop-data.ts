import {
  Compass,
  BookOpen,
  Scale,
  Sparkles,
  Send,
  Activity,
} from "lucide-react"

export const STEPS = [
  {
    idx: "01",
    name: "Discover",
    icon: Compass,
    summary: "Deduplicated ingestion across boards & career sites.",
  },
  {
    idx: "02",
    name: "Understand",
    icon: BookOpen,
    summary: "Requirements & compensation normalized from raw prose.",
  },
  {
    idx: "03",
    name: "Match",
    icon: Scale,
    summary: "Weighed against your profile across 5 transparent dimensions.",
  },
  {
    idx: "04",
    name: "Optimize",
    icon: Sparkles,
    summary: "Resume claims adapted strictly from verified evidence.",
  },
  {
    idx: "05",
    name: "Apply",
    icon: Send,
    summary: "Direct submission on company ATS with complete audit provenance.",
  },
  {
    idx: "06",
    name: "Track",
    icon: Activity,
    summary: "Every submission & outcome attached, refining future matches.",
  },
]
