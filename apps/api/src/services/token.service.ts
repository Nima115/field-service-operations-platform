import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import type { Role, User } from "@prisma/client";
import { addDays } from "date-fns";
import { env } from "../config/env.js";
import { prisma } from "../config/prisma.js";

export type PublicUser = Pick<User, "id" | "name" | "email" | "role">;

export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
}

export function signAccessToken(user: PublicUser) {
  const options: SignOptions = {
    subject: user.id,
    expiresIn: env.ACCESS_TOKEN_TTL as SignOptions["expiresIn"]
  };

  return jwt.sign(
    {
      email: user.email,
      role: user.role
    },
    env.JWT_ACCESS_SECRET,
    options
  );
}

export function signRefreshToken(user: PublicUser, tokenId: string) {
  const options: SignOptions = {
    subject: user.id,
    expiresIn: env.REFRESH_TOKEN_TTL as SignOptions["expiresIn"]
  };

  return jwt.sign(
    {
      tokenId,
      role: user.role as Role
    },
    env.JWT_REFRESH_SECRET,
    options
  );
}

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function issueTokenPair(user: User) {
  const publicUser = toPublicUser(user);
  const tokenRecord = await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: "pending",
      expiresAt: addDays(new Date(), 7)
    }
  });
  const refreshToken = signRefreshToken(publicUser, tokenRecord.id);

  await prisma.refreshToken.update({
    where: { id: tokenRecord.id },
    data: { tokenHash: hashToken(refreshToken) }
  });

  return {
    accessToken: signAccessToken(publicUser),
    refreshToken,
    user: publicUser
  };
}
