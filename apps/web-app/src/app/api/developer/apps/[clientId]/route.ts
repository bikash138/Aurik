import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@aurik/database";
import { getUser } from "@/lib/auth";
import { UpdateAppSchema } from "@/zod/apps.schema";
import { asyncHandler } from "@/lib/api-handler";
import { ApiError } from "@/lib/exceptions/api.error";

export const GET = asyncHandler(
  async (req: NextRequest, { params }: { params: Promise<{ clientId: string }> }) => {
    const user = await getUser();
    const { clientId } = await params;

    if (!user) throw ApiError.unauthorized();

    const client = await prisma.client.findFirst({
      where: { clientId, userId: user.id },
    });

    if (!client) throw ApiError.notFound("Application not found");

    return NextResponse.json({
      success: true,
      message: "Application fetched successfully",
      data: {
        clientId: client.clientId,
        name: client.appName,
        appType: client.appType,
        logoUrl: client.logoUrl,
        clientUri: client.clientUri,
        policyUri: client.policyUri,
        tosUri: client.tosUri,
        allowedCallbacks: client.redirectUris,
        allowedLogoutCallbacks: client.postLogoutUris,
        scopes: client.scopes,
        createdAt: client.createdAt.toISOString(),
        isActive: client.isActive,
      },
    });
  }
);

export const PATCH = asyncHandler(
  async (req: NextRequest, { params }: { params: Promise<{ clientId: string }> }) => {
    const user = await getUser();
    const { clientId } = await params;

    if (!user) throw ApiError.unauthorized();

    const body = await req.json();
    const result = UpdateAppSchema.safeParse(body);

    if (!result.success) throw ApiError.validationError(result.error.issues[0].message);

    const data = result.data;

    const existingClient = await prisma.client.findFirst({
      where: { clientId, userId: user.id },
    });

    if (!existingClient) throw ApiError.notFound("Application not found");

    const updatedClient = await prisma.client.update({
      where: { id: existingClient.id },
      data: {
        appName: data.name,
        redirectUris: data.allowedCallbacks,
        postLogoutUris: data.allowedLogoutCallbacks,
        logoUrl: data.logoUrl,
        clientUri: data.clientUri,
        policyUri: data.policyUri,
        tosUri: data.tosUri,
        isActive: data.isActive,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Application updated successfully",
      data: {
        clientId: updatedClient.clientId,
        name: updatedClient.appName,
        appType: updatedClient.appType,
        logoUrl: updatedClient.logoUrl,
        clientUri: updatedClient.clientUri,
        policyUri: updatedClient.policyUri,
        tosUri: updatedClient.tosUri,
        allowedCallbacks: updatedClient.redirectUris,
        allowedLogoutCallbacks: updatedClient.postLogoutUris,
        scopes: updatedClient.scopes,
        createdAt: updatedClient.createdAt.toISOString(),
        isActive: updatedClient.isActive,
      },
    });
  }
);

export const DELETE = asyncHandler(
  async (req: NextRequest, { params }: { params: Promise<{ clientId: string }> }) => {
    const user = await getUser();
    const { clientId } = await params;

    if (!user) throw ApiError.unauthorized();

    const existingClient = await prisma.client.findFirst({
      where: { clientId, userId: user.id },
    });

    if (!existingClient) throw ApiError.notFound("Application not found");

    await prisma.client.delete({
      where: { id: existingClient.id },
    });

    return NextResponse.json({
      success: true,
      message: "Application deleted successfully",
      data: { message: "Application deleted successfully" },
    });
  }
);

