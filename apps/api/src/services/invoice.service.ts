import PDFDocument from "pdfkit";
import { InvoiceStatus, Role } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/http.js";
import { recordAuditLog } from "./audit.service.js";
import { recordBookingActivity } from "./booking-activity.service.js";

export const invoiceSchema = z.object({
  bookingId: z.string().uuid(),
  amount: z.number().positive(),
  status: z.enum(["DRAFT", "SENT", "PAID", "OVERDUE", "VOID"]).default("DRAFT")
});

const allowedTransitions: Record<InvoiceStatus, InvoiceStatus[]> = {
  DRAFT: ["SENT", "VOID"],
  SENT: ["PAID", "OVERDUE", "VOID"],
  OVERDUE: ["PAID", "VOID"],
  PAID: [],
  VOID: []
};

export async function listInvoices(user?: Express.User) {
  return prisma.invoice.findMany({
    where:
      user?.role === Role.CUSTOMER
        ? {
            booking: {
              customer: {
                userId: user.id
              }
            }
          }
        : {},
    include: {
      booking: {
        include: { customer: true, employee: { select: { id: true, name: true, email: true } } }
      }
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function createInvoice(input: z.infer<typeof invoiceSchema>, user?: Express.User) {
  const data = invoiceSchema.parse(input);
  const booking = await prisma.booking.findUnique({ where: { id: data.bookingId } });

  if (!booking) throw new AppError(404, "Booking not found", "BOOKING_NOT_FOUND");

  const invoice = await prisma.invoice.create({
    data: { ...data, status: data.status ?? "DRAFT" },
    include: { booking: { include: { customer: true } } }
  });

  await recordAuditLog({
    actorId: user?.id,
    action: "Invoice generated",
    entity: "Invoice",
    entityId: invoice.id,
    metadata: { bookingId: booking.id, status: invoice.status, amount: invoice.amount.toString() }
  });
  await recordBookingActivity({
    bookingId: booking.id,
    actorId: user?.id,
    action: "Invoice created",
    detail: `${invoice.status} invoice for ${invoice.amount.toString()} SEK`,
    metadata: { invoiceId: invoice.id, status: invoice.status }
  });

  return invoice;
}

export async function updateInvoiceStatus(id: string, status: z.infer<typeof invoiceSchema>["status"], user?: Express.User) {
  const invoice = await prisma.invoice.findUnique({ where: { id } });
  if (!invoice) throw new AppError(404, "Invoice not found", "INVOICE_NOT_FOUND");

  if (!allowedTransitions[invoice.status].includes(status) && invoice.status !== status) {
    throw new AppError(422, `Invoice cannot move from ${invoice.status} to ${status}`, "INVALID_INVOICE_TRANSITION");
  }

  const updated = await prisma.invoice.update({
    where: { id },
    data: { status },
    include: { booking: { include: { customer: true } } }
  });

  await recordAuditLog({
    actorId: user?.id,
    action: "Invoice status changed",
    entity: "Invoice",
    entityId: updated.id,
    metadata: { from: invoice.status, to: status }
  });
  await recordBookingActivity({
    bookingId: updated.bookingId,
    actorId: user?.id,
    action: "Invoice status changed",
    detail: `${invoice.status} to ${status}`,
    metadata: { invoiceId: updated.id, from: invoice.status, to: status }
  });

  return updated;
}

export async function buildInvoicePdf(invoiceId: string, user?: Express.User) {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { booking: { include: { customer: true } } }
  });

  if (!invoice) throw new AppError(404, "Invoice not found", "INVOICE_NOT_FOUND");
  if (user?.role === Role.CUSTOMER && invoice.booking.customer.userId !== user.id) {
    throw new AppError(403, "You do not have permission for this invoice", "FORBIDDEN");
  }

  const doc = new PDFDocument({ margin: 48 });
  const chunks: Buffer[] = [];

  doc.on("data", (chunk) => chunks.push(chunk as Buffer));
  doc.fontSize(22).text("Operations Platform Invoice");
  doc.moveDown();
  doc.fontSize(12).text(`Invoice ID: ${invoice.id}`);
  doc.text(`Customer: ${invoice.booking.customer.companyName}`);
  doc.text(`Service: ${invoice.booking.serviceType}`);
  doc.text(`Amount: ${invoice.amount.toString()} SEK`);
  doc.text(`Status: ${invoice.status}`);
  doc.end();

  return new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });
}
