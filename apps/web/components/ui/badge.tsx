import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

/**
 * Fulcra Badge — soft-fill semantic style.
 *
 * Fulcra rule: badges use 100-level background + 700-level text.
 * They are always static (non-interactive) unless rendered as <a>.
 * Never use a solid filled badge — only soft fills.
 *
 * Variants:
 *   default   → Neutral (ink fill, for general labeling)
 *   outline   → Border only (for tags, filters)
 *   success   → Green soft (strong match, confirmed)
 *   warning   → Amber soft (gap, needs review)
 *   danger    → Red soft (failed, expired, destructive)
 *   info      → Blue soft (informational only)
 *   candidate → Brass soft (candidate-side data)
 *   role      → Indigo soft (role/recruiter-side data)
 */
const badgeVariants = cva(
  [
    "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center",
    "gap-1 overflow-hidden rounded-full border border-transparent",
    "px-2 py-0.5 text-xs font-medium whitespace-nowrap",
    "font-[family-name:var(--font-sans)]",
    "transition-colors",
    "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
    "has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5",
    "[&>svg]:pointer-events-none [&>svg]:size-3!",
  ],
  {
    variants: {
      variant: {
        /** Neutral — general labeling, status, type */
        default: "border-border bg-muted text-foreground",
        /** Outline — tag/filter style */
        outline: "border-border bg-transparent text-foreground",
        /** Success — strong match, offer extended, confirmed */
        success:
          "border-transparent bg-[var(--success-subtle)] text-[var(--success-text)]",
        /** Warning — missing requirement, gap, needs review */
        warning:
          "border-transparent bg-[var(--warning-subtle)] text-[var(--warning-text)]",
        /** Danger — failed, expired, destructive state */
        danger:
          "border-transparent bg-[var(--danger-subtle)] text-[var(--danger-text)]",
        /** Info — informational banners/labels only */
        info: "border-transparent bg-[var(--info-subtle)] text-[var(--info)]",
        /** Candidate — Brass / candidate-side context */
        candidate:
          "border-transparent bg-[var(--candidate-subtle)] text-[var(--candidate-text)]",
        /** Role — Indigo / recruiter/role-side context */
        role: "border-transparent bg-[var(--role-subtle)] text-[var(--role)]",
        /** Destructive — alias for danger (shadcn compat) */
        destructive:
          "border-transparent bg-[var(--danger-subtle)] text-[var(--danger-text)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
