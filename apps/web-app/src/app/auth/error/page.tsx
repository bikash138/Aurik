import { ShieldAlert, TriangleAlert, ArrowLeft, Code2 } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/logo";

interface ErrorPageProps {
  searchParams: Promise<{
    code?: string;
    title?: string;
    message?: string;
    detail?: string;
    redirect_uri?: string;
  }>;
}

export default async function AuthErrorPage({ searchParams }: ErrorPageProps) {
  const params = await searchParams;

  const code = params.code ?? "server_error";
  const title = params.title ?? "Something went wrong";
  const message =
    params.message ??
    "An unexpected error occurred during sign-in. Please try again.";
  const detail = params.detail;
  const redirectUri = params.redirect_uri;

  const isSecurityError =
    code === "redirect_uri_mismatch" ||
    code === "invalid_client" ||
    code === "server_error";

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "var(--color-page-bg)" }}
    >
      <div className="w-full max-w-md">
        <div
          className="card flex flex-col gap-5"
          style={{
            borderColor: isSecurityError
              ? "var(--color-alert-error-border)"
              : "var(--color-border)",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Logo width={24} height={24} className="w-6 h-6" />
              <span className="text-md font-semibold tracking-widest text-muted-foreground">
                AURIK
              </span>
            </div>
            <span
              className="badge"
              style={{
                backgroundColor: isSecurityError
                  ? "var(--color-badge-revoked-bg)"
                  : "var(--color-badge-warn-bg)",
                color: isSecurityError
                  ? "var(--color-badge-revoked-text)"
                  : "var(--color-badge-warn-text)",
              }}
            >
              {code}
            </span>
          </div>

          <div className="divider" />

          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl"
            style={{
              backgroundColor: isSecurityError
                ? "var(--color-alert-error-bg)"
                : "var(--color-alert-warn-bg)",
            }}
          >
            {isSecurityError ? (
              <ShieldAlert
                className="h-6 w-6"
                style={{ color: "var(--color-alert-error-text)" }}
              />
            ) : (
              <TriangleAlert
                className="h-6 w-6"
                style={{ color: "var(--color-alert-warn-text)" }}
              />
            )}
          </div>

          {/* Title & Message */}
          <div className="flex flex-col gap-2">
            <h1
              className="text-h3"
              style={{ color: "var(--color-text-heading)" }}
            >
              {title}
            </h1>
            <p
              className="text-body"
              style={{ color: "var(--color-text-body)" }}
            >
              {message}
            </p>
          </div>

          {detail && (
            <div
              className="flex flex-col gap-2 rounded-lg p-4"
              style={{
                backgroundColor: "var(--color-page-bg-deep)",
                border: "0.5px solid var(--color-border)",
              }}
            >
              <div className="flex items-center gap-2">
                <Code2
                  className="h-4 w-4"
                  style={{ color: "var(--color-lime-dark)" }}
                />
                <span
                  className="text-eyebrow"
                  style={{ color: "var(--color-text-body)" }}
                >
                  Dev Detail
                </span>
              </div>
              <p
                className="text-mono"
                style={{
                  color: "var(--color-mono-text)",
                  wordBreak: "break-all",
                }}
              >
                {detail}
              </p>
            </div>
          )}

          <div className="divider" />

          <div className="flex flex-col gap-3">
            <Link
              href={
                isSecurityError
                  ? "/"
                  : redirectUri || "javascript:history.back()"
              }
              className="btn-ghost flex items-center justify-center gap-2 w-full no-underline"
            >
              <ArrowLeft className="h-4 w-4" />
              {isSecurityError
                ? "Return Home"
                : redirectUri
                  ? "Return to App"
                  : "Go Back"}
            </Link>
            <p
              className="text-center text-sm"
              style={{ color: "var(--color-text-muted)" }}
            >
              If this keeps happening, contact the app owner or{" "}
              <a
                href="mailto:support@aurik.cloud"
                style={{ color: "var(--color-lime-dark)" }}
              >
                Aurik Support
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
