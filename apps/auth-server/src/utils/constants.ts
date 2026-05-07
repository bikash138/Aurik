export const EXPIRATION_TIMES = {
  EMAIL_VERIFICATION: 24 * 60 * 60 * 1000, // 24 hours
  PASSWORD_RESET: 1 * 60 * 60 * 1000, // 1 hour
  SESSION: 7 * 24 * 60 * 60 * 1000, // 7 days
} as const;
