import { Resend } from "resend";
import { env } from "@/config/env.config.js";
import { logger } from "@/config/logger.config.js";

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (options: EmailOptions) => {
  if (resend) {
    await resend.emails.send({
      from: "Aurik Identity <onboarding@aurik.bikashshaw.in>",
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
  } else {
    logger.info(
      { to: options.to, subject: options.subject },
      `\n[MOCK EMAIL SENT]\nTo: ${options.to}\nSubject: ${options.subject}\nBody: ${options.html}\n`,
    );
  }
};
