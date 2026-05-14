import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@aurik/database";
import { getUser } from "@/lib/auth";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { asyncHandler } from "@/lib/api-handler";
import { ApiError } from "@/lib/exceptions/api.error";

export const POST = asyncHandler(
  async (req: NextRequest, { params }: { params: Promise<{ clientId: string }> }) => {
    const user = await getUser();
    const { clientId } = await params;

    if (!user) throw ApiError.unauthorized();

    const existingClient = await prisma.client.findFirst({
      where: { clientId, userId: user.id },
    });

    if (!existingClient) throw ApiError.notFound("Application not found");

    // Generate new secret
    const newSecret = `aurik_${crypto.randomBytes(32).toString("hex")}`;
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
  }
);

