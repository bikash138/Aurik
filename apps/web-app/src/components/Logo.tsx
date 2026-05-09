"use client";

import Image from "next/image";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function Logo({ width = 24, height = 24, className = "w-6 h-6" }: LogoProps) {
  return (
    <>
      {/* Light Theme Logo */}
      <Image
        src="/logo.svg"
        alt="Aurik Logo"
        width={width}
        height={height}
        className={`${className} dark:hidden`}
      />
      {/* Dark Theme Logo */}
      <Image
        src="/logo_white.svg"
        alt="Aurik Logo"
        width={width}
        height={height}
        className={`${className} hidden dark:block`}
      />
    </>
  );
}
