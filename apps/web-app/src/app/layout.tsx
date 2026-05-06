import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { DM_Serif_Display, DM_Mono, Outfit } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
  preload: true,
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal"],
  variable: "--font-mono",
  display: "swap",
  preload: true,
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  // 300 → hero subheadings, feature descriptions
  // 400 → body copy, nav links, table content
  // 500 → card titles (h3), button text, form labels
  // 600 → reserved for emphasis if needed (use sparingly)
  variable: "--font-body",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Aurik - Own Your Identity Layer",
  description:
    "The simple identity platform. Add secure sign-in, OAuth 2.0, and user management to any application with ease",

  keywords: [
    "authentication",
    "identity provider",
    "OAuth 2.0",
    "OpenID Connect",
    "OIDC",
    "SSO",
    "user management",
    "developer tools",
    "secure sign-in",
    "auth platform",
  ],

  authors: [{ name: "Aurik", url: "https://aurik.bikashshaw.in" }],
  creator: "Aurik",

  openGraph: {
    type: "website",
    url: "https://aurik.bikashshaw.in",
    title: "Aurik",
    description:
      "The simple identity platform. Add secure sign-in, OAuth 2.0, and user management to any application with ease",
    siteName: "Aurik",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Aurik - Own Your Identity Layer",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Aurik - Own Your Identity Layer",
    description:
      "The simple identity platform. Add secure sign-in, OAuth 2.0, and user management to any application with ease",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`
        ${dmSerifDisplay.variable}
        ${dmMono.variable}
        ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <TooltipProvider>
          {children}
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}
