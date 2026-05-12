import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/Logo";

interface ConsentHeaderProps {
  clientName: string;
  logoUrl?: string;
  clientUri?: string;
  tosUri?: string;
  policyUri?: string;
}

export function ConsentHeader({
  clientName,
  logoUrl,
  clientUri,
  tosUri,
  policyUri,
}: ConsentHeaderProps) {
  return (
    <>
      {/* Desktop Left Panel */}
      <div className="hidden sm:flex flex-col justify-between w-72 shrink-0 bg-secondary px-8 pt-8 pb-8 relative overflow-hidden mt-3 mb-3 rounded-r-2xl">
        <div className="relative z-10 flex flex-col gap-6">
          <Link
            href="/"
            className="flex items-center gap-1.5 no-underline hover:no-underline"
          >
            <Logo width={24} height={24} className="w-6 h-6" />
            <span className="font-(family-name:--font-body) text-base font-semibold tracking-tight text-(--color-text-heading)">
              Aurik
            </span>
          </Link>

          <div className="flex flex-col gap-3">
            <div className="w-12 h-12 rounded-2xl bg-(--color-brand) flex items-center justify-center overflow-hidden border border-(--color-border)">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={clientName}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-(family-name:--font-body) text-(--color-text-on-brand) font-semibold text-lg">
                  {clientName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <h1 className="font-(family-name:--font-display) text-h1 text-(--color-text-heading) m-0 leading-tight">
                Authorize
              </h1>
              <p className="font-(family-name:--font-body) text-sm text-(--color-text-body)">
                <span className="font-semibold text-(--color-text-heading)">
                  {clientUri ? (
                    <Link
                      href={clientUri}
                      target="_blank"
                      className="hover:underline"
                    >
                      {clientName}
                    </Link>
                  ) : (
                    clientName
                  )}
                </span>{" "}
                wants access to your account.
              </p>
            </div>
          </div>

          <p className="font-(family-name:--font-body) text-xs text-(--color-text-muted) leading-relaxed">
            Only grant access to apps you trust. You can revoke access any time
            from your account settings.
          </p>
        </div>

        <div className="relative z-10 flex flex-col gap-2">
          {(tosUri || policyUri) && (
            <div className="flex items-center gap-2">
              {tosUri && (
                <Link
                  href={tosUri}
                  target="_blank"
                  className="font-(family-name:--font-body) text-xs text-(--color-text-muted) hover:text-(--color-text-body) transition-colors no-underline hover:no-underline"
                >
                  Terms
                </Link>
              )}
              {tosUri && policyUri && (
                <span className="text-(--color-text-muted) text-xs">·</span>
              )}
              {policyUri && (
                <Link
                  href={policyUri}
                  target="_blank"
                  className="font-(family-name:--font-body) text-xs text-(--color-text-muted) hover:text-(--color-text-body) transition-colors no-underline hover:no-underline"
                >
                  Privacy Policy
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile header */}
      <div className="flex sm:hidden flex-col items-center gap-3 pt-10 pb-4 px-10 text-center">
        <Link
          href="/"
          className="flex items-center gap-1.5 no-underline hover:no-underline"
        >
          <Logo width={24} height={24} className="w-6 h-6" />
          <span className="font-(family-name:--font-body) text-base font-semibold tracking-tight text-(--color-text-heading)">
            Aurik
          </span>
        </Link>
        <div className="w-12 h-12 rounded-2xl bg-(--color-brand) flex items-center justify-center overflow-hidden border border-(--color-border)">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={clientName}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="font-(family-name:--font-body) text-(--color-text-on-brand) font-semibold text-lg">
              {clientName.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <h1 className="font-(family-name:--font-display) text-h1 text-(--color-text-heading) m-0 leading-none">
          Authorize
        </h1>
        <p className="font-(family-name:--font-body) text-sm text-(--color-text-body) dark:text-foreground/60">
          <span className="font-semibold text-(--color-text-heading)">
            {clientUri ? (
              <Link
                href={clientUri}
                target="_blank"
                className="hover:underline"
              >
                {clientName}
              </Link>
            ) : (
              clientName
            )}
          </span>{" "}
          wants access to your account.
        </p>
      </div>
    </>
  );
}
