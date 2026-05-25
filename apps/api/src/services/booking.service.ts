import { BookingStatus, Role } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/http.js";
import { recordAuditLog } from "./audit.service.js";
import { bookingActivityInclude, recordBookingActivity } from "./booking-activity.service.js";
import { createNotification } from "./notification.service.js";

export const createBookingSchema = z.object({
  customerId: z.string().uuid().optional(),
  serviceId: z.string().uuid().optional(),
  serviceType: z.string().min(2),
  bookingDate: z.coerce.date(),
  notes: z.string().optional()
});

export const updateBookingSchema = z.object({
  employeeId: z.string().uuid().nullable().optional(),
  status: z.nativeEnum(BookingStatus).optional(),
  notes: z.string().optional()
});

export const bookingIncludes = {
  customer: true,
  employee: { select: { id: true, name: true, email: true, role: true } },
  service: true,
  invoices: true,
  files: true,
  activities: {
    include: bookingActivityInclude,
    orderBy: { createdAt: "desc" as const }
  }
};

export async function createBooking(user: Express.User, input: z.infer<typeof createBookingSchema>) {
  const data = createBookingSchema.parse(input);
  let customerId = data.customerId;

  if (user.role === Role.CUSTOMER) {
    const customer = await prisma.customer.findUnique({ where: { userId: user.id } });
    if (!customer) throw new AppError(404, "Customer profile not found", "CUSTOMER_NOT_FOUND");
    customerId = customer.id;
  }

  if (!customerId) {
    throw new AppError(422, "customerId is required for staff-created bookings", "CUSTOMER_REQUIRED");
  }

  const booking = await prisma.booking.create({
    data: {
      customerId,
      serviceId: data.serviceId,
      serviceType: data.serviceType,
      bookingDate: data.bookingDate,
      notes: data.notes,
      status: BookingStatus.PENDING
    },
    include: bookingIncludes
  });

  await recordAuditLog({
    actorId: user.id,
    action: "Booking created",
    entity: "Booking",
    entityId: booking.id,
    metadata: { serviceType: booking.serviceType, status: booking.status }
  });
  await recordBookingActivity({
    bookingId: booking.id,
    actorId: user.id,
    action: "Booking created",
    detail: `${booking.serviceType} scheduled for ${booking.bookingDate.toISOString()}`,
    metadata: { status: booking.status }
  });

  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    include: { user: true }
  });

  if (customer?.userId) {
    await createNotification({
      userId: customer.userId,
      type: "BOOKING_CONFIRMATION",
      message: `Booking received for ${booking.serviceType}.`
    });
  }

  return booking;
}

export async function listBookings(user: Express.User) {
  return prisma.booking.findMany({
    where:
      user.role === Role.ADMIN
        ? {}
        : user.role === Role.EMPLOYEE
          ? { employeeId: user.id }
          : { customer: { userId: user.id } },
    include: bookingIncludes,
    orderBy: { bookingDate: "desc" }
  });
}

export async function updateBooking(
  user: Express.User,
  id: string,
  input: z.infer<typeof updateBookingSchema>
) {
  const data = updateBookingSchema.parse(input);
  const booking = await prisma.booking.findUnique({ where: { id } });

  if (!booking) throw new AppError(404, "Booking not found", "BOOKING_NOT_FOUND");

  if (user.role === Role.EMPLOYEE && booking.employeeId !== user.id) {
    throw new AppError(403, "Employees can only update assigned jobs", "FORBIDDEN");
  }

  if (user.role === Role.EMPLOYEE && data.employeeId !== undefined) {
    throw new AppError(403, "Employees cannot reassign jobs", "FORBIDDEN");
  }

  if (user.role === Role.CUSTOMER) {
    throw new AppError(403, "Customers cannot update booking operations", "FORBIDDEN");
  }

  const updated = await prisma.booking.update({
    where: { id },
    data,
    include: bookingIncludes
  });

  await recordAuditLog({
    actorId: user.id,
    action: data.status === "COMPLETED" ? "Employee completed task" : data.employeeId ? "Admin assigned job" : "Booking updated",
    entity: "Booking",
    entityId: updated.id,
    metadata: data
  });
  await Promise.all([
    data.employeeId !== undefined
      ? recordBookingActivity({
          bookingId: updated.id,
          actorId: user.id,
          action: data.employeeId ? "Employee assigned" : "Employee unassigned",
          detail: data.employeeId ? updated.employee?.name ?? "Assigned employee" : "Booking returned to the unassigned queue",
          metadata: { employeeId: data.employeeId }
        })
      : Promise.resolve(),
    data.status && data.status !== booking.status
      ? recordBookingActivity({
          bookingId: updated.id,
          actorId: user.id,
          action: "Status changed",
          detail: `${booking.status} to ${data.status}`,
          metadata: { from: booking.status, to: data.status }
        })
      : Promise.resolve(),
    data.notes !== undefined && data.notes !== booking.notes
      ? recordBookingActivity({
          bookingId: updated.id,
          actorId: user.id,
          action: "Notes updated",
          detail: data.notes || "Notes cleared"
        })
      : Promise.resolve()
  ]);

  if (data.employeeId) {
    await createNotification({
      userId: data.employeeId,
      type: "EMPLOYEE_ASSIGNMENT",
      message: `You were assigned to ${updated.serviceType}.`
    });
  }

  return updated;
}

export async function deleteBooking(user: Express.User, id: string) {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { customer: true }
  });

  if (!booking) throw new AppError(404, "Booking not found", "BOOKING_NOT_FOUND");

  if (user.role !== Role.ADMIN && booking.customer.userId !== user.id) {
    throw new AppError(403, "You cannot delete this booking", "FORBIDDEN");
  }

  await recordAuditLog({
    actorId: user.id,
    action: "Booking deleted",
    entity: "Booking",
    entityId: id,
    metadata: { serviceType: booking.serviceType }
  });
  await prisma.booking.delete({ where: { id } });
  return { message: "Booking deleted." };
}
