"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/data/faq-data";

export function FAQ() {
  return (
    <section id="faqs" className="px-6 py-24">
      {/* Header */}
      <div className="max-w-2xl mx-auto text-center space-y-3 mb-10">
        <p className="text-eyebrow" style={{ color: "var(--color-text-muted)" }}>
          FAQ
        </p>
        <h2 className="text-h1 text-heading">Common questions.</h2>
        <p className="text-body-lg" style={{ color: "var(--color-text-body)" }}>
          If you don&apos;t see your question, get in touch.
        </p>
      </div>

      {/* Accordion card */}
      <div
        className="max-w-2xl mx-auto rounded-2xl overflow-hidden"
        style={{ border: "0.5px solid var(--color-border)" }}
      >
        <Accordion type="single" collapsible defaultValue="item-0">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="px-6"
              style={{ borderColor: "var(--color-border)" }}
            >
              <AccordionTrigger
                className="text-heading"
                style={{ fontSize: "var(--text-h3-size)", lineHeight: "1.4" }}
              >
                {faq.q}
              </AccordionTrigger>
              <AccordionContent
                className="pb-5"
                style={{
                  color: "var(--color-text-body)",
                  fontSize: "16px",
                  lineHeight: "1.7",
                }}
              >
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Footer */}
      <p
        className="text-center mt-6"
        style={{ color: "var(--color-text-muted)", fontSize: "16px" }}
      >
        Still wondering?{" "}
        <a
          href="mailto:support@aurik.dev"
          className="underline underline-offset-2"
          style={{ color: "var(--color-lime-dark)" }}
        >
          Send us a question.
        </a>
      </p>
    </section>
  );
}
