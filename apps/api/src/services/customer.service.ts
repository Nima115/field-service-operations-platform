import { z } from "zod";
import { prisma } from "../config/prisma.js";

export const customerSchema = z.object({
  companyName: z.string().min(2),
  email: z.string().email().toLowerCase(),
  phone: z.string().optional(),
  notes: z.string().optional()
});

export async function listCustomers() {
  return prisma.customer.findMany({
    include: {
      bookings: {
        include: { invoices: true },
        orderBy: { bookingDate: "desc" }
      }
    },
    orderBy: { companyName: "asc" }
  });
}

export async function createCustomer(input: z.infer<typeof customerSchema>) {
  return prisma.customer.create({
    data: customerSchema.parse(input)
  });
}
