"use client"

import * as React from "react"
import { Accordion as AccordionPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { PlusIcon, XIcon } from "lucide-react"

function Accordion({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  )
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("not-last:border-b", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger relative flex flex-1 items-center justify-between rounded-lg border border-transparent py-4 text-left font-semibold transition-all outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
        <span
          data-slot="accordion-trigger-icon"
          className="ml-4 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors group-aria-expanded/accordion-trigger:border-primary group-aria-expanded/accordion-trigger:bg-primary group-aria-not-expanded/accordion-trigger:border-border group-aria-not-expanded/accordion-trigger:bg-transparent"
          style={{ color: "inherit" }}
        >
          <PlusIcon
            className="pointer-events-none h-3.5 w-3.5 group-aria-expanded/accordion-trigger:hidden"
            style={{ color: "var(--color-text-muted)" }}
          />
          <XIcon
            className="pointer-events-none hidden h-3.5 w-3.5 group-aria-expanded/accordion-trigger:block"
            style={{ color: "var(--color-primary-foreground)" }}
          />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden text-sm data-open:animate-accordion-down data-closed:animate-accordion-up"
      {...props}
    >
      <div
        className={cn(
          "h-(--radix-accordion-content-height) pt-0 pb-2.5 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
