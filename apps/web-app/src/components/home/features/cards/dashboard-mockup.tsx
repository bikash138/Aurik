"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LayoutDashboard, Plus, Settings, Users, Shield, UserCircle } from "lucide-react";

export function DashboardMockup() {
  const [activeTab, setActiveTab] = useState<"apps" | "settings" | "users">("apps");

  const apps = [
    { name: "Acme Main", status: "Active" },
    { name: "Dev Blog", status: "Active" },
  ];

  const users = [
    { name: "Alex", email: "alex@acme.com" },
    { name: "Jordan", email: "j@aurik.io" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* HEADER: Grouped Eyebrow + Heading on left, Tabs on right */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p
            className="text-eyebrow mb-1"
            style={{ color: "var(--color-text-muted)" }}
          >
            04 · MANAGEMENT
          </p>
          <h3 className="text-h3 text-heading">Developer Dashboard.</h3>
        </div>
        
        <div className="flex items-center gap-1 p-1 rounded-full border border-border/50 bg-secondary/10 shrink-0">
          <button 
            onClick={() => setActiveTab("apps")}
            className={`p-1 rounded-full transition-colors ${activeTab === "apps" ? "bg-white dark:bg-black shadow-sm text-lime-600" : "text-muted-foreground hover:text-heading"}`}
          >
            <LayoutDashboard className="w-3 h-3" />
          </button>
          <button 
            onClick={() => setActiveTab("settings")}
            className={`p-1 rounded-full transition-colors ${activeTab === "settings" ? "bg-white dark:bg-black shadow-sm text-lime-600" : "text-muted-foreground hover:text-heading"}`}
          >
            <Settings className="w-3 h-3" />
          </button>
          <button 
            onClick={() => setActiveTab("users")}
            className={`p-1 rounded-full transition-colors ${activeTab === "users" ? "bg-white dark:bg-black shadow-sm text-lime-600" : "text-muted-foreground hover:text-heading"}`}
          >
            <Users className="w-3 h-3" />
          </button>
        </div>
      </div>

      <p
        className="mb-4"
        style={{
          color: "var(--color-text-body)",
          fontSize: "14px",
          lineHeight: "1.5",
        }}
      >
        Everything you need to manage your identity ecosystem.
      </p>

      {/* INTERACTIVE DASHBOARD MOCKUP */}
      <div 
        className="mt-1 p-2.5 rounded-xl border bg-secondary/10 space-y-2 overflow-hidden flex flex-col h-[140px]"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === "apps" && (
              <motion.div
                key="apps"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-2 h-full flex flex-col"
              >
                <div className="space-y-1">
                  {apps.map((app, i) => (
                    <div key={app.name} className="flex items-center justify-between p-1 rounded-lg bg-background border border-border/50 shadow-sm">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div className="w-1 h-1 rounded-full bg-lime-500 shrink-0" />
                        <span className="text-[9px] font-medium text-heading truncate">{app.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg width="25" height="8" className="opacity-40">
                          <path d={i === 0 ? "M0 8 L5 2 L10 6 L15 3 L25 5" : "M0 4 L8 6 L15 1 L25 3"} fill="none" stroke="var(--color-lime-dark)" strokeWidth="1" />
                        </svg>
                        <span className="text-[7px] px-1 rounded-full bg-lime-500/10 text-lime-600 border border-lime-500/20">{app.status}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* LOGS SECTION */}
                <div className="mt-auto space-y-1 pt-1 border-t border-border/50">
                  <div className="text-[8px] font-bold text-muted-foreground/50 uppercase tracking-tighter">Recent Activity</div>
                  <div className="space-y-0.5">
                    <div className="font-mono text-[7px] text-muted-foreground flex justify-between">
                      <span>12:04 · Token Issued</span>
                      <span className="text-lime-600/50">200 OK</span>
                    </div>
                    <div className="font-mono text-[7px] text-muted-foreground flex justify-between">
                      <span>11:58 · User Auth</span>
                      <span className="text-lime-600/50">200 OK</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-1.5 overflow-y-auto"
              >
                <div className="space-y-1.5">
                  <div className="p-1.5 rounded-lg bg-background border border-border/50 space-y-1">
                    <div className="flex items-center gap-1.5 text-[9px] text-heading font-medium">
                      <Shield className="w-2.5 h-2.5 text-muted-foreground" />
                      <span>Allowed Redirects</span>
                    </div>
                    <div className="font-mono text-[8px] text-lime-600 truncate bg-lime-500/5 px-1 rounded border border-lime-500/10">https://app.acme.com/api/auth/callback</div>
                  </div>

                  {/* Branding Section */}
                  <div className="p-1.5 rounded-lg bg-background border border-border/50 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[9px] text-heading font-medium">
                        <LayoutDashboard className="w-2.5 h-2.5 text-muted-foreground" />
                        <span>Custom Branding</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[8px] px-1 rounded bg-secondary/30 border border-border/20">
                        <span className="text-muted-foreground italic">Domain:</span>
                        <span className="text-heading font-mono">auth.acme.com</span>
                      </div>
                      <div className="flex items-center justify-between text-[8px] px-1 rounded bg-secondary/30 border border-border/20">
                        <span className="text-muted-foreground italic">Assets:</span>
                        <span className="text-heading">Logo, Privacy, Terms</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center pt-1">
                    <span className="text-[9px] text-muted-foreground/60 font-medium">+ 12 more security settings</span>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "users" && (
              <motion.div
                key="users"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-2"
              >
                <div className="grid grid-cols-3 gap-1.5 mb-1">
                  <div className="bg-background border border-border/50 p-1 rounded-lg text-center">
                    <div className="text-[7px] text-muted-foreground uppercase">Total</div>
                    <div className="text-[10px] font-bold text-heading">1.4k</div>
                  </div>
                  <div className="bg-background border border-border/50 p-1 rounded-lg text-center relative overflow-hidden">
                    <div className="text-[7px] text-muted-foreground uppercase">Active</div>
                    <div className="text-[10px] font-bold text-heading flex items-center justify-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-lime-500 animate-pulse" />
                      342
                    </div>
                  </div>
                  <div className="bg-background border border-border/50 p-1 rounded-lg text-center">
                    <div className="text-[7px] text-muted-foreground uppercase">New</div>
                    <div className="text-[10px] font-bold text-lime-600">+12</div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  {users.map((user) => (
                    <div key={user.name} className="flex items-center justify-between p-1.5 rounded-lg bg-background border border-border/50 shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                          <UserCircle className="w-3 h-3 text-muted-foreground" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-medium text-heading leading-tight">{user.name}</span>
                          <span className="text-[8px] text-muted-foreground leading-tight">{user.email}</span>
                        </div>
                      </div>
                      <span className="text-[7px] text-muted-foreground uppercase font-bold">Manage</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
