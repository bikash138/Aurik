# Aurik — Own Your Identity Layer

**Aurik** is an open-source identity platform that lets developers add secure sign-in, OAuth 2.0, and user management to any application. It implements the **OpenID Connect (OIDC)** and **OAuth 2.0** specifications from scratch, giving you full control of your own identity layer.

> Homepage: [aurik.cloud](https://aurik.cloud) · GitHub: [bikash138/Aurik](https://github.com/bikash138/Aurik)

---

## What's in This Monorepo

This is a **pnpm + Turborepo** monorepo with two applications and three shared packages.

### Applications

| App             | Path                                               | Description                                             |
| --------------- | -------------------------------------------------- | ------------------------------------------------------- |
| **Web App**     | [`apps/web-app`](./apps/web-app/README.md)         | Next.js 16 landing page + developer dashboard + auth UI |
| **Auth Server** | [`apps/auth-server`](./apps/auth-server/README.md) | Express 5 OIDC / OAuth 2.0 identity server              |

### Packages

| Package                    | Path                                           | Description                                             |
| -------------------------- | ---------------------------------------------- | ------------------------------------------------------- |
| `@aurik/sdk`               | [`packages/sdk`](./packages/sdk/src/README.md) | Official isomorphic Aurik SDK (React, Express, core)    |
| `@aurik/database`          | `packages/database`                            | Prisma client + PostgreSQL schema (shared between apps) |
| `@aurik/logger`            | `packages/logger`                              | Pino-based structured logger                            |
| `@aurik/zod`               | `packages/zod`                                 | Shared Zod validation schemas                           |
| `@aurik/typescript-config` | `packages/typescript-config`                   | Base TypeScript configs                                 |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     User / Developer Browser                    │
└────────────────────┬─────────────────────┬──────────────────────┘
                     │                     │
              ┌──────▼───────┐     ┌───────▼────────────┐
              │   Web App    │     │  Client Application│
              │  (Next.js)   │     │  (using @aurik/sdk)│
              │  :3000       │     │                    │
              └──────┬───────┘     └───────┬────────────┘
                     │                     │
                     │  OIDC / OAuth 2.0   │
                     └──────────┬──────────┘
                                │
                    ┌───────────▼──────────────┐
                    │      Auth Server         │
                    │      (Express 5)         │
                    │      :8080               │
                    │                          │
                    │  /.well-known/openid-    │
                    │    configuration         │
                    │  /.well-known/jwks.json  │
                    │  /o/authorize            │
                    │  /o/consent              │
                    │  /o/token                │
                    │  /o/token/revoke         │
                    │  /o/userinfo             │
                    │  /auth/signin|signup|... │
                    └───────────┬──────────────┘
                                │
                    ┌───────────▼──────────────┐
                    │       PostgreSQL         │
                    │  (@aurik/database)       │
                    │  Users, Clients, Tokens, │
                    │  Consents, Signing Keys  │
                    └──────────────────────────┘
```

**Key design principles:**

- The **Auth Server** is the single source of truth for identity. It issues, validates, and revokes all tokens.
- The **Web App** hosts auth UI pages (sign-in, sign-up, consent, etc.) but all identity logic runs server-side in the Auth Server.
- The **SDK** abstracts OIDC mechanics for client apps — PKCE, code exchange, silent refresh, and privacy-first token revocation — in both React SPA and Express SSR flavors.

---

## Prerequisites

- **Node.js** ≥ 18
- **pnpm** 9.x
- **PostgreSQL** (local or remote)
- A [Resend](https://resend.com) API key (for transactional email)

---

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/bikash138/Aurik.git
cd Aurik
pnpm install
```

### 2. Configure Environment Variables

**Auth Server** — copy and fill in `apps/auth-server/.env.example`:

```env
PORT=8080
NODE_ENV=development
AUTH_SERVER_BASE_URL=http://localhost:8080
AUTH_UI_URL=http://localhost:3000
DATABASE_URL=postgresql://user:password@localhost:5432/aurik_db
ENCRYPTION_KEY=your-32-character-hex-key
RESEND_API_KEY=re_your_api_key
```

**Web App** — create `apps/web-app/.env`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/aurik_db
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_ENDPOINT_URL_S3=https://t3.storage.dev
AWS_REGION=auto
S3_BUCKET_NAME=aurik
```

### 3. Set Up the Database

```bash
cd packages/database
pnpm prisma migrate dev
```

### 4. Run Everything

```bash
# From the monorepo root — starts all apps in parallel via Turborepo
pnpm dev
```

Or run each app individually:

```bash
# Auth Server
cd apps/auth-server && pnpm dev   # http://localhost:8080

# Web App
cd apps/web-app && pnpm dev       # http://localhost:3000
```

---

## Monorepo Scripts

Run from the **root** of the repository:

| Command            | Description                                             |
| ------------------ | ------------------------------------------------------- |
| `pnpm dev`         | Start all apps and packages in dev mode (Turborepo)     |
| `pnpm build`       | Build all packages and apps in dependency order         |
| `pnpm lint`        | Lint all workspaces                                     |
| `pnpm check-types` | TypeScript type-check all workspaces                    |
| `pnpm format`      | Format all `.ts`, `.tsx`, and `.md` files with Prettier |

---

## OIDC / OAuth 2.0 Flow

```
1. Client calls GET /o/authorize
   (client_id, redirect_uri, PKCE challenge, scopes)

2. Auth Server checks session → redirects to /auth/signin if unauthenticated

3. User signs in → Auth Server creates a session

4. Auth Server redirects to /auth/consent
   → User approves requested scopes

5. Auth Server issues an authorization_code
   → redirects back to client redirect_uri

6. Client calls POST /o/token
   (code + PKCE verifier + optional client_secret)
   → receives access_token, refresh_token, id_token

7. Client calls GET /o/userinfo with Bearer access_token
   → receives user profile claims

8. On sign-out: client calls POST /o/token/revoke
   for both access_token and refresh_token
```

All tokens are **RS256-signed JWTs**. The public keys are published at `/.well-known/jwks.json` and are rotated automatically on server startup.

---

## Integrating with the SDK

Add Aurik authentication to your own application in minutes using the official SDK.

```bash
npm install @aurik/sdk
```

Full SDK documentation → [`packages/sdk/src/README.md`](./packages/sdk/src/README.md)

### React (Public Client / SPA)

```tsx
import { AurikProvider, useAurik, SigninButton } from "@aurik/sdk/react";

<AurikProvider
  clientId="YOUR_CLIENT_ID"
  redirectUri="http://localhost:3000/callback"
>
  <App />
</AurikProvider>;
```

### Express (Confidential Client / SSR)

```ts
import { AurikExpress } from "@aurik/sdk/express";

const aurik = new AurikExpress({
  clientId: process.env.AURIK_CLIENT_ID!,
  clientSecret: process.env.AURIK_CLIENT_SECRET!,
  redirectUri: "http://localhost:4000/auth/callback",
});

app.get("/auth/signin", aurik.redirectToSignin());
app.get(
  "/auth/callback",
  aurik.handleCallback({ successRedirect: "/", errorRedirect: "/login" }),
);
app.get("/protected", aurik.requireAuth(), handler);
app.get("/auth/signout", aurik.handleSignout({ redirectUri: "/" }));
```

---

## Database Schema (Summary)

Managed by **Prisma** in `packages/database`. Key entities:

| Model               | Purpose                                                                   |
| ------------------- | ------------------------------------------------------------------------- |
| `User`              | End-user identity — email, hashed password, profile fields                |
| `Client`            | Registered OAuth 2.0 application — credentials, redirect URIs, token TTLs |
| `Session`           | Auth-UI sessions (httpOnly cookie-based, separate from OIDC tokens)       |
| `ConsentSession`    | Temporary store of OIDC params during redirect flow                       |
| `Consent`           | Persisted user ↔ client scope approvals                                   |
| `AuthorizationCode` | Single-use, short-lived auth codes                                        |
| `AccessToken`       | Issued JWTs (stored for revocation)                                       |
| `RefreshToken`      | Rotating long-lived tokens with chain audit trail                         |
| `SigningKey`        | RS256 RSA key pairs for JWT signing (auto-rotated)                        |
| `VerificationToken` | Email verification & password reset tokens                                |
| `AuditLog`          | Immutable security event log                                              |

---

## Detailed Documentation

- 📄 [**Web App** (apps/web-app/README.md)](./apps/web-app/README.md) — Next.js app, routes, env vars, typography system
- 📄 [**Auth Server** (apps/auth-server/README.md)](./apps/auth-server/README.md) — OIDC endpoints, security design, API reference
- 📄 [**SDK** (packages/sdk/src/README.md)](./packages/sdk/src/README.md) — Full API reference for React, Express, and core utilities

---

## License

MIT © [Bikash Shaw](https://bikashshaw.in)
