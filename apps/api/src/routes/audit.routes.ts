import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { listAuditLogs } from "../services/audit.service.js";
import { asyncHandler } from "../utils/http.js";

export const auditRouter = Router();

auditRouter.use(requireAuth, requireRole("ADMIN"));

auditRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    res.json(await listAuditLogs(req.user!));
  })
);
