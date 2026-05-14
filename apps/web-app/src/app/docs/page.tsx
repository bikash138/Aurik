import { Construction, BookOpen, Terminal, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/logo";

export default function DocsComingSoon() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: "var(--color-page-bg)" }}
    >
      <div className="w-full max-w-2xl flex flex-col items-center gap-10 text-center">
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <Logo width={32} height={32} className="w-8 h-8" />
          <span
            className="font-semibold tracking-[0.2em] text-lg"
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--color-text-heading)",
            }}
          >
            AURIK DOCS
          </span>
        </div>

        {/* Status Badge */}
        <div className="flex justify-center">
          <div
            className="badge flex items-center gap-2 px-4 py-2"
            style={{
              backgroundColor: "rgba(184,240,74,0.15)",
              borderColor: "rgba(184,240,74,0.25)",
              color: "#86B32D", // A darker, more grounded lime shade
            }}
          >
            <Construction className="w-4 h-4" />
            <span className="text-xs font-semibold tracking-wider">
              UNDER CONSTRUCTION
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
