# Aurik Web App

The primary web application for the Aurik Identity Platform. This is a **Next.js 16** application that serves two distinct purposes:

1. **Public Landing Page** — Marketing site describing Aurik's features and capabilities.
2. **Developer Dashboard** — Authenticated interface where developers register, manage, and configure their OAuth 2.0 client applications.

It acts as the **UI host** for authentication flows (sign-in, sign-up, consent, password reset) which are rendered inside this app but are driven by the separate Auth Server over the OIDC protocol.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui (Radix UI primitives) |
| Animations | Motion (Framer Motion v12) |
| Data Fetching | TanStack Query v5 |
| Forms | React Hook Form + Zod |
| Notifications | Sonner |
| File Storage | AWS S3 (via Tigris) |
| Theme | next-themes (light/dark mode) |
| Icons | Lucide React |

---

## Project Structure

```
apps/web-app/
├── src/
│   ├── app/
│   │   ├── (user)/                  # Authenticated user routes (route group)
│   │   │   ├── developer/           # Developer dashboard
│   │   │   │   ├── page.tsx         # Developer overview page
│   │   │   │   ├── layout.tsx       # Developer layout with sidebar
│   │   │   │   └── apps/            # Application management CRUD pages
│   │   │   └── profile/             # User profile management pages
│   │   ├── auth/                    # Auth UI pages (hosted in this app)
│   │   │   ├── signin/              # Sign-in page
│   │   │   ├── signup/              # Sign-up page
│   │   │   ├── consent/             # OAuth 2.0 consent screen
│   │   │   ├── forget-password/     # Forgot password initiation
│   │   │   ├── reset-password/      # Password reset with token
│   │   │   └── verify-email/        # Email verification flow
│   │   ├── api/                     # Next.js API Routes (internal proxy)
│   │   ├── globals.css              # Global CSS + theme tokens (oklch palette)
│   │   ├── layout.tsx               # Root layout with font/metadata/providers
│   │   ├── page.tsx                 # Landing page
│   │   └── Provider.tsx             # TanStack Query client provider
│   ├── components/                  # Shared React components
│   ├── hooks/                       # Custom React hooks
│   ├── lib/                         # Utility functions, API clients
│   ├── config/                      # App-level configuration
│   ├── data/                        # Static/seed data
│   ├── zod/                         # Shared Zod validation schemas
│   ├── proxy.ts                     # Internal proxy to the Auth Server
│   └── instrumentation.ts           # Next.js instrumentation hook
├── public/                          # Static assets (SVGs, OG image)
├── next.config.ts                   # Next.js configuration
├── components.json                  # shadcn/ui component registry config
├── postcss.config.mjs               # PostCSS / Tailwind config
├── tsconfig.json
└── package.json
```

---

## Typography System

The app loads four Google Fonts via `next/font`:

| Variable | Font | Usage |
|----------|------|-------|
| `--font-display` | DM Serif Display | Hero headings |
| `--font-fraunces` | Fraunces (italic) | Accent / editorial text |
| `--font-mono` | JetBrains Mono | Code snippets |
| `--font-body` | Outfit (300–800) | All body copy |

---

## Key Pages & Routes

### Public

| Route | Description |
|-------|-------------|
| `/` | Landing page with Hero, Features Bento Grid, Usage, FAQ, and Footer |

### Auth Flows

| Route | Description |
|-------|-------------|
| `/auth/signin` | Sign in to Aurik account |
| `/auth/signup` | Create a new Aurik account |
| `/auth/consent` | OAuth 2.0 user consent screen |
| `/auth/forget-password` | Request password reset email |
| `/auth/reset-password` | Reset password using email token |
| `/auth/verify-email` | Verify email address via token |

### Authenticated Dashboard

| Route | Description |
|-------|-------------|
| `/developer` | Developer overview & API key display |
| `/developer/apps` | List all registered OAuth 2.0 applications |
| `/developer/apps/[id]` | View & edit a specific application |
| `/profile` | User profile management with avatar upload |

---

## Environment Variables

Create a `.env` file in `apps/web-app/` with the following:

```env
# Auth Server base URL (public, browser-visible)
NEXT_PUBLIC_API_URL=http://localhost:8080

NODE_ENV=development

# PostgreSQL connection (for server-side DB access via @aurik/database)
DATABASE_URL=postgres://user:password@localhost:5432/aurik_db

# S3 / Tigris credentials for avatar uploads
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_ENDPOINT_URL_S3=https://t3.storage.dev
AWS_ENDPOINT_URL_IAM=https://iam.storage.dev
AWS_REGION=auto

S3_BUCKET_NAME=aurik
```

---

## Getting Started

```bash
# From the monorepo root
pnpm install

# Run only the web app
cd apps/web-app
pnpm dev
```

The app starts on **http://localhost:3000** by default.

---

## Internal API Proxy

The web app contains Next.js API routes (`src/api/`) that proxy requests to the Auth Server and handle operations that require database access (profile updates, developer app management). This keeps secrets like the database connection string server-side only.

---

## SEO & Metadata

Configured in `layout.tsx`:
- **Title**: `Aurik – Own Your Identity Layer`
- **Open Graph** with `og-image.png` (1200×630)
- **Twitter Card**: `summary_large_image`
- Full Google bot directives for maximum crawlability

---

## Dependencies

### Runtime
- `next` 16.2.4, `react` 19, `react-dom` 19
- `@aurik/database`, `@aurik/logger`, `@aurik/zod` (workspace)
- `@tanstack/react-query` v5
- `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`
- `motion`, `lucide-react`, `sonner`, `next-themes`
- `react-hook-form`, `@hookform/resolvers`, `zod`
- `shadcn`, `radix-ui`, `class-variance-authority`, `clsx`, `tailwind-merge`
- `react-easy-crop`, `react-day-picker`, `date-fns`
- `axios`, `bcryptjs`

### Dev
- `tailwindcss` v4, `@tailwindcss/postcss`
- `typescript` ^5, `@types/react`, `@types/node`
