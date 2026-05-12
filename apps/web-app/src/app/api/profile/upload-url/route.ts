import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@aurik/database";
import { generateUploadUrl, UploadType } from "@/lib/s3";
import { logger } from "@/config/logger.config";

async function getSessionUser(req: NextRequest) {
  const token =
    req.cookies.get("sid")?.value ||
    req.headers.get("authorization")?.split(" ")[1];

  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    return null;
  }

  return session.user;
}

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);

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

    const searchParams = req.nextUrl.searchParams;
    const type = (searchParams.get("type") as UploadType) || "avatar";
    const clientId = searchParams.get("clientId");

    const uploadId = type === "brand" && clientId ? clientId : user.id;

    const { uploadUrl, publicUrl } = await generateUploadUrl(uploadId, type);

    return NextResponse.json({
      data: {
        uploadUrl,
        publicUrl,
      },
    });
  } catch (error) {
    logger.error({ err: error }, "[UPLOAD_URL_GET]");
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
