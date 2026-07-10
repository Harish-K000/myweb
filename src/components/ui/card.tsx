import * as React from "react"

import { cn } from "@/lib/utils"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  padding?: "default" | "sm" | "none"
}

const paddingClasses = {
  default: "p-6 md:p-8",
  sm: "p-4",
  none: "",
} as const

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, padding = "default", ...props }, ref) => (
    <div
      ref={ref}
      className={cn("ui-card", hover && "ui-card-hover", paddingClasses[padding], className)}
      {...props}
    />
  )
)
Card.displayName = "Card"

export { Card }
