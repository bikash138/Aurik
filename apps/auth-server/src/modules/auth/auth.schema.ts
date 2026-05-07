import { z } from "zod";

const TRUSTED_DOMAINS = [
  "gmail.com",
  "outlook.com",
  "yahoo.com",
  "icloud.com",
  "hotmail.com",
];

const TrustedEmailSchema = z
  .email("Invalid email address")
  .max(322, "Email is too long")
  .toLowerCase()
  .trim()
  .refine(
    (email) => {
      const domain = email.split("@")[1];
      return TRUSTED_DOMAINS.includes(domain || "");
    },
    {
      message:
        "Only trusted email providers (Gmail, Outlook, Yahoo, iCloud) are allowed",
    },
  );

const PasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .max(72, "Password is too long for security hashing")
  .trim();

const HexTokenSchema = z
  .string()
  .length(64, "Invalid token format")
  .regex(/^[0-9a-fA-F]+$/, "Token must be a valid hexadecimal string")
  .trim();

const NameSchema = (field: string) =>
  z
    .string()
    .min(2, `${field} is too short`)
    .max(50, `${field} is too long`)
    .regex(
      /^[a-zA-Z\s-]+$/,
      `${field} can only contain letters, spaces, and hyphens`,
    )
    .trim();

export const SignupBodySchema = z
  .object({
    email: TrustedEmailSchema,
    password: PasswordSchema,
    firstName: NameSchema("First Name"),
    lastName: NameSchema("Last Name"),
  })
  .strict();

export const SigninBodySchema = z
  .object({
    email: TrustedEmailSchema,
    password: z.string().max(72).trim(),
    login_challenge: z.string().max(255).trim().optional(),
  })
  .strict();

export const VerifyEmailBodySchema = z
  .object({
    token: HexTokenSchema,
  })
  .strict();

export const ForgotPasswordBodySchema = z
  .object({
    email: TrustedEmailSchema,
  })
  .strict();

export const ResetPasswordBodySchema = z
  .object({
    token: HexTokenSchema,
    newPassword: PasswordSchema,
  })
  .strict();

export type SignupRequest = z.infer<typeof SignupBodySchema>;
export type SigninRequest = z.infer<typeof SigninBodySchema>;
export type VerifyEmailRequest = z.infer<typeof VerifyEmailBodySchema>;
export type ForgotPasswordRequest = z.infer<typeof ForgotPasswordBodySchema>;
export type ResetPasswordRequest = z.infer<typeof ResetPasswordBodySchema>;
