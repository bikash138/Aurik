"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { navLinks } from "@/data/nav-links";
import Image from "next/image";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl">
        <div
          className="flex items-center gap-1 p-1 pl-6 rounded-full border bg-white/70 dark:bg-black/70 backdrop-blur-md transition-all duration-300 justify-between"
          style={{ borderColor: "var(--color-border)" }}
        >
          {/* BRAND */}
          <Link
            href="/"
            className="flex items-center font-display text-2xl gap-x-1 font-medium tracking-tight text-foreground mr-2 no-underline"
          >
            {/* Light Theme Logo */}
            <Image
              src="/logo.svg"
              alt="Aurik Logo"
              width={24}
              height={24}
              className="w-6 h-6 dark:hidden"
            />
            {/* Dark Theme Logo */}
            <Image
              src="/logo_white.svg"
              alt="Aurik Logo"
              width={24}
              height={24}
              className="w-6 h-6 hidden dark:block"
            />
            Aurik
          </Link>

          {/* DESKTOP LINKS */}
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
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-1">
            <Link
              href="/developer"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-95 transition-all active:scale-95 no-underline text-sm"
            >
              Get Started
            </Link>
            <ThemeToggle />
            {/* HAMBURGER */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 rounded-full hover:bg-secondary/50 transition-all"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {open && (
          <div
            className="md:hidden mt-2 rounded-2xl border bg-white/90 dark:bg-black/90 backdrop-blur-md p-3 flex flex-col gap-1"
            style={{ borderColor: "var(--color-border)" }}
          >
            {navLinks.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                className="px-4 py-3 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-secondary/50 rounded-xl transition-all no-underline"
              >
                {label}
              </Link>
            ))}
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="mt-1 flex items-center justify-center px-4 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-95 transition-all no-underline text-sm"
            >
              Get Started
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}
