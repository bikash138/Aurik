import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@aurik/database";
import { getUser } from "@/lib/auth";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { logger } from "@/config/logger.config";
import { CreateAppSchema } from "@/zod/apps.schema";

export async function GET() {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json(
        {
          error: {
            code: "UNAUTHORIZED",
            message: "Missing or invalid session",
          },
        },
        { status: 401 },
      );
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
  } catch (error) {
    logger.error({ err: error }, "[APPS_GET]");
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred",
        },
      },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json(
        {
          error: {
            code: "UNAUTHORIZED",
            message: "Missing or invalid session",
          },
        },
        { status: 401 },
      );
    }

    const body = await req.json();
    const result = CreateAppSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: result.error.issues[0].message,
          },
        },
        { status: 400 },
      );
    }

    const { name, redirectUris, appType, pkceRequired } = result.data;

    const origin = new URL(redirectUris[0]).origin;
    const logoUrl = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(name)}`;
    const clientUri = origin;

    const clientId = crypto.randomBytes(16).toString("hex");
    const clientSecret = crypto.randomBytes(32).toString("hex");
    const hashedSecret = bcrypt.hashSync(clientSecret, 10);

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
  } catch (error) {
    logger.error({ err: error }, "[APPS_POST]");
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred",
        },
      },
      { status: 500 },
    );
  }
}
