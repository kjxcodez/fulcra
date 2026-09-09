import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

/**
 * Fulcra Button — reference primitive.
 *
 * Variants:
 *   default     → Primary / Indigo fill, white text
 *   outline     → Secondary / border + transparent fill
 *   ghost       → Ghost / no border, low-emphasis
 *   destructive → Danger / border + text style
 *   link        → Indigo link / underline on hover
 *
 * Sizes:
 *   default     → 40px height (Fulcra minimum touch target)
 *   sm          → 32px
 *   lg          → 48px (primary CTA)
 *   icon        → 40×40px square
 *   icon-sm     → 32×32px
 *   icon-lg     → 48×48px
 */
const buttonVariants = cva(
  [
    "group/button inline-flex shrink-0 items-center justify-center",
    "rounded border border-transparent bg-clip-padding",
    "text-sm font-medium whitespace-nowrap",
    "font-[family-name:var(--font-sans)]",
    "transition-colors outline-none select-none",
    // Focus ring — Indigo at 45% opacity, 2px offset
    "focus-visible:ring-2 focus-visible:ring-ring/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
    // Disabled
    "disabled:pointer-events-none disabled:opacity-40",
    // Loading / aria-busy
    "aria-busy:pointer-events-none",
    // Error state
    "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20",
    // Icon children
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        /**
         * Primary — Indigo fill. One per view maximum.
         */
        default:
          "bg-primary text-primary-foreground hover:bg-[#2540B8] active:bg-[#1D349A]",
        /**
         * Secondary/Outline — border + transparent fill.
         */
        outline:
          "border-border bg-background text-foreground hover:border-[#C7C8C2] hover:bg-muted active:bg-muted aria-expanded:bg-muted",
        /**
         * Ghost — no border, low-emphasis (table row actions, icon buttons).
         */
        ghost:
          "text-foreground hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent aria-expanded:text-accent-foreground",
        /**
         * Destructive — danger border/text style.
         * Shows confirmation dialog before firing (app responsibility).
         */
        destructive:
          "border-destructive/40 bg-transparent text-destructive hover:border-destructive hover:bg-destructive/10 focus-visible:ring-destructive/30",
        /**
         * Link — Indigo underline on hover.
         */
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-10 gap-2 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        sm: "h-8 gap-1.5 rounded px-3 text-[0.8125rem] has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 gap-2 px-5 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        icon: "size-10",
        "icon-sm": "size-8 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
