"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const Accordion = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    type?: "single" | "multiple"
    collapsible?: boolean
  }
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-4", className)} {...props}>
    {children}
  </div>
))
Accordion.displayName = "Accordion"

const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value: string
  }
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("border-b border-gray-200 last:border-b-0", className)} {...props} />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "w-full text-left py-4 flex items-center justify-between hover:text-pink-600 transition-colors font-medium",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDown className="w-4 h-4 transition-transform" />
    </button>
  ),
)
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("pb-4 text-gray-600 leading-relaxed", className)} {...props}>
      {children}
    </div>
  ),
)
AccordionContent.displayName = "AccordionContent"

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
