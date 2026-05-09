"use client";

import { Button } from "@/components/ui/button";
import {
  Plus,
  Trash2,
  Settings,
  Mail,
  ArrowRight,
  Loader2,
  File,
} from "lucide-react";

export default function TestPage() {
  return (
    <div className="min-h-screen bg-background p-12 space-y-16 max-w-5xl mx-auto">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Button Component Showcase
        </h1>
        <p className="text-muted-foreground text-lg">
          A preview of all variants and sizes available in our design system.
        </p>
      </header>

      {/* VARIANTS */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold border-b pb-2">Variants</h2>
        <div className="flex flex-wrap gap-4">
          <div className="space-y-2">
            <p className="text-xs font-mono text-muted-foreground uppercase">
              Default (Brand)
            </p>
            <Button>Default Button</Button>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-mono text-muted-foreground uppercase">
              Secondary
            </p>
            <Button variant="secondary">Secondary</Button>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-mono text-muted-foreground uppercase">
              Outline
            </p>
            <Button variant="outline">Outline</Button>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-mono text-muted-foreground uppercase">
              Ghost
            </p>
            <Button variant="ghost">Ghost Button</Button>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-mono text-muted-foreground uppercase">
              Destructive
            </p>
            <Button variant="destructive">Destructive</Button>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-mono text-muted-foreground uppercase">
              Link
            </p>
            <Button variant="link">Link Button</Button>
          </div>
        </div>
      </section>

      {/* SIZES */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold border-b pb-2">Sizes</h2>
        <div className="flex flex-wrap items-end gap-6">
          <div className="space-y-2">
            <p className="text-xs font-mono text-muted-foreground uppercase">
              Extra Small (xs)
            </p>
            <Button size="xs">XS Button</Button>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-mono text-muted-foreground uppercase">
              Small (sm)
            </p>
            <Button size="sm">Small Button</Button>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-mono text-muted-foreground uppercase">
              Default
            </p>
            <Button size="default">Default Size</Button>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-mono text-muted-foreground uppercase">
              Large (lg)
            </p>
            <Button size="lg">Large Button</Button>
          </div>
        </div>
      </section>

      {/* ICON BUTTONS */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold border-b pb-2">Icon Buttons</h2>
        <div className="flex flex-wrap items-end gap-6">
          <div className="space-y-2">
            <p className="text-xs font-mono text-muted-foreground uppercase">
              Icon XS
            </p>
            <Button size="icon-xs" variant="outline">
              <Settings />
            </Button>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-mono text-muted-foreground uppercase">
              Icon SM
            </p>
            <Button size="icon-sm" variant="outline">
              <Plus />
            </Button>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-mono text-muted-foreground uppercase">
              Icon Default
            </p>
            <Button size="icon" variant="outline">
              <File />
            </Button>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-mono text-muted-foreground uppercase">
              Icon LG
            </p>
            <Button size="icon-lg" variant="outline">
              <Mail />
            </Button>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-mono text-muted-foreground uppercase">
              Destructive Icon
            </p>
            <Button size="icon" variant="destructive">
              <Trash2 />
            </Button>
          </div>
        </div>
      </section>

      {/* STATES & COMBINATIONS */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold border-b pb-2">
          States & Combinations
        </h2>
        <div className="flex flex-wrap gap-6">
          <div className="space-y-2">
            <p className="text-xs font-mono text-muted-foreground uppercase">
              Loading
            </p>
            <Button loading>Please wait</Button>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-mono text-muted-foreground uppercase">
              Disabled
            </p>
            <Button disabled>Disabled</Button>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-mono text-muted-foreground uppercase">
              With Icon
            </p>
            <Button>
              Continue <ArrowRight className="ml-2" />
            </Button>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-mono text-muted-foreground uppercase">
              Secondary Icon
            </p>
            <Button variant="secondary">
              <Mail className="mr-2" /> Message
            </Button>
          </div>
        </div>
      </section>

      <footer className="pt-12 text-center text-sm text-muted-foreground border-t">
        Aurik Identity Platform · Design System Testing
      </footer>
    </div>
  );
}
