import { z } from "zod";

export const authorizeSchema = z.object({
  client_id: z.string(),
  redirect_uri: z.url(),
  response_type: z.literal("code", {
    message: "response_type must be code",
  }),
  scope: z
    .string()
    .min(1, "scope is required")
    .refine(
      (s) => s.split(" ").includes("openid"),
      'scope must include "openid"',
    ),
  state: z.string().optional(),
  code_challenge: z.string().min(1, "code_challenge is required"),
  code_challenge_method: z.literal("S256", {
    message: "code_challenge_method must be S256",
  }),
  prompt: z.string().optional(),
});

export type AuthorizeInput = z.infer<typeof authorizeSchema>;
