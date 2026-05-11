import React from "react";
import { useAurik } from "./context.jsx";
import { AurikLogo } from "./logo.jsx";

interface SigninButtonProps {
  theme?: "light" | "dark";
  className?: string;
  style?: React.CSSProperties;
}

export const SigninButton: React.FC<SigninButtonProps> = ({
  theme = "dark",
  className = "",
  style,
}) => {
  const { signin, isLoading } = useAurik();
  const isDark = theme === "dark";

  return (
    <button
      onClick={signin}
      disabled={isLoading}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0.625rem 1.25rem",
        borderRadius: "0.5rem",
        fontWeight: "600",
        fontSize: "0.875rem",
        cursor: isLoading ? "not-allowed" : "pointer",
        transition: "all 0.2s ease",
        border: isDark
          ? "1px solid rgba(255,255,255,0.1)"
          : "1px solid rgba(0,0,0,0.1)",
        backgroundColor: isDark ? "#000000" : "#FFFFFF",
        color: isDark ? "#FFFFFF" : "#000000",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        ...style,
      }}
      className={`aurik-signin-button ${className}`}
    >
      {isLoading ? (
        "Connecting..."
      ) : (
        <>
          <AurikLogo color={isDark ? "#FFFFFF" : "#000000"} className="mr-2" />
          Signin with Aurik
        </>
      )}
    </button>
  );
};
