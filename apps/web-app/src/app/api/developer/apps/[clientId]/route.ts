import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@aurik/database";
import { getUser } from "@/lib/auth";
import { logger } from "@/config/logger.config";
import {
  UpdateAppCoreSchema,
  UpdateAppBrandingSchema,
} from "@/zod/apps.schema";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ clientId: string }> },
) {
  try {
    const user = await getUser();
    const { clientId } = await params;

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

    const client = await prisma.client.findFirst({
      where: {
        clientId,
        userId: user.id,
      },
    });

    if (!client) {
      return NextResponse.json(
        {
          error: {
            code: "NOT_FOUND",
            message: "Application not found",
          },
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      data: {
        clientId: client.clientId,
        name: client.appName,
        logoUrl: client.logoUrl,
        clientUri: client.clientUri,
        policyUri: client.policyUri,
        tosUri: client.tosUri,
        allowedCallbacks: client.redirectUris,
        allowedLogoutCallbacks: client.postLogoutUris,
        scopes: client.scopes,
        createdAt: client.createdAt.toISOString(),
        status: client.isActive ? "active" : "inactive",
      },
    });
  } catch (error) {
    logger.error({ err: error }, "[APP_GET]");
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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ clientId: string }> },
) {
  try {
    const user = await getUser();
    const { clientId } = await params;

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
    const result = UpdateAppCoreSchema.safeParse(body);

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

    const { name, allowedCallbacks, allowedLogoutCallbacks } = result.data;

    const existingClient = await prisma.client.findFirst({
      where: { clientId, userId: user.id },
    });

    if (!existingClient) {
      return NextResponse.json(
        {
          error: {
            code: "NOT_FOUND",
            message: "Application not found",
          },
        },
        { status: 404 },
      );
    }

    const updatedClient = await prisma.client.update({
      where: { id: existingClient.id },
      data: {
        appName: name,
        redirectUris: allowedCallbacks,
        postLogoutUris: allowedLogoutCallbacks || [],
        scopes: ["openid", "profile", "email"],
      },
    });

    return NextResponse.json({
      data: {
        clientId: updatedClient.clientId,
        name: updatedClient.appName,
        logoUrl: updatedClient.logoUrl,
        clientUri: updatedClient.clientUri,
        policyUri: updatedClient.policyUri,
        tosUri: updatedClient.tosUri,
        allowedCallbacks: updatedClient.redirectUris,
        allowedLogoutCallbacks: updatedClient.postLogoutUris,
        scopes: updatedClient.scopes,
        createdAt: updatedClient.createdAt.toISOString(),
        status: updatedClient.isActive ? "active" : "inactive",
      },
    });
  } catch (error) {
    logger.error({ err: error }, "[APP_PUT]");
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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ clientId: string }> },
) {
  try {
    const user = await getUser();
    const { clientId } = await params;

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
    const result = UpdateAppBrandingSchema.safeParse(body);

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

    const brandingData = result.data;

    const existingClient = await prisma.client.findFirst({
      where: { clientId, userId: user.id },
    });

    if (!existingClient) {
      return NextResponse.json(
        {
          error: {
            code: "NOT_FOUND",
            message: "Application not found",
          },
        },
        { status: 404 },
      );
    }

    const updatedClient = await prisma.client.update({
      where: { id: existingClient.id },
      data: {
        logoUrl: brandingData.logoUrl ?? existingClient.logoUrl,
        clientUri: brandingData.clientUri ?? existingClient.clientUri,
        policyUri: brandingData.policyUri ?? existingClient.policyUri,
        tosUri: brandingData.tosUri ?? existingClient.tosUri,
      },
    });

    return NextResponse.json({
      data: {
        clientId: updatedClient.clientId,
        name: updatedClient.appName,
        logoUrl: updatedClient.logoUrl,
        clientUri: updatedClient.clientUri,
        policyUri: updatedClient.policyUri,
        tosUri: updatedClient.tosUri,
        allowedCallbacks: updatedClient.redirectUris,
        allowedLogoutCallbacks: updatedClient.postLogoutUris,
        scopes: updatedClient.scopes,
        createdAt: updatedClient.createdAt.toISOString(),
        status: updatedClient.isActive ? "active" : "inactive",
      },
    });
  } catch (error) {
    logger.error({ err: error }, "[APP_PATCH]");
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ clientId: string }> },
) {
  try {
    const user = await getUser();
    const { clientId } = await params;

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

    const existingClient = await prisma.client.findFirst({
      where: { clientId, userId: user.id },
    });

    if (!existingClient) {
      return NextResponse.json(
        {
          error: {
            code: "NOT_FOUND",
            message: "Application not found",
          },
        },
        { status: 404 },
      );
    }

    await prisma.client.delete({
      where: { id: existingClient.id },
    });

    return NextResponse.json({
      data: { message: "Application deleted successfully" },
    });
  } catch (error) {
    logger.error({ err: error }, "[APP_DELETE]");
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
