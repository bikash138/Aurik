# @aurik/sdk

The official **Aurik Identity SDK** — an isomorphic, tree-shakable TypeScript library for integrating [Aurik](https://aurik.cloud) authentication into any JavaScript application.

The SDK ships **three independent entry points** so you only bundle what you need:

| Entry Point | Import Path | Environment |
|-------------|-------------|-------------|
| Core utilities | `@aurik/sdk` | Universal (browser + Node) |
| React integration | `@aurik/sdk/react` | Browser / React 18+ / 19 |
| Express adapter | `@aurik/sdk/express` | Node.js / Express 4–5 |

---

## Installation

```bash
npm install @aurik/sdk
# or
pnpm add @aurik/sdk
```

---

## Quick Start

### React (SPA / Public Client)

```tsx
import { AurikProvider, useAurik, SigninButton } from "@aurik/sdk/react";

function App() {
  return (
    <AurikProvider
      clientId="your_client_id"
      redirectUri="http://localhost:3000/callback"
    >
      <HomePage />
    </AurikProvider>
  );
}

function HomePage() {
  const { user, isAuthenticated, signout } = useAurik();

  if (!isAuthenticated) return <SigninButton />;

  return (
    <div>
      <p>Welcome, {user?.given_name}!</p>
      <button onClick={signout}>Sign out</button>
    </div>
  );
}
```

### Express (SSR / Confidential Client)

```ts
import express from "express";
import { AurikExpress } from "@aurik/sdk/express";

const app = express();
const aurik = new AurikExpress({
  clientId: process.env.AURIK_CLIENT_ID!,
  clientSecret: process.env.AURIK_CLIENT_SECRET!,
  redirectUri: "http://localhost:4000/auth/callback",
});

// Redirect to Aurik sign-in
app.get("/auth/signin", aurik.redirectToSignin());

// Handle the callback, exchange code for tokens
app.get("/auth/callback", aurik.handleCallback({
  successRedirect: "/dashboard",
  errorRedirect: "/auth/signin",
}));

// Protect routes
app.get("/dashboard", aurik.requireAuth(), (req, res) => {
  res.json({ user: (req as any).user });
});

// Sign out and revoke tokens
app.get("/auth/signout", aurik.handleSignout({
  redirectUri: "/",
}));
```

---

## API Reference

### Core (`@aurik/sdk`)

#### `PKCE`

Generates a cryptographically secure PKCE pair for the authorization flow.

```ts
const { verifier, challenge } = await PKCE.generate();
// verifier: 64-char URL-safe random string (stored client-side)
// challenge: SHA-256 Base64URL hash of verifier (sent to auth server)
```

#### `Discovery`

Fetches and caches the Aurik OIDC Discovery document (`/.well-known/openid-configuration`). All SDK modules use this internally to resolve endpoint URLs.

```ts
const config = await Discovery.get();
// config.token_endpoint, config.userinfo_endpoint, etc.
```

#### `TokenExchange`

Low-level token operations.

```ts
// Exchange authorization code for tokens
const tokens = await TokenExchange.exchangeCode({
  clientId,
  code,
  redirectUri,
  codeVerifier,
  clientSecret?, // Optional for public clients
});

// Refresh an expired access token
const newTokens = await TokenExchange.refresh({ clientId, refreshToken });

// Revoke a token (RFC 7009)
await TokenExchange.revoke({
  clientId,
  token,
  tokenTypeHint: "access_token" | "refresh_token",
});
```

#### `UserManager`

Fetches the user profile from the `/o/userinfo` endpoint using an access token.

```ts
const user = await UserManager.getUser(accessToken);
// Returns: AurikUser { sub, email, given_name, family_name, picture, ... }
```

#### `AurikUser` interface

```ts
interface AurikUser {
  sub: string;
  email?: string;
  email_verified?: boolean;
  given_name?: string;
  family_name?: string;
  picture?: string;
  updated_at?: string;
  [key: string]: any; // Additional claims
}
```

---

### React (`@aurik/sdk/react`)

#### `<AurikProvider>`

Wraps your application. Manages the full auth lifecycle: callback handling, token exchange, silent refresh on mount, and token revocation on sign-out.

```tsx
<AurikProvider clientId="..." redirectUri="...">
  {children}
</AurikProvider>
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `clientId` | `string` | Your Aurik application client ID |
| `redirectUri` | `string` | The URI Aurik redirects back to after sign-in |
| `children` | `ReactNode` | Your application tree |

**Session storage**: The PKCE `code_verifier` is stored in `sessionStorage`. The `refresh_token` is persisted in `localStorage` (`aurik_refresh_token`) and exchanged silently on every page load.

#### `useAurik()`

```ts
const {
  user,            // AurikUser | null
  isAuthenticated, // boolean
  isLoading,       // boolean (true during initial hydration)
  error,           // string | null
  signin,          // () => void — redirects to Aurik sign-in
  signout,         // () => void — revokes tokens + clears state
  getAccessToken,  // () => Promise<string | null>
} = useAurik();
```

#### `<SigninButton>`

A pre-built, branded sign-in button. Requires `<AurikProvider>` as an ancestor.

```tsx
<SigninButton theme="dark" />   // or theme="light"
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `theme` | `"light" \| "dark"` | `"dark"` | Button color scheme |
| `className` | `string` | `""` | Additional CSS classes |
| `style` | `CSSProperties` | — | Inline style overrides |

#### `<AurikLogo>`

The Aurik logo SVG component, used inside `SigninButton` but available independently.

```tsx
import { AurikLogo } from "@aurik/sdk/react";
<AurikLogo color="#000000" className="w-5 h-5" />
```

---

### Express (`@aurik/sdk/express`)

#### `AurikExpress`

Extends `AurikServer`. All PKCE verifiers are stored in **httpOnly cookies** (`aurik_verifier`); tokens are stored as **httpOnly cookies** (`aurik_access_token`, `aurik_refresh_token`) — never exposed to browser JavaScript.

```ts
const aurik = new AurikExpress({
  clientId: string,
  clientSecret: string,  // Required for confidential clients
  redirectUri: string,
});
```

| Method | Returns | Description |
|--------|---------|-------------|
| `redirectToSignin()` | `RequestHandler` | Generates PKCE pair, stores verifier in cookie, redirects to Aurik |
| `handleCallback(opts)` | `RequestHandler` | Reads code + verifier cookie, exchanges for tokens, stores in cookies |
| `requireAuth()` | `RequestHandler` | Guards a route; attaches `req.user` or returns 401 |
| `handleSignout(opts)` | `RequestHandler` | Revokes both tokens, clears cookies, redirects |

#### `AurikServer` (base class)

Lower-level class you can extend for custom server frameworks.

```ts
const server = new AurikServer({ clientId, clientSecret, redirectUri });

await server.exchangeCode(code, codeVerifier);
await server.refresh(refreshToken);
await server.getUser(accessToken);
await server.revokeToken(token, "access_token" | "refresh_token");
```

---

## Token Revocation (Privacy-First Sign-Out)

Both the React and Express adapters implement **OIDC-compliant token revocation (RFC 7009)**. On sign-out, both the access token and refresh token are revoked server-side at `/o/token/revoke` before clearing local state. This ensures that even if a token was somehow captured, it is immediately invalidated.

---

## Build

```bash
# From the monorepo root or packages/sdk
pnpm build

# Outputs:
# dist/index.js      — Core entry
# dist/index.d.ts
# dist/react/context.js    — React entry
# dist/server/express.js   — Express entry
```

Built with **tsup** (esbuild-based), ESM output, minified, with full `.d.ts` declarations.

---

## Package Exports

```json
{
  ".":        { "import": "./dist/index.js",          "types": "./dist/index.d.ts" },
  "./react":  { "import": "./dist/react/context.js",  "types": "./dist/react/context.d.ts" },
  "./express":{ "import": "./dist/server/express.js", "types": "./dist/server/express.d.ts" }
}
```

---

## Peer Dependencies

```json
{
  "react":     "^18.0.0 || ^19.0.0",
  "react-dom": "^18.0.0 || ^19.0.0",
  "express":   "^4.0.0 || ^5.0.0"
}
```

Only install the peer dependencies relevant to your environment.

---

## Repository

[github.com/bikash138/Aurik](https://github.com/bikash138/Aurik)  
Homepage: [aurik.cloud](https://aurik.cloud)
