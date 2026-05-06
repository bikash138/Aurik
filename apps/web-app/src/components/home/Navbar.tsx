"use client";

import React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { navLinks } from "@/data/nav-links";

export function Navbar() {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div
        className="flex items-center gap-1 p-1 pl-6 rounded-full border bg-white/70 dark:bg-black/70 backdrop-blur-md transition-all duration-300 justify-center"
        style={{ borderColor: "var(--color-border)" }}
      >
        {/* BRAND */}
        <Link
          href="/"
          className="font-display text-lg font-medium tracking-tight text-foreground mr-2 no-underline"
        >
          Aurik
        </Link>

        {/* LINKS */}
        <div className="hidden md:flex items-center">
          {navLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="px-4 py-2 text-md font-medium text-foreground/70 hover:text-foreground hover:bg-secondary/50 rounded-full transition-all no-underline"
            >
              {label}
            </Link>
          ))}
          <div className="h-4 w-px bg-border mx-2" />
        </div>

        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-95 transition-all active:scale-95 no-underline"
        >
          Get Started
        </Link>
        <ThemeToggle />
      </div>
    </nav>
  );
}
