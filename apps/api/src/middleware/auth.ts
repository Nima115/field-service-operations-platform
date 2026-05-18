import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import type { Role } from "@prisma/client";
import { env } from "../config/env.js";
import { AppError } from "../utils/http.js";

type TokenPayload = {
  sub: string;
  email: string;
  role: Role;
};

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return next(new AppError(401, "Missing access token", "AUTH_REQUIRED"));
  }

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role
    };
    return next();
  } catch {
    return next(new AppError(401, "Invalid or expired access token", "AUTH_INVALID"));
  }
}

export function requireRole(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(401, "Authentication required", "AUTH_REQUIRED"));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError(403, "You do not have permission for this action", "FORBIDDEN"));
    }

    return next();
  };
}
