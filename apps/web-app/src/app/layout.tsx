import type { Metadata } from "next";
import { DM_Serif_Display, Fraunces, JetBrains_Mono, Outfit } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
  preload: true,
});

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["italic"],
  variable: "--font-fraunces",
  display: "swap",
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal"],
  variable: "--font-mono",
  display: "swap",
  preload: true,
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
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
      "max-video-preview": -1,
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
      suppressHydrationWarning
      className={`
        ${dmSerifDisplay.variable}
        ${jetbrainsMono.variable}
        ${outfit.variable}
        ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute={["class", "data-theme"]}
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
