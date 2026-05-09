import { LayoutDashboard, KeyIcon, Plug, LogIn } from "lucide-react";
import { RegisterStep } from "./panels/register-step";
import { CredentialsStep } from "./panels/credentials-step";
import { OIDCStep } from "./panels/oidc-step";
import { SignInStep } from "./panels/sign-in-step";

export const STEP_DURATIONS = [5000, 5000, 5000, 6800];

export const steps = [
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
