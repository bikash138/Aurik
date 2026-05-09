"use client";

import { FeatureHeader } from "./feature-header";
import { MainFeatureCard } from "./cards/main-feature-card";
import { PKCECard } from "./cards/pkce-card";
import { TokenPreviewCard } from "./cards/token-preview-card";
import { SSOCard } from "./cards/sso-card";
import { DashboardCard } from "./cards/dashboard-card";
import { ScopeCard } from "./cards/scope-card";

export function Features() {
  return (
    <section id="features" className="px-6 py-24">
      <FeatureHeader />

      {/* Bento Grid */}
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Top row: big left card + right stacked cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
          <MainFeatureCard />

          <div className="flex flex-col gap-4">
            <PKCECard />
            <TokenPreviewCard />
          </div>
        </div>

        {/* Bottom row: 3 equal cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SSOCard />
          <DashboardCard />
          <ScopeCard />
        </div>
      </div>
    </section>
  );
}
