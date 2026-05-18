import { Router } from "express";
import { Role } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { asyncHandler } from "../utils/http.js";

export const userRouter = Router();

userRouter.use(requireAuth, requireRole("ADMIN"));

userRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const role = typeof req.query.role === "string" ? (req.query.role.toUpperCase() as Role) : undefined;

    res.json(
      await prisma.user.findMany({
        where: role ? { role } : {},
        select: { id: true, name: true, email: true, role: true, createdAt: true },
        orderBy: { createdAt: "desc" }
      })
    );
  })
);
