import Link from "next/link";
import { Check } from "lucide-react";

export function Hero() {
  return (
    <main className="relative pt-30 pb-20 px-6 overflow-hidden">
      {/* GRADIENT GLOW */}
      <div className="pointer-events-none absolute inset-0 flex items-start justify-center z-0">
        <div className="w-[600px] h-[400px] rounded-full bg-lime-300/20 blur-[120px] translate-y-10" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-mono border tracking-widest">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500"></span>
          </span>
          OAUTH 2.0 · OIDC · SSO
        </div>

        <h1 className="text-heading max-w-4xl mx-auto leading-[1.1] text-4xl md:text-5xl lg:text-7xl font-bold">
          Auth without the
          <br />
          <em className="text-italic-accent font-(family-name:--font-fraunces)">
            boilerplate.
          </em>
        </h1>

        <p className="text-body-lg text-foreground/70 max-w-2xl mx-auto text-md md:text-2xl tracking-tight">
          The simple identity platform for modern developers. Add secure
          sign-in, OAuth 2.0, and user management to any application with ease.
          No complex configurations, no vendor lock-in.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/auth/signin"
            className="btn-primary px-8 py-4 text-base rounded-2xl no-underline"
          >
            Get Started for Free
          </Link>
          <Link
            href="/docs"
            className="btn-ghost px-8 py-4 text-base rounded-2xl no-underline"
          >
            View Documentation
          </Link>
        </div>

        {/* TRUST BAR */}
        <div className="flex flex-col items-center gap-4 pt-2">
          <p className="flex items-center gap-3 text-xs font-mono tracking-widest text-(--color-text-muted) uppercase">
            <span className="w-8 h-px bg-(--color-text-muted)/40" />
            New here? Read the docs first
            <span className="w-8 h-px bg-(--color-text-muted)/40" />
          </p>
          <div className="grid grid-cols-2 sm:flex sm:flex-row items-center justify-center gap-x-0 gap-y-3 sm:divide-x sm:divide-(--color-text-muted)/20 text-sm text-(--color-text-muted)">
            {[
              "Free to start",
              "No vendor lock-in",
              "Open standards",
              "OIDC compliant",
            ].map((item) => (
              <span
                key={item}
                className="flex items-center text justify-center gap-2 px-4 sm:px-6"
              >
                <Check className="w-4 h-4 text-(--color-text-muted) shrink-0" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
