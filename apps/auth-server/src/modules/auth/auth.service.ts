import { MailService } from "../mail/mail.service.js";
import bcrypt from "bcryptjs";
import { AuthRepo } from "./auth.repo.js";
import { ApiError } from "@/core/errors/api.error.js";
import type { SignupRequest } from "./auth.schema.js";

export class AuthService {
  private static hashPassword(password: string) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  }

  private static verifyPassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }

  public static async signup(data: SignupRequest) {
    const existingUser = await AuthRepo.getUserByEmail(data.email);
    if (existingUser) {
      throw ApiError.conflict("User already exists with this email");
    }

    const passwordHash = this.hashPassword(data.password);

    const newUser = await AuthRepo.createUser(
      data.email,
      passwordHash,
      data.firstName,
      data.lastName,
    );

    await MailService.sendEmailVerificationEmail(newUser.id, newUser.email);

    return {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
    };
  }
}
