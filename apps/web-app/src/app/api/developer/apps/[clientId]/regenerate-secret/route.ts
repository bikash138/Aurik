import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@aurik/database";
import { getUser } from "@/lib/auth";
import { logger } from "@/config/logger.config";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";

export async function POST(
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

    // Generate new secret
    const newSecret = crypto.randomBytes(32).toString("hex");
    const hashedSecret = bcrypt.hashSync(newSecret, 10);

    await prisma.client.update({
      where: { id: existingClient.id },
      data: {
        clientSecretHash: hashedSecret,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Secret regenerated successfully",
      data: {
        clientSecret: newSecret,
      },
    });
  } catch (error) {
    logger.error({ err: error }, "[SECRET_REGENERATE]");
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
