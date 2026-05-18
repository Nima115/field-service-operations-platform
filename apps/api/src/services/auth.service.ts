import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
import { z } from "zod";
import { env } from "../config/env.js";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/http.js";
import { hashToken, issueTokenPair } from "./token.service.js";
import { createNotification } from "./notification.service.js";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().toLowerCase(),
  password: z.string().min(8),
  role: z.nativeEnum(Role).default(Role.CUSTOMER),
  companyName: z.string().optional(),
  phone: z.string().optional()
});

export const loginSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(8)
});

export async function register(input: z.infer<typeof registerSchema>) {
  const data = registerSchema.parse(input);
  const existing = await prisma.user.findUnique({ where: { email: data.email } });

  if (existing) {
    throw new AppError(409, "A user with this email already exists", "EMAIL_EXISTS");
  }

  const passwordHash = await bcrypt.hash(data.password, 12);
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash,
      role: data.role,
      customer:
        data.role === Role.CUSTOMER
          ? {
              create: {
                companyName: data.companyName ?? data.name,
                email: data.email,
                phone: data.phone
              }
            }
          : undefined
    }
  });

  await createNotification({
    userId: user.id,
    type: "SYSTEM",
    message: "Welcome to ServiceFlow."
  });

  return issueTokenPair(user);
}

export async function login(input: z.infer<typeof loginSchema>) {
  const data = loginSchema.parse(input);
  const user = await prisma.user.findUnique({ where: { email: data.email } });

  if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) {
    throw new AppError(401, "Invalid email or password", "INVALID_CREDENTIALS");
  }

  return issueTokenPair(user);
}

export async function refresh(refreshToken: string) {
  try {
    const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as {
      sub: string;
      tokenId: string;
    };
    const stored = await prisma.refreshToken.findUnique({
      where: { id: payload.tokenId },
      include: { user: true }
    });

    if (!stored || stored.userId !== payload.sub || stored.expiresAt < new Date()) {
      throw new AppError(401, "Refresh token is no longer valid", "REFRESH_INVALID");
    }

    if (stored.tokenHash !== hashToken(refreshToken)) {
      throw new AppError(401, "Refresh token is no longer valid", "REFRESH_INVALID");
    }

    await prisma.refreshToken.delete({ where: { id: stored.id } });
    return issueTokenPair(stored.user);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(401, "Refresh token is no longer valid", "REFRESH_INVALID");
  }
}

export async function requestPasswordReset(email: string) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

  if (user) {
    await createNotification({
      userId: user.id,
      type: "SYSTEM",
      message: "Password reset requested. In production this sends a secure email link."
    });
  }

  return { message: "If the account exists, reset instructions have been sent." };
}

export async function confirmPasswordReset(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

  if (!user) {
    throw new AppError(404, "Account not found", "USER_NOT_FOUND");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await bcrypt.hash(password, 12) }
  });

  return { message: "Password updated." };
}
