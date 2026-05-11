import { Check } from "lucide-react";

const SCOPE_META: Record<string, { label: string; description: string }> = {
  openid: {
    label: "Basic identity",
    description: "Know who you are via a unique identifier",
  },
  profile: {
    label: "Profile information",
    description: "See your name, picture, and other profile details",
  },
  email: {
    label: "Email address",
    description: "See your primary email address",
  },
  address: {
    label: "Address",
    description: "See your physical address",
  },
  phone: {
    label: "Phone number",
    description: "See your phone number",
  },
  offline_access: {
    label: "Stay signed in",
    description: "Keep access even when you're not actively using the app",
  },
};

function scopeLabel(scope: string) {
  return (
    SCOPE_META[scope] ?? { label: scope, description: `Access to ${scope}` }
  );
}

function ScopeIcon() {
  return <Check className="w-4 h-4 text-(--color-lime-dark) mt-0.5 shrink-0" />;
}

interface ScopeListProps {
  scopes: string[];
}

export function ScopeList({ scopes }: ScopeListProps) {
  return (
    <ul className="flex flex-col gap-3">
      {scopes.map((scope) => {
        const meta = scopeLabel(scope);
        return (
          <li key={scope} className="flex items-start gap-3">
            <ScopeIcon />
            <div>
              <p className="font-(family-name:--font-body) text-sm font-medium text-(--color-text-heading) leading-tight">
                {meta.label}
              </p>
              <p className="font-(family-name:--font-body) text-xs text-(--color-text-muted) mt-0.5">
                {meta.description}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
