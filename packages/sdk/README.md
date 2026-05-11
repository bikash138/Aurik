# Aurik Identity SDK

The official isomorphic SDK for the Aurik Identity Platform. Integrate secure, type-safe authentication into your React or Express applications in minutes.

## Features
- **PKCE Flow**: Mandatory security for public applications.
- **Isomorphic**: Same core logic for browser and server environments.
- **React Components**: Branded Signin buttons and hooks included.
- **Express Adapters**: Ready-to-use middlewares for session management.
- **Automatic Token Rotation**: Seamless refresh token handling.
- **Privacy-First Signout**: App-centric revocation that preserves SSO.

---

## Installation

```bash
npm install @aurik/sdk
# or
pnpm add @aurik/sdk
```

---

## ⚛️ React Integration (SPAs)

### 1. Setup the Provider
Wrap your application with the `AurikProvider`.

```tsx
import { AurikProvider } from '@aurik/sdk/react';

export default function App() {
  return (
    <AurikProvider 
      clientId="YOUR_CLIENT_ID" 
      redirectUri="http://localhost:3000/callback"
    >
      <YourRoutes />
    </AurikProvider>
  );
}
```

### 2. Use the Hooks
Access user state and methods from any component.

```tsx
import { useAurik, SigninButton } from '@aurik/sdk/react';

function Header() {
  const { user, isAuthenticated, signout } = useAurik();

  if (isAuthenticated) {
    return (
      <div>
        <span>Welcome, {user.given_name}</span>
        <button onClick={signout}>Logout</button>
      </div>
    );
  }

  return <SigninButton theme="dark" />;
}
```

---

## 🛡️ Express Integration (Backend)

The Express adapter handles cookies, PKCE verifiers, and redirects automatically using `httpOnly` secure cookies.

### 1. Initialize
```ts
import { AurikExpress } from '@aurik/sdk/express';
import cookieParser from 'cookie-parser';

const app = express();
app.use(cookieParser()); // Required

const aurik = new AurikExpress({
  clientId: process.env.AURIK_CLIENT_ID,
  clientSecret: process.env.AURIK_CLIENT_SECRET, // Required for Confidential Apps
  redirectUri: 'http://localhost:3000/api/callback'
});
```

### 2. Routes
```ts
// Initiate Login
app.get('/login', aurik.redirectToSignin());

// Handle Callback (Tokens & Cookies)
// IMPORTANT: This route must match the 'redirectUri' registered in the Aurik Developer Console
app.get('/api/callback', aurik.handleCallback({
  successRedirect: '/dashboard',
  errorRedirect: '/login'
}));

// Protect Routes
app.get('/dashboard', aurik.requireAuth(), (req, res) => {
  res.json({ message: `Hello ${req.user.given_name}` });
});

// Signout (Local Revocation)
app.get('/logout', aurik.handleSignout({ redirectUri: '/' }));
```

---

## 🛠️ Advanced Usage (Core Server)

For non-Express environments (NestJS, Hono, Fastify), use the core `AurikServer` class.

```ts
import { AurikServer } from '@aurik/sdk/server';

const aurik = new AurikServer({ ... });

// Manually swap codes
const tokens = await aurik.exchangeCode(code, verifier);

// Manually fetch user profile
const user = await aurik.getUser(accessToken);
```

---

## Security Policy
Aurik enforces PKCE for all public applications and recommends `httpOnly` cookies for server-side integrations to prevent XSS-based token theft.

---

© 2026 Aurik Identity Platform.
