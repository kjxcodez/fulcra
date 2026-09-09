import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "cn"

/**
 * Fulcra Input
 *
 * States (DESIGN.md §9.2):
 *   Default  → border-input (hairline #DBDCD5)
 *   Focus    → border-primary + focus ring (Indigo)
 *   Error    → border-destructive + ring
 *   Disabled → input/50 fill, opacity-50
 *   Read-only → no border, muted fill
 *
 * Height: 40px (matches Fulcra button default height)
 * Radius: 4px (--radius-sm)
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded border border-input bg-transparent",
        "px-3 py-2 text-sm text-foreground",
        "placeholder:text-muted-foreground",
        "transition-colors outline-none",
        // File input styles
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        // Focus — Indigo border + ring
        "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/45 focus-visible:ring-offset-0",
        // Disabled
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50",
        // Error
        "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }
