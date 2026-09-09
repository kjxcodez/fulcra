import { cn } from "cn"

/**
 * Fulcra Skeleton
 *
 * Uses --skeleton-base (#E7E8E2 = Ink-100) as base fill.
 * Shimmer animation cycles through --skeleton-shimmer (#F1F2EE = Paper).
 * Shimmer is disabled under prefers-reduced-motion (see globals.css).
 *
 * Radius: rounded-md (6px) by default, overridable via className.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "skeleton-shimmer rounded-md",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
