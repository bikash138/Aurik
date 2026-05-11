# Aurik Auth Server

The **Aurik Auth Server** is the core identity and authorization engine for the Aurik platform. It is a standalone **Express 5** application that implements the **OpenID Connect (OIDC)** and **OAuth 2.0** specifications, providing secure authentication, token management, and user identity services to any registered client application.

---

## Tech Stack

| Layer            | Technology                                  |
| ---------------- | ------------------------------------------- |
| Runtime          | Node.js ≥18, ESM                            |
| Framework        | Express 5                                   |
| Language         | TypeScript 6                                |
| Database         | PostgreSQL (via `@aurik/database` / Prisma) |
| JWT Signing      | `jose` (RS256 / JWKS)                       |
| Password Hashing | `bcryptjs`                                  |
| Email            | Resend                                      |
| Logging          | `@aurik/logger` (Pino-based)                |
| Validation       | Zod v4 (`@aurik/zod`)                       |
| Build            | `tsdown` (ESM output)                       |
| Dev Watcher      | `tsx watch`                                 |

---

## Project Structure

```
apps/auth-server/
├── src/
│   ├── index.ts               # Bootstrap: DB connect → signing keys → start server
│   ├── server.ts              # AppServer class: middleware, routing, error handling
│   ├── config/
│   │   ├── env.config.ts      # Zod-validated environment variables
│   │   └── logger.config.ts   # Pino logger + HTTP logger middleware
│   ├── core/
│   │   └── middlewares/
│   │       ├── error.middleware.ts       # Global error handler
│   │       ├── session.middleware.ts     # Session cookie → req.session hydration
│   │       └── accessToken.middleware.ts # Bearer token → req.user hydration
│   ├── infra/
│   │   └── database.ts        # Prisma client singleton
│   ├── utils/
│   │   └── create-oidc-key-pair.ts  # RS256 signing key initialization
│   └── modules/
│       ├── auth/              # Core authentication module
│       │   ├── auth.routes.ts
│       │   ├── auth.handler.ts
│       │   ├── auth.service.ts
│       │   └── auth.repo.ts
│       └── oidc/              # OIDC protocol implementation
│           ├── oidc.routes.ts
│           ├── authorize/     # Authorization endpoint
│           ├── consent/       # Consent session management
│           ├── token/         # Token & revocation endpoints
│           ├── userinfo/      # UserInfo endpoint
│           ├── logout/        # RP-initiated logout
│           └── well-known/    # Discovery + JWKS endpoints
├── .env.example
├── tsconfig.json
└── package.json
```

---

## API Reference

### Health

| Method | Path      | Description                                |
| ------ | --------- | ------------------------------------------ |
| GET    | `/health` | Returns `{ status: "healthy", timestamp }` |

### Auth Routes (`/auth`)

| Method | Path                    | Description                       |
| ------ | ----------------------- | --------------------------------- |
| POST   | `/auth/signup`          | Register a new user               |
| POST   | `/auth/signin`          | Sign in, returns session cookie   |
| POST   | `/auth/verify-email`    | Verify email with OTP/token       |
| POST   | `/auth/forgot-password` | Send password reset email         |
| POST   | `/auth/reset-password`  | Reset password using token        |
| POST   | `/auth/signout`         | Invalidate session                |
| GET    | `/auth/me`              | Return current authenticated user |

### OIDC Routes (`/o`)

| Method | Path                 | Description                                           |
| ------ | -------------------- | ----------------------------------------------------- |
| GET    | `/o/authorize`       | Authorization endpoint (PKCE, redirects to consent)   |
| GET    | `/o/consent-session` | Retrieve pending consent parameters                   |
| POST   | `/o/consent`         | User grants/denies consent, issues auth code          |
| POST   | `/o/token`           | Exchange auth code for tokens (access + refresh + ID) |
| POST   | `/o/token/revoke`    | Revoke an access or refresh token (RFC 7009)          |
| GET    | `/o/userinfo`        | Return claims for a valid access token                |

### Discovery / JWKS (`/.well-known`)

| Method | Path                                | Description                      |
| ------ | ----------------------------------- | -------------------------------- |
| GET    | `/.well-known/openid-configuration` | OIDC Discovery document          |
| GET    | `/.well-known/jwks.json`            | Public signing keys (RS256 JWKS) |

---

## OIDC Flow Overview

```
Client App              Auth Server               User
    │                       │                       │
    │──GET /o/authorize─────▶│                       │
    │  (client_id, PKCE      │                       │
    │   challenge, scopes)   │──redirect to /auth ──▶│
    │                       │    /signin UI          │
    │                       │◀──Session cookie───────│
    │                       │                       │
    │                       │──redirect to consent──▶│
    │                       │                       │
    │                       │◀──POST /o/consent──────│
    │                       │   (approve scopes)     │
    │◀──redirect + code─────│                       │
    │                       │                       │
    │──POST /o/token────────▶│                       │
    │  (code + verifier)     │                       │
    │◀──access_token,        │                       │
    │   refresh_token,       │                       │
    │   id_token─────────────│                       │
```

**Token signing**: All JWTs (access tokens and ID tokens) are signed with **RS256** using rotating RSA key pairs stored in the database. The public keys are published at `/.well-known/jwks.json` for any relying party to verify.

---

## Database Models

The auth server relies on the shared `@aurik/database` package (Prisma + PostgreSQL). Relevant models:

| Model               | Description                                                                           |
| ------------------- | ------------------------------------------------------------------------------------- |
| `User`              | Identity record with hashed password, profile fields, and email verification status   |
| `Client`            | Registered OAuth 2.0 application (clientId, secret hash, redirect URIs, scopes, TTLs) |
| `Session`           | HTTP session tokens linked to a user (for the auth UI flows)                          |
| `ConsentSession`    | Temporary store of OIDC authorize params across the redirect flow                     |
| `Consent`           | Persisted record of which scopes a user has approved for a client                     |
| `AuthorizationCode` | Short-lived single-use codes issued after consent                                     |
| `AccessToken`       | Issued access tokens with revocation support                                          |
| `RefreshToken`      | Long-lived tokens with rotation chain (`previousTokenId`)                             |
| `SigningKey`        | RS256 key pairs (private + public PEM) with expiry                                    |
| `VerificationToken` | Email verification and password reset tokens                                          |
| `AuditLog`          | Immutable record of auth events                                                       |

---

## Environment Variables

Create a `.env` file in `apps/auth-server/` based on `.env.example`:

```env
# Server
PORT=8080
NODE_ENV=development

# URLs
AUTH_SERVER_BASE_URL=http://localhost:8080
AUTH_UI_URL=http://localhost:3000       # Origin allowed by CORS (the web-app)

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/aurik_db

# Security
ENCRYPTION_KEY=your-32-character-hex-key   # Used to encrypt client secrets at rest

# Email (Resend)
RESEND_API_KEY=re_your_api_key
```

---

## Getting Started

```bash
# Install dependencies from repo root
pnpm install

# Run in dev mode (tsx watch for hot reload)
cd apps/auth-server
pnpm dev

# Build for production
pnpm build

# Run production build
pnpm start
```

The server starts on **http://localhost:8080** by default.

---

## Security Design

- **PKCE** is enforced on every authorization request — no implicit flow.
- **Client secrets** are stored as bcrypt hashes; the raw secret is shown only once at creation time.
- **Access tokens** are opaque JWTs signed RS256; they are also stored in the DB to enable revocation.
- **Refresh token rotation** — each refresh invalidates the previous token and issues a new one, with a `previousTokenId` chain for audit.
- **Sessions** are httpOnly cookies; they are separate from OIDC tokens and exist only for auth UI flows.
- CORS is locked to `AUTH_UI_URL` only.
