import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@aurik/database";
import { updateProfileSchema } from "@/zod/profile.schema";

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

    return NextResponse.json({ data: user });
  } catch (error) {
    console.error("[PROFILE_GET]", error);
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

export async function PUT(req: NextRequest) {
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

    const body = await req.json();
    const parsed = updateProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid request body",
            details: parsed.error.issues,
          },
        },
        { status: 400 },
      );
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
  } catch (error) {
    console.error("[PROFILE_PUT]", error);
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

export async function DELETE(req: NextRequest) {
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

    await prisma.user.delete({ where: { id: user.id } });

    const response = NextResponse.json({
      message: "Account deleted successfully",
    });

    response.cookies.delete("sid");

    return response;
  } catch (error) {
    console.error("[PROFILE_DELETE]", error);
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
