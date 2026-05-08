import { prisma } from "@aurik/database";

export class UserinfoRepo {
  public static async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }
}
