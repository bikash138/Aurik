"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  Plug,
  LogIn,
  Copy,
  Check,
  Eye,
  EyeOff,
  Terminal,
  Globe,
  Pause,
  Play,
  KeyIcon,
} from "lucide-react";

const STEP_DURATION = 5000;
const STEP_DURATIONS = [5000, 5000, 5000, 6800];

// ── Typewriter hook ──────────────────────────────────────────
function useTypewriter(text: string, speed = 40, delay = 0, active = true) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    if (!active) {
      setDisplayed("");
      return;
    }
    let i = 0;
    setDisplayed("");
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, ++i));
        } else {
          clearInterval(iv);
        }
      }, speed);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(t);
  }, [active]);
  return displayed;
}

// ── Step 1: Register ─────────────────────────────────────────
function RegisterStep({ active }: { active: boolean }) {
  const appName = useTypewriter("My Awesome App", 90, 400, active);
  const redirectUri = useTypewriter(
    "https://myapp.com/callback",
    60,
    1800,
    active,
  );
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (!active) {
      setClicked(false);
      return;
    }
    const t = setTimeout(() => setClicked(true), 4000);
    return () => clearTimeout(t);
  }, [active]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-secondary/50 text-xs font-mono text-muted-foreground">
        <Globe className="w-3 h-3 shrink-0" />
        aurik.bikashshaw.in/developer/apps
      </div>
      <div
        className="space-y-3 p-4 rounded-xl border bg-card"
        style={{ borderColor: "var(--color-border)" }}
      >
        <p className="text-sm font-semibold text-heading">Create Application</p>

        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">
            Application Name
          </label>
          <div
            className="flex items-center px-3 py-2 rounded-lg border bg-background text-sm font-mono min-h-[36px]"
            style={{ borderColor: "var(--color-border)" }}
          >
            {appName}
            {appName.length > 0 && appName.length < "My Awesome App".length && (
              <span className="ml-0.5 inline-block w-0.5 h-4 bg-primary animate-pulse" />
            )}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Redirect URI</label>
          <div
            className="flex items-center px-3 py-2 rounded-lg border bg-background text-sm font-mono min-h-[36px]"
            style={{ borderColor: "var(--color-border)" }}
          >
            {redirectUri}
            {redirectUri.length > 0 &&
              redirectUri.length < "https://myapp.com/callback".length && (
                <span className="ml-0.5 inline-block w-0.5 h-4 bg-primary animate-pulse" />
              )}
          </div>
        </div>

        <motion.div
          className="w-full py-2 rounded-lg text-sm font-medium text-center cursor-pointer select-none"
          animate={
            clicked
              ? {
                  backgroundColor: "var(--color-primary)",
                  color: "var(--color-primary-foreground)",
                  scale: [1, 0.97, 1],
                }
              : {
                  backgroundColor: "var(--color-secondary)",
                  color: "var(--color-foreground)",
                  scale: 1,
                }
          }
          transition={{ duration: 0.3 }}
        >
          {clicked ? "✓  Application Created!" : "Create Application"}
        </motion.div>
      </div>
    </div>
  );
}

// ── Step 2: Credentials ──────────────────────────────────────
function CredentialsStep({ active }: { active: boolean }) {
  const [showSecret, setShowSecret] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const clientId = "aurik_cid_8f3k2j9xp4q";
  const clientSecret = "sk_live_9Xk2mN8pL3qR7wT";

  useEffect(() => {
    if (!active) {
      setShowSecret(false);
      setCopiedId(false);
      setCopiedSecret(false);
      return;
    }
    const t1 = setTimeout(() => setCopiedId(true), 1500);
    const t2 = setTimeout(() => setShowSecret(true), 2800);
    const t3 = setTimeout(() => setCopiedSecret(true), 4000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [active]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-secondary/50 text-xs font-mono text-muted-foreground">
        <Globe className="w-3 h-3 shrink-0" />
        aurik.bikashshaw.in/developer/apps/my-awesome-app
      </div>
      <div
        className="space-y-3 p-4 rounded-xl border bg-card"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-heading">My Awesome App</p>
          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
            Active
          </span>
        </div>

        {/* Client ID */}
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Client ID</label>
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-background"
            style={{ borderColor: "var(--color-border)" }}
          >
            <span className="text-xs font-mono text-foreground flex-1 truncate">
              {clientId}
            </span>
            <motion.span
              animate={copiedId ? { color: "var(--color-primary)" } : {}}
            >
              {copiedId ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </motion.span>
          </div>
        </div>

        {/* Client Secret */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs text-muted-foreground">
              Client Secret
            </label>
          </div>
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-background"
            style={{ borderColor: "var(--color-border)" }}
          >
            <span className="text-xs font-mono text-foreground flex-1">
              {showSecret ? clientSecret : "••••••••••••••••"}
            </span>
            <div className="flex items-center gap-1.5">
              {showSecret ? (
                <Eye className="w-3.5 h-3.5 text-muted-foreground" />
              ) : (
                <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />
              )}
              <motion.span
                animate={copiedSecret ? { color: "var(--color-primary)" } : {}}
              >
                {copiedSecret ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                )}
              </motion.span>
            </div>
          </div>
        </div>

        <div className="h-5 flex items-center">
          <motion.p
            animate={{ opacity: copiedId ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-xs text-primary font-medium flex items-center gap-1.5"
          >
            <Check className="w-3 h-3" /> Credentials copied to clipboard
          </motion.p>
        </div>
      </div>
    </div>
  );
}

// ── Step 3: OIDC Config ──────────────────────────────────────
function OIDCStep({ active }: { active: boolean }) {
  const [visibleLines, setVisibleLines] = useState(0);

  const lines: { text: string; color: string; highlight?: boolean }[] = [
    { text: "// oidc.config.js", color: "text-[#7A9A78] dark:text-[#526050]" },
    {
      text: "import { OidcClient } from 'oidc-client-ts';",
      color: "text-blue-600 dark:text-blue-400",
    },
    { text: " ", color: "" },
    {
      text: "export const oidcConfig = {",
      color: "text-[#1C2D1A] dark:text-[#DDE5D8]",
    },
    {
      text: "  issuer: 'https://aurik.bikashshaw.in',",
      color: "text-[#1C2D1A] dark:text-[#DDE5D8]",
    },
    {
      text: "  client_id: 'aurik_cid_8f3k2j9xp4q',",
      color: "text-green-700 dark:text-green-400",
      highlight: true,
    },
    {
      text: "  client_secret: 'sk_live_9Xk2mN8...',",
      color: "text-amber-700 dark:text-amber-400",
      highlight: true,
    },
    {
      text: "  redirect_uri: window.location.origin,",
      color: "text-[#1C2D1A] dark:text-[#DDE5D8]",
    },
    {
      text: "  scope: 'openid profile email',",
      color: "text-[#1C2D1A] dark:text-[#DDE5D8]",
    },
    { text: "};", color: "text-[#1C2D1A] dark:text-[#DDE5D8]" },
  ];

  useEffect(() => {
    if (!active) {
      setVisibleLines(0);
      return;
    }
    let count = 0;
    const iv = setInterval(() => {
      count++;
      setVisibleLines(count);
      if (count >= lines.length) clearInterval(iv);
    }, 350);
    return () => clearInterval(iv);
  }, [active]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-secondary/50 text-xs font-mono text-muted-foreground">
        <Terminal className="w-3 h-3 shrink-0" />
        oidc.config.js
      </div>
      <div
        className="p-4 rounded-xl border bg-white dark:bg-[#0f1109]"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="space-y-0.5 font-mono text-xs leading-5">
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={
                i < visibleLines ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }
              }
              transition={{ duration: 0.18 }}
              className={`${line.color} ${line.highlight ? "bg-primary/10 -mx-4 px-4 rounded" : ""}`}
            >
              {line.text || " "}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Step 4: Sign in ──────────────────────────────────────────
function SignInStep({ active }: { active: boolean }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (!active) {
      setStage(0);
      return;
    }
    const t1 = setTimeout(() => setStage(1), 800);
    const t2 = setTimeout(() => setStage(2), 2200);
    const t3 = setTimeout(() => setStage(3), 3800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [active]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-secondary/50 text-xs font-mono text-muted-foreground">
        <Globe className="w-3 h-3 shrink-0" />
        myapp.com/signin
      </div>
      <div
        className="p-4 rounded-xl border bg-card space-y-3"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div
          className="flex items-center justify-between pb-2 border-b"
          style={{ borderColor: "var(--color-border)" }}
        >
          <span className="text-sm font-semibold text-heading">
            My Awesome App
          </span>
          <span className="text-xs text-muted-foreground">Sign in</span>
        </div>

        <p className="text-sm font-medium text-heading text-center">
          Welcome back
        </p>

        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm text-muted-foreground"
          style={{ borderColor: "var(--color-border)" }}
        >
          ✉ &nbsp;Continue with email
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex-1 h-px bg-border" />
          or
          <div className="flex-1 h-px bg-border" />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: stage >= 1 ? 1 : 0,
            boxShadow:
              stage >= 2
                ? "0 0 24px rgba(184,240,74,0.4)"
                : "0 0 0px transparent",
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold cursor-pointer select-none"
        >
          <img src="/logo_white.svg" className="w-4 h-4 dark:hidden" alt="" />
          <img src="/logo.svg" className="w-4 h-4 hidden dark:block" alt="" />
          Sign in with Aurik
        </motion.div>

        <div className="h-4 flex items-center justify-center">
          <motion.p
            animate={{ opacity: stage >= 3 ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            className="text-xs text-center text-primary font-mono"
          >
            ↗ Redirecting to Aurik secure auth...
          </motion.p>
        </div>
      </div>
    </div>
  );
}

function LogoIcon({ className }: { className?: string }) {
  return (
    <>
      <img src="/logo.svg" className={`${className} dark:hidden`} alt="" />
      <img
        src="/logo_white.svg"
        className={`${className} hidden dark:block`}
        alt=""
      />
    </>
  );
}

const steps = [
  {
    number: "01",
    icon: LayoutDashboard,
    short: "Register",
    title: "Register your app",
    Panel: RegisterStep,
    description:
      "Head to the Aurik dashboard and register a new application. Enter your app name and the redirect URI where users will land after authentication.",
  },
  {
    number: "02",
    icon: KeyIcon,
    short: "Credentials",
    title: "Grab your credentials",
    Panel: CredentialsStep,
    description:
      "Once your app is created, Aurik generates a unique Client ID and Client Secret. Copy these securely — your Client Secret is only shown once.",
  },
  {
    number: "03",
    icon: Plug,
    short: "Connect",
    title: "Connect OIDC client",
    Panel: OIDCStep,
    description:
      "Paste your credentials into your OIDC client configuration. Aurik is fully compliant with oidc-client-ts, next-auth, passport.js and more.",
  },
  {
    number: "04",
    icon: LogIn,
    short: "Sign in",
    title: "Add Sign in with Aurik",
    Panel: SignInStep,
    description:
      "Drop the Sign in with Aurik button into your login page. Users are redirected to Aurik's secure auth flow and back — fully authenticated.",
  },
];

// ── Main component ───────────────────────────────────────────
export function Usage() {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pausedRef = useRef(false);
  const remainingRef = useRef(STEP_DURATION);
  const startTimeRef = useRef(Date.now());

  const stopTimer = () => {
    if (intervalRef.current) clearTimeout(intervalRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
  };

  const startTimer = (step: number, duration?: number) => {
    const stepDuration = duration ?? STEP_DURATIONS[step];
    stopTimer();
    remainingRef.current = stepDuration;
    startTimeRef.current = Date.now();

    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      setProgress(Math.min((elapsed / stepDuration) * 100, 100));
    }, 30);

    intervalRef.current = setTimeout(() => {
      const next = (step + 1) % steps.length;
      setCurrent(next);
      startTimer(next);
    }, stepDuration);
  };

  const handlePause = () => {
    if (pausedRef.current) {
      // Resume — continue with remaining time
      pausedRef.current = false;
      setPaused(false);
      startTimer(current, remainingRef.current);
    } else {
      // Pause — store remaining time
      const elapsed = Date.now() - startTimeRef.current;
      remainingRef.current = Math.max(remainingRef.current - elapsed, 0);
      pausedRef.current = true;
      setPaused(true);
      stopTimer();
    }
  };

  useEffect(() => {
    startTimer(0);
    return () => stopTimer();
  }, []);

  const handleStepClick = (index: number) => {
    pausedRef.current = false;
    setPaused(false);
    setCurrent(index);
    startTimer(index);
  };

  const { Panel, description, title, icon: Icon, number } = steps[current];

  return (
    <section className="px-6 py-24">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <motion.div
          className="text-center space-y-3 mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-mono tracking-widest text-(--color-text-muted) uppercase">
            How to use
          </p>
          <h2 className="text-h1 text-heading font-bold">
            From zero to Sign in with Aurik
          </h2>
          <p
            className="text-body-lg max-w-xl mx-auto"
            style={{ color: "var(--color-text-body)" }}
          >
            Four steps. Under ten minutes. No auth expertise required.
          </p>
        </motion.div>

        {/* DEMO CARD */}
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ borderColor: "var(--color-border)" }}
        >
          {/* TABS */}
          <div
            className="grid grid-cols-4 border-b"
            style={{ borderColor: "var(--color-border)" }}
          >
            {steps.map(({ icon: StepIcon, short, number: num }, i) => (
              <button
                key={i}
                onClick={() => handleStepClick(i)}
                className={`relative flex flex-col items-center gap-1.5 py-4 px-2 text-xs font-medium transition-colors cursor-pointer
                  ${i === current ? "text-primary bg-secondary/30" : "text-muted-foreground hover:text-foreground hover:bg-secondary/20"}
                  ${i < steps.length - 1 ? "border-r" : ""}`}
                style={{ borderColor: "var(--color-border)" }}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${i === current ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
                >
                  <StepIcon className="w-3.5 h-3.5" />
                </div>
                <span className="hidden sm:block text-center leading-tight">
                  {short}
                </span>
                <span className="text-[10px] text-(--color-text-muted)">
                  {num}
                </span>

                {/* Progress bar */}
                {i === current && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary/50">
                    <motion.div
                      className="h-full bg-primary"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
                {i < current && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/30" />
                )}
              </button>
            ))}
          </div>

          {/* CONTENT */}
          <div className="grid md:grid-cols-2">
            {/* LEFT: Text */}
            <div
              className="p-8 border-r flex flex-col justify-center gap-5"
              style={{ borderColor: "var(--color-border)" }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-mono text-(--color-text-muted) mb-1">
                      Step {number}
                    </p>
                    <h3 className="text-h2 font-bold text-heading">{title}</h3>
                  </div>
                  <p className="text-muted-foreground text-base leading-relaxed">
                    {description}
                  </p>

                  {/* Dot nav + play/pause */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={handlePause}
                      className="w-8 h-8 rounded-full flex items-center justify-center bg-secondary hover:bg-secondary/80 transition-colors cursor-pointer shrink-0"
                    >
                      {paused ? (
                        <Play className="w-3.5 h-3.5 text-primary ml-0.5" />
                      ) : (
                        <Pause className="w-3.5 h-3.5 text-primary" />
                      )}
                    </button>
                    <div className="flex items-center gap-2">
                      {steps.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => handleStepClick(i)}
                          className={`rounded-full transition-all cursor-pointer ${i === current ? "w-6 h-2 bg-primary" : "w-2 h-2 bg-border hover:bg-muted-foreground"}`}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* RIGHT: Mockup */}
            <div className="p-8 bg-secondary/10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                >
                  <Panel active={true} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
