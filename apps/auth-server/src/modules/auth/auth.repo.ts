import { prisma } from "@aurik/database";

export class AuthRepo {
  public static async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  public static async createUser(
    email: string,
    passwordHash: string,
    firstName: string,
    lastName: string,
  ) {
    return await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        isEmailVerified: false,
        isActive: true,
      },
    });
  }
}
