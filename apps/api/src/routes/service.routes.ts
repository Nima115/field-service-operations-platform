import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { createService, listServices } from "../services/service.service.js";
import { asyncHandler } from "../utils/http.js";

export const serviceRouter = Router();

serviceRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    res.json(await listServices());
  })
);

serviceRouter.post(
  "/",
  requireAuth,
  requireRole("ADMIN"),
  asyncHandler(async (req, res) => {
    res.status(201).json(await createService(req.body));
  })
);
