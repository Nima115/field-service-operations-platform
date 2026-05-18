import { BookingStatus, InvoiceStatus } from "@prisma/client";
import { prisma } from "../config/prisma.js";

export async function getOverview() {
  const [paidInvoices, completedBookings, customers, serviceTrends] = await Promise.all([
    prisma.invoice.findMany({ where: { status: InvoiceStatus.PAID } }),
    prisma.booking.count({ where: { status: BookingStatus.COMPLETED } }),
    prisma.customer.count(),
    prisma.booking.groupBy({
      by: ["serviceType"],
      _count: { serviceType: true },
      orderBy: { _count: { serviceType: "desc" } },
      take: 6
    })
  ]);

  const monthlyRevenue = paidInvoices.reduce((sum, invoice) => sum + Number(invoice.amount), 0);

  return {
    monthlyRevenue,
    completedBookings,
    customerGrowth: customers,
    serviceTrends: serviceTrends.map((trend) => ({
      serviceType: trend.serviceType,
      bookings: trend._count.serviceType
    }))
  };
}
