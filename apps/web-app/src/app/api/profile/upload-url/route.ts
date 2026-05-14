import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@aurik/database";
import { generateUploadUrl, UploadType } from "@/lib/s3";
import { asyncHandler } from "@/lib/api-handler";
import { ApiError } from "@/lib/exceptions/api.error";

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

export const GET = asyncHandler(async (req: NextRequest) => {
  const user = await getSessionUser(req);

  if (!user) throw ApiError.unauthorized();

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
});

