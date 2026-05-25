import { Prisma, Role } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/http.js";

export const bookingActivityInclude = {
  actor: { select: { id: true, name: true, email: true, role: true } }
};

export async function recordBookingActivity(input: {
  bookingId: string;
  actorId?: string | null;
  action: string;
  detail?: string | null;
  metadata?: Record<string, unknown>;
}) {
  return prisma.bookingActivity.create({
    data: {
      bookingId: input.bookingId,
      actorId: input.actorId ?? null,
      action: input.action,
      detail: input.detail ?? null,
      metadata: input.metadata as Prisma.InputJsonValue | undefined
    }
  });
}

export async function listBookingActivities(user: Express.User, bookingId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: { employeeId: true, customer: { select: { userId: true } } }
  });

  if (!booking) throw new AppError(404, "Booking not found", "BOOKING_NOT_FOUND");

  const canView =
    user.role === Role.ADMIN ||
    (user.role === Role.EMPLOYEE && booking.employeeId === user.id) ||
    (user.role === Role.CUSTOMER && booking.customer.userId === user.id);

  if (!canView) throw new AppError(403, "You cannot view this booking activity", "FORBIDDEN");

  return prisma.bookingActivity.findMany({
    where: { bookingId },
    include: bookingActivityInclude,
    orderBy: { createdAt: "desc" }
  });
}
