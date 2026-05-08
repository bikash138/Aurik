import { Request, Response, NextFunction } from "express";
import { prisma, User } from "@aurik/database";

declare global {
  namespace Express {
    interface Request {
      user: User | null;
    }
  }
}

export async function attachSession(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const sessionToken = req.cookies.sid;

    if (!sessionToken) {
      req.user = null;
      return next();
    }

    const session = await prisma.session.findUnique({
      where: { token: sessionToken },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      req.user = null;
      return next();
    }

    req.user = session.user;
    next();
  } catch {
    req.user = null;
    next();
  }
}
