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

export const NameSchema = (field: string) =>
  z
    .string()
    .min(2, `${field} is too short`)
    .max(50, `${field} is too long`)
    .regex(
      /^[a-zA-Z\s-]+$/,
      `${field} can only contain letters, spaces, and hyphens`,
    )
    .trim();

const UserSchema = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  profileImageUrl: z.string().nullable(),
  isEmailVerified: z.boolean(),
  createdAt: z.date().or(z.string()),
});

/**
 * REQUEST SCHEMAS (Input Validation)
 */
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

/**
 * RESPONSE SCHEMAS (API Contracts)
 */
export const GenericResponseSchema = z.object({
  message: z.string(),
});

export const AuthResponseSchema = GenericResponseSchema.extend({
  data: UserSchema,
});

export const GetMeResponseSchema = z.object({
  data: UserSchema,
});

export const ApiErrorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
});

/**
 * INFERRED TYPES
 */
export type SignupRequest = z.infer<typeof SignupBodySchema>;
export type SigninRequest = z.infer<typeof SigninBodySchema>;
export type VerifyEmailRequest = z.infer<typeof VerifyEmailBodySchema>;
export type ForgotPasswordRequest = z.infer<typeof ForgotPasswordBodySchema>;
export type ResetPasswordRequest = z.infer<typeof ResetPasswordBodySchema>;

export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export type GetMeResponse = z.infer<typeof GetMeResponseSchema>;
export type GenericResponse = z.infer<typeof GenericResponseSchema>;
export type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>;
