import { Router } from "express";
import { prisma } from "../config/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { listNotifications } from "../services/notification.service.js";
import { asyncHandler } from "../utils/http.js";

export const notificationRouter = Router();

notificationRouter.use(requireAuth);

notificationRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    res.json(await listNotifications(req.user!.id));
  })
);

notificationRouter.patch(
  "/:id/read",
  asyncHandler(async (req, res) => {
    await prisma.notification.updateMany({
      where: { id: String(req.params.id), userId: req.user!.id },
      data: { readStatus: true }
    });

    res.json({ message: "Notification marked as read." });
  })
);
