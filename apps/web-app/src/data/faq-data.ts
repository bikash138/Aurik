export type FaqItem = {
  q: string;
  a: string;
};

export const faqs: FaqItem[] = [
  {
    q: "Is Aurik really free?",
    a: "Yes. Aurik is free to start — register unlimited apps, authenticate unlimited users, and access the full OAuth 2.0 and OIDC feature set at no cost. Paid plans unlock team seats, enterprise SSO, and higher rate limits when you're ready to scale.",
  },
  {
    q: "What authentication protocols does Aurik support?",
    a: "Aurik is fully compliant with OAuth 2.0, OpenID Connect (OIDC), and PKCE. It works out of the box with any OIDC-compatible client library — including oidc-client-ts, next-auth, passport.js, and Auth.js.",
  },
  {
    q: "How do I add Sign in with Aurik to my app?",
    a: "Register your application in the Aurik dashboard to get a Client ID and Client Secret. Then configure your OIDC client to point at Aurik's issuer URL, drop the Sign in button into your login page, and you're done — no backend auth code required.",
  },
  {
    q: "Does Aurik store my users' passwords?",
    a: "Aurik handles credential storage using bcrypt hashing with per-user salts. Plaintext passwords are never persisted or logged at any point in the authentication flow.",
  },
  {
    q: "Can I use Aurik with Next.js, React, or Node?",
    a: "Yes. Because Aurik is a standard OIDC provider, it integrates with any framework or runtime. We maintain quickstart guides for Next.js (Auth.js), React SPA, Node/Express, and plain fetch-based flows.",
  },
  {
    q: "What happens if I need to migrate away from Aurik?",
    a: "There is no vendor lock-in. You can export your full user database (IDs, emails, hashed credentials, metadata) as JSON or CSV at any time from the dashboard. Because Aurik uses open standards, switching to another OIDC-compliant provider requires only a config change.",
  },
  {
    q: "Is there a rate limit on authentication requests?",
    a: "The free tier allows up to 1 000 auth requests per minute per application. Higher limits are available on paid plans, and enterprise customers can negotiate custom SLAs.",
  },
];
