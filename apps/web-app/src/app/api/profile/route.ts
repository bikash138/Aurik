import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@aurik/database";
import { updateProfileSchema } from "@/zod/profile.schema";
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
    if (session) {
      await prisma.session.delete({ where: { id: session.id } });
    }
    return null;
  }

  return session.user;
}

export const GET = asyncHandler(async (req: NextRequest) => {
  const user = await getSessionUser(req);

  if (!user) throw ApiError.unauthorized();

  return NextResponse.json({ data: user });
});

export const PUT = asyncHandler(async (req: NextRequest) => {
  const user = await getSessionUser(req);

  if (!user) throw ApiError.unauthorized();

  const body = await req.json();
  const parsed = updateProfileSchema.safeParse(body);

  if (!parsed.success) {
    throw ApiError.validationError(parsed.error.issues[0].message);
  }

  const {
    firstName,
    lastName,
    profileImageUrl,
    gender,
    dateOfBirth,
    country,
  } = parsed.data;

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      firstName,
      lastName,
      profileImageUrl,
      gender: gender,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      country: country ?? null,
    } as any,
  });

  return NextResponse.json({ data: updatedUser });
});

export const DELETE = asyncHandler(async (req: NextRequest) => {
  const user = await getSessionUser(req);

  if (!user) throw ApiError.unauthorized();

  await prisma.user.delete({ where: { id: user.id } });

  const response = NextResponse.json({
    message: "Account deleted successfully",
  });

  response.cookies.delete("sid");

  return response;
});

