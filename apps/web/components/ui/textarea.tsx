import * as React from "react"
import { cn } from "cn"

/**
 * Fulcra Textarea
 *
 * Same states as Input (DESIGN.md §9.2).
 * Auto-grows via field-sizing-content up to max-h constraint.
 * Radius: 6px (radius-md) — slightly more rounded than inputs.
 */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-[80px] w-full",
        "rounded-md border border-input bg-transparent",
        "px-3 py-2 text-sm text-foreground",
        "placeholder:text-muted-foreground",
        "transition-colors outline-none",
        // Focus — Indigo border + ring
        "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/45 focus-visible:ring-offset-0",
        // Disabled
        "disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50",
        // Error
        "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
