import { BookingStatus, InvoiceStatus, Role } from "@prisma/client";
import { describe, expect, it } from "@jest/globals";
import { canViewBookingActivity } from "../src/services/booking-activity.service.js";
import { canTransitionInvoiceStatus } from "../src/services/invoice.service.js";
import { updateBookingSchema } from "../src/services/booking.service.js";

describe("business rules", () => {
  it("allows only valid invoice lifecycle transitions", () => {
    expect(canTransitionInvoiceStatus(InvoiceStatus.DRAFT, InvoiceStatus.SENT)).toBe(true);
    expect(canTransitionInvoiceStatus(InvoiceStatus.SENT, InvoiceStatus.OVERDUE)).toBe(true);
    expect(canTransitionInvoiceStatus(InvoiceStatus.OVERDUE, InvoiceStatus.PAID)).toBe(true);
    expect(canTransitionInvoiceStatus(InvoiceStatus.PAID, InvoiceStatus.SENT)).toBe(false);
    expect(canTransitionInvoiceStatus(InvoiceStatus.VOID, InvoiceStatus.PAID)).toBe(false);
  });

  it("scopes booking activity to admins, assigned employees, and the owning customer", () => {
    const booking = { employeeId: "employee-1", customer: { userId: "customer-1" } };

    expect(canViewBookingActivity({ id: "admin-1", role: Role.ADMIN }, booking)).toBe(true);
    expect(canViewBookingActivity({ id: "employee-1", role: Role.EMPLOYEE }, booking)).toBe(true);
    expect(canViewBookingActivity({ id: "customer-1", role: Role.CUSTOMER }, booking)).toBe(true);
    expect(canViewBookingActivity({ id: "employee-2", role: Role.EMPLOYEE }, booking)).toBe(false);
    expect(canViewBookingActivity({ id: "customer-2", role: Role.CUSTOMER }, booking)).toBe(false);
  });

  it("accepts operational booking updates without allowing unknown statuses", () => {
    expect(updateBookingSchema.parse({ status: BookingStatus.IN_PROGRESS }).status).toBe(BookingStatus.IN_PROGRESS);
    expect(() => updateBookingSchema.parse({ status: "READY_FOR_REVIEW" })).toThrow();
  });
});
