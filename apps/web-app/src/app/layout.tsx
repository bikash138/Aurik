import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
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
