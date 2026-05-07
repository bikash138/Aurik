import { generateKeyPair, exportPKCS8, exportSPKI } from "jose";
import { prisma } from "@aurik/database";
import { logger } from "@/config/logger.config.js";
import crypto from "crypto";

export async function initializeSigningKeys() {
  const existingKey = await prisma.signingKey.findFirst();

  if (existingKey) {
    logger.info("Signing keys already exist. Skipping generation.");
    return;
  }

  logger.info("Generating new RSA signing keys...");

  const { publicKey, privateKey } = await generateKeyPair("RS256", {
    modulusLength: 2048,
    extractable: true,
  });

  const privatePem = await exportPKCS8(privateKey);
  const publicPem = await exportSPKI(publicKey);
  const kid = `aurik-${new Date().getFullYear()}-${crypto.randomBytes(4).toString("hex")}`;

  await prisma.signingKey.create({
    data: {
      kid: kid,
      privateKey: privatePem,
      publicKey: publicPem,
      algorithm: "RS256",
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  });

  console.log("New signing keys successfully seeded into the database.");
}
