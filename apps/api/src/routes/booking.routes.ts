import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { asyncHandler } from "../utils/http.js";
import { createBooking, deleteBooking, listBookings, updateBooking } from "../services/booking.service.js";
import { listBookingActivities } from "../services/booking-activity.service.js";

export const bookingRouter = Router();

bookingRouter.use(requireAuth);

bookingRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    res.status(201).json(await createBooking(req.user!, req.body));
  })
);

bookingRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    res.json(await listBookings(req.user!));
  })
);

bookingRouter.get(
  "/:id/activity",
  asyncHandler(async (req, res) => {
    res.json(await listBookingActivities(req.user!, String(req.params.id)));
  })
);

bookingRouter.patch(
  "/:id",
  requireRole("ADMIN", "EMPLOYEE"),
  asyncHandler(async (req, res) => {
    res.json(await updateBooking(req.user!, String(req.params.id), req.body));
  })
);

bookingRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    res.json(await deleteBooking(req.user!, String(req.params.id)));
  })
);
