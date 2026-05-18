import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../utils/http.js";
import { requireAuth } from "../middleware/auth.js";
import { prisma } from "../config/prisma.js";
import {
  confirmPasswordReset,
  login,
  refresh,
  register,
  requestPasswordReset
} from "../services/auth.service.js";

export const authRouter = Router();

authRouter.post(
  "/register",
  asyncHandler(async (req, res) => {
    res.status(201).json(await register(req.body));
  })
);

authRouter.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });

    res.json(user);
  })
);

authRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    res.json(await login(req.body));
  })
);

authRouter.post(
  "/refresh",
  asyncHandler(async (req, res) => {
    const body = z.object({ refreshToken: z.string() }).parse(req.body);
    res.json(await refresh(body.refreshToken));
  })
);

authRouter.post(
  "/reset-password/request",
  asyncHandler(async (req, res) => {
    const body = z.object({ email: z.string().email() }).parse(req.body);
    res.json(await requestPasswordReset(body.email));
  })
);

authRouter.post(
  "/reset-password/confirm",
  asyncHandler(async (req, res) => {
    const body = z.object({ email: z.string().email(), password: z.string().min(8) }).parse(req.body);
    res.json(await confirmPasswordReset(body.email, body.password));
  })
);
