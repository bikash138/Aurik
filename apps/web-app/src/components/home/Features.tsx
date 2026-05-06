import { ArrowRight, Lock } from "lucide-react";

export function Features() {
  return (
    <section className="px-6 py-24">
      {/* Header */}
      <div className="max-w-5xl mx-auto text-center space-y-3 mb-12">
        <p className="text-eyebrow" style={{ color: "var(--color-text-muted)" }}>
          FEATURES
        </p>
        <h2 className="text-h1 text-heading">
          Auth that just works.
        </h2>
        <p
          className="text-body-lg max-w-xl mx-auto"
          style={{ color: "var(--color-text-body)" }}
        >
          OAuth 2.0, OIDC, and SSO — fully standards-compliant out of the box,
          with nothing to configure and no vendor lock-in.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Top row: big left card + right stacked cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">

          {/* Big dark card */}
          <div
            className="card-green relative overflow-hidden flex flex-col gap-5"
            style={{ minHeight: "460px" }}
          >
            {/* Decorative concentric circles at top-right corner */}
            {[80, 140, 200, 260, 320].map((r, i) => (
              <div
                key={i}
                className="absolute pointer-events-none rounded-full"
                style={{
                  width: r * 2,
                  height: r * 2,
                  top: -r,
                  right: -r,
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              />
            ))}

            <div className="relative z-10 flex flex-col gap-5 flex-1">
              {/* Badge */}
              <span
                className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full text-badge"
                style={{
                  border: "0.5px solid rgba(255,255,255,0.15)",
                  color: "var(--color-text-on-brand-muted)",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: "var(--color-lime)" }}
                />
                OAUTH 2.0
              </span>


              {/* Big heading */}
              <div className="text-h1">
                <p style={{ color: "var(--color-text-on-brand)" }}>Log in.</p>
                <p style={{ color: "var(--color-lime)" }}>We handle it.</p>
              </div>

              {/* Description */}
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--color-text-on-brand-muted)" }}
              >
                A hardened auth flow runs on every sign-in — PKCE, token
                exchange, and session management — without a single line of auth
                code from you.
              </p>

              {/* Divider */}
              <div style={{ borderTop: "0.5px solid rgba(255,255,255,0.08)" }} />

              {/* What user sees */}
              <div className="space-y-2">
                <p
                  className="text-eyebrow"
                  style={{ color: "rgba(122,154,120,0.7)" }}
                >
                  WHAT YOUR USER SEES
                </p>
                <div
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "0.5px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <img src="/logo_white.svg" className="w-4 h-4 dark:hidden" alt="" />
                  <img src="/logo.svg" className="w-4 h-4 hidden dark:block" alt="" />
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--color-text-on-brand)" }}
                  >
                    Sign in with Aurik
                  </span>
                </div>
              </div>

              {/* Arrow */}
              <div>
                <div
                  className="w-8 h-8 rounded-full inline-flex items-center justify-center"
                  style={{ border: "0.5px solid rgba(255,255,255,0.2)" }}
                >
                  <ArrowRight
                    className="w-4 h-4"
                    style={{ color: "var(--color-text-on-brand)" }}
                  />
                </div>
              </div>

              {/* What Aurik handles */}
              <div className="space-y-2 mt-auto">
                <p
                  className="text-eyebrow"
                  style={{ color: "rgba(122,154,120,0.7)" }}
                >
                  WHAT AURIK HANDLES
                </p>
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--color-lime)" }}
                >
                  PKCE · token exchange · redirect validation · session
                  management · user profile
                </p>
              </div>
            </div>
          </div>

          {/* Right column: 2 stacked cards */}
          <div className="flex flex-col gap-4">

            {/* PKCE card */}
            <div className="card flex-1">
              <p
                className="text-eyebrow mb-3"
                style={{ color: "var(--color-text-muted)" }}
              >
                01 · PKCE
              </p>
              <h3 className="text-h3 text-heading mb-2">
                Zero secrets in the browser.
              </h3>
              <p
                className="text-sm mb-4"
                style={{ color: "var(--color-text-body)" }}
              >
                Proof Key for Code Exchange is enforced on every public client —
                auth code interception is impossible.
              </p>
              <div className="flex flex-wrap gap-2">
                {["PKCE", "S256", "code_challenge", "code_verifier", "state", "nonce"].map(
                  (tag) => (
                    <span key={tag} className="badge badge-active">
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* ID Token card */}
            <div className="card flex-1">
              <p
                className="text-eyebrow mb-3"
                style={{ color: "var(--color-text-muted)" }}
              >
                02 · ID TOKEN
              </p>
              <h3 className="text-h3 text-heading mb-4">
                User data, always current.
              </h3>
              <div className="space-y-2">
                <div
                  className="px-3 py-2 rounded-lg text-xs font-mono truncate"
                  style={{
                    background: "var(--color-page-bg)",
                    border: "0.5px solid var(--color-border)",
                    color: "var(--color-text-muted)",
                  }}
                >
                  eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
                </div>
                <div
                  className="flex items-center gap-2 text-xs"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  <div
                    className="flex-1 h-px"
                    style={{ background: "var(--color-border)" }}
                  />
                  <span>decoded</span>
                  <div
                    className="flex-1 h-px"
                    style={{ background: "var(--color-border)" }}
                  />
                </div>
                <div
                  className="px-3 py-2 rounded-lg text-xs font-mono"
                  style={{
                    background: "var(--color-page-bg)",
                    border: "0.5px solid var(--color-border)",
                  }}
                >
                  <span style={{ color: "var(--color-lime-dark)" }}>sub</span>
                  <span style={{ color: "var(--color-text-body)" }}>
                    {': "usr_8f3k2j9x", '}
                  </span>
                  <span style={{ color: "var(--color-lime-dark)" }}>email</span>
                  <span style={{ color: "var(--color-text-body)" }}>
                    {': "alex@acme.com"'}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom row: 3 equal cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* SSO */}
          <div className="card space-y-3">
            <p
              className="text-eyebrow"
              style={{ color: "var(--color-text-muted)" }}
            >
              03 · SSO
            </p>
            <h3 className="text-h3 text-heading">One login. All your apps.</h3>
            <p className="text-sm" style={{ color: "var(--color-text-body)" }}>
              Authenticate once and sessions propagate to every connected
              application automatically.
            </p>
            <div className="flex items-center gap-2 pt-1">
              {["App A", "App B", "App C"].map((app, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="badge badge-active">{app}</span>
                  {i < 2 && (
                    <div
                      className="w-3 h-px shrink-0"
                      style={{ background: "var(--color-border)" }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Security */}
          <div className="card space-y-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "var(--color-secondary)" }}
            >
              <Lock
                className="w-5 h-5"
                style={{ color: "var(--color-lime-dark)" }}
              />
            </div>
            <h3 className="text-h3 text-heading">Stays secure.</h3>
            <p className="text-sm" style={{ color: "var(--color-text-body)" }}>
              Tokens are signed with RS256, rotated each session, and never
              stored in plaintext. Secrets never leave the server.
            </p>
          </div>

          {/* Scope control */}
          <div className="card space-y-3">
            <div className="flex items-center justify-between">
              <p
                className="text-eyebrow"
                style={{ color: "var(--color-text-muted)" }}
              >
                ALWAYS IN CONTROL
              </p>
              {/* Toggle (visual) */}
              <div
                className="w-10 h-6 rounded-full flex items-center px-0.5 justify-end shrink-0"
                style={{ background: "var(--color-lime)" }}
              >
                <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
              </div>
            </div>
            <h3 className="text-h3 text-heading">Grant only what you need.</h3>
            <p className="text-sm" style={{ color: "var(--color-text-body)" }}>
              Define exact scopes per app. Revoke any token or session from the
              dashboard in one click.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
