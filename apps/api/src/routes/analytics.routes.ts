import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { getOverview } from "../services/analytics.service.js";
import { asyncHandler } from "../utils/http.js";

export const analyticsRouter = Router();

analyticsRouter.get(
  "/overview",
  requireAuth,
  requireRole("ADMIN"),
  asyncHandler(async (_req, res) => {
    res.json(await getOverview());
  })
);
