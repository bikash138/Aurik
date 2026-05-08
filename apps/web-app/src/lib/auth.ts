import { cookies } from "next/headers";
import { prisma } from "@aurik/database";

export async function getUser() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("sid")?.value;

  if (!sessionToken) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: { token: sessionToken },
    include: {
      user: true,
    },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await prisma.session.delete({ where: { id: session.id } });
    }
    return null;
  }

  return session.user;
}
