import Link from "next/link";
import { dateTime } from "@/lib/format";
import type { Booking } from "@/lib/api";
import { BookingStatusBadge, EmptyState, OperationalBadges } from "./booking-operations";

export function BookingTable({ bookings }: { bookings: Booking[] }) {
  if (!bookings.length) {
    return <EmptyState title="No bookings yet" message="New service requests will appear here when customers or staff create them." />;
  }

  return (
    <div className="overflow-hidden rounded border border-line bg-white shadow-panel dark:bg-slate-900">
      <table className="w-full min-w-[820px] border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-300">
          <tr>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Service</th>
            <th className="px-4 py-3">Schedule</th>
            <th className="px-4 py-3">Employee</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Operations</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {bookings.map((booking) => (
            <tr key={booking.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/70">
              <td className="px-4 py-4">
                <span className="block font-medium">{booking.customer?.companyName ?? "Unassigned"}</span>
                <span className="block text-xs text-slate-500 dark:text-slate-400">{booking.customer?.email}</span>
              </td>
              <td className="px-4 py-4">
                <Link className="font-medium text-brand hover:underline" href={`/bookings/${booking.id}`}>
                  {booking.serviceType}
                </Link>
              </td>
              <td className="px-4 py-4">{dateTime(booking.bookingDate)}</td>
              <td className="px-4 py-4">{booking.employee?.name ?? "Needs assignment"}</td>
              <td className="px-4 py-4"><BookingStatusBadge status={booking.status} /></td>
              <td className="px-4 py-4"><OperationalBadges booking={booking} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
