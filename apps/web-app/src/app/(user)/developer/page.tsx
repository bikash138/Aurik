"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Rocket, ArrowRight, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

const DeveloperDashboardPage = () => {
  return (
    <div className="p-8 max-w-5xl mx-auto w-full pb-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary/10 via-background to-background border border-primary/10 p-12 mb-12">
        <Image
          src="/logo_transparent_revert.svg"
          alt=""
          aria-hidden="true"
          width={400}
          height={400}
          className="absolute -right-32 top-1/2 -translate-y-1/2 w-[400px] opacity-[0.03] pointer-events-none select-none"
        />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6">
            <Rocket className="h-3.5 w-3.5" />
            <span>Developer Portal in progress</span>
          </div>

          <h1 className="text-4xl font-bold text-heading mb-4 tracking-tight">
            The future of your{" "}
            <span className="text-primary">Identity Platform</span> is almost
            here.
          </h1>
          <p className="text-lg text-muted mb-8 leading-relaxed">
            We&apos;re building a world-class developer experience. Soon,
            you&apos;ll be able to monitor real-time usage, manage team
            permissions, and view detailed security logs all in one place.
          </p>

          <div className="space-y-4">
            <p className="text-sm font-medium text-muted-foreground italic">
              Until then create app and integrate our service to your
              application
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/developer/apps">
                <Button className="h-11 px-6 gap-2">
                  Manage Applications
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-muted">
          Need help with your integration?{" "}
          <Link href="#" className="text-primary hover:underline">
            Check our documentation
          </Link>
        </p>
      </div>
    </div>
  );
};

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group p-6 rounded-2xl border border-border bg-card/50 hover:bg-card hover:border-primary/20 transition-all duration-300">
      <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-heading mb-2">{title}</h3>
      <p className="text-sm text-muted leading-relaxed">{description}</p>
      <div className="mt-4 inline-flex items-center text-[10px] uppercase tracking-wider font-bold text-primary/50">
        Coming Soon
      </div>
    </div>
  );
}

export default DeveloperDashboardPage;
