"use client";

import { Navbar } from "@/components/home/Navbar";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background">
      {/* NAVBAR */}
      <Navbar />

      {/* HERO SECTION (To showcase the navbar) */}
      <main className="relative pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-mono border">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500"></span>
            </span>
            V1.0 IS NOW LIVE
          </div>
          
          <h1 className="text-hero text-heading max-w-4xl mx-auto leading-[1.1]">
            Own the identity layer for <em className="text-italic-accent">your apps.</em>
          </h1>
          
          <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
            The simple identity platform for modern developers. Add secure sign-in, 
            OAuth 2.0, and user management to any application with ease.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button className="btn-primary px-8 py-4 text-base rounded-2xl shadow-xl shadow-primary/10">
              Get Started for Free
            </button>
            <button className="btn-ghost px-8 py-4 text-base rounded-2xl">
              View Documentation
            </button>
          </div>

          {/* BACKGROUND DECORATION */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] -z-10 opacity-30 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 blur-[120px] rounded-full" />
          </div>
        </div>

        {/* FEATURE GRID PREVIEW */}
        <div className="max-w-6xl mx-auto mt-32 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-8 space-y-4">
            <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center text-primary font-bold">1</div>
            <h3 className="text-h3">Secure by Design</h3>
            <p className="text-sm text-muted-foreground">PKCE, OIDC, and OAuth 2.0 compliant out of the box. Your users' data is in safe hands.</p>
          </div>
          <div className="card p-8 space-y-4">
            <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center text-primary font-bold">2</div>
            <h3 className="text-h3">Developer First</h3>
            <p className="text-sm text-muted-foreground">Clean APIs, comprehensive docs, and a dashboard that doesn't get in your way.</p>
          </div>
          <div className="card p-8 space-y-4">
            <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center text-primary font-bold">3</div>
            <h3 className="text-h3">Scalable Infrastructure</h3>
            <p className="text-sm text-muted-foreground">Built to handle millions of requests. Scale from side projects to enterprise apps.</p>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="py-20 border-t bg-card-subtle">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 no-underline">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground font-bold text-[8px]">A</div>
            <span className="font-display text-lg tracking-tight text-foreground">Aurik</span>
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground font-medium">
            <a href="#" className="hover:text-foreground no-underline transition-colors">Twitter</a>
            <a href="#" className="hover:text-foreground no-underline transition-colors">GitHub</a>
            <a href="#" className="hover:text-foreground no-underline transition-colors">Discord</a>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 Aurik Identity. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
