import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@aurik/database";
import { getUser } from "@/lib/auth";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { CreateAppSchema } from "@/zod/apps.schema";
import { asyncHandler } from "@/lib/api-handler";
import { ApiError } from "@/lib/exceptions/api.error";

export const GET = asyncHandler(async () => {
  const user = await getUser();

  if (!user) {
    throw ApiError.unauthorized("Missing or invalid session");
  }

  const clients = await prisma.client.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const applications = clients.map((client) => ({
    clientId: client.clientId,
    name: client.appName,
    appType: client.appType,
    logoUrl: client.logoUrl,
    clientUri: client.clientUri,
    policyUri: client.policyUri,
    tosUri: client.tosUri,
    allowedCallbacks: client.redirectUris,
    allowedLogoutCallbacks: client.postLogoutUris,
    createdAt: client.createdAt.toISOString(),
    isActive: client.isActive,
  }));

  return NextResponse.json({
    success: true,
    message: "Applications fetched successfully",
    data: applications,
  });
});

export const POST = asyncHandler(async (req: NextRequest) => {
  const user = await getUser();

  if (!user) {
    throw ApiError.unauthorized("Missing or invalid session");
  }

  const body = await req.json();
  const result = CreateAppSchema.safeParse(body);

  if (!result.success) {
    throw ApiError.validationError(result.error.issues[0].message);
  }

  const { name, redirectUris, appType, pkceRequired } = result.data;

  if (!redirectUris || redirectUris.length === 0) {
    throw ApiError.validationError("At least one redirect URI is required");
  }

  let origin: string;
  try {
    origin = new URL(redirectUris[0]).origin;
  } catch (error) {
    throw ApiError.validationError("The provided redirect URI is invalid");
  }

  const logoUrl = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(name)}`;
  const clientUri = origin;

  const clientId = `aurik_${crypto.randomBytes(16).toString("hex")}`;
  const clientSecret = `aurik_${crypto.randomBytes(32).toString("hex")}`;
  const hashedSecret = await bcrypt.hash(clientSecret, 10);

  const client = await prisma.client.create({
    data: {
      userId: user.id,
      appName: name,
      clientId,
      clientSecretHash: hashedSecret,
      appType: appType || "CONFIDENTIAL",
      pkceRequired: !!pkceRequired,
      grantTypes: ["authorization_code", "refresh_token"],
      scopes: ["openid", "profile", "email"],
      redirectUris: redirectUris,
      postLogoutUris: [],
      logoUrl,
      clientUri,
    },
  });

  return NextResponse.json({
    success: true,
    message: "Application created successfully",
    data: {
      clientId: client.clientId,
      clientSecret,
      name: client.appName,
      appType: client.appType,
      logoUrl: client.logoUrl,
      clientUri: client.clientUri,
      policyUri: client.policyUri,
      tosUri: client.tosUri,
      allowedCallbacks: client.redirectUris,
      allowedLogoutCallbacks: client.postLogoutUris,
      createdAt: client.createdAt.toISOString(),
      isActive: client.isActive,
    },
  });
});
