import { dateTime } from "@/lib/format";
import type { Booking } from "@/lib/api";

const statusClass = {
  PENDING: "bg-amber-50 text-amber-700",
  CONFIRMED: "bg-sky-50 text-sky-700",
  ASSIGNED: "bg-teal-50 text-teal-700",
  IN_PROGRESS: "bg-indigo-50 text-indigo-700",
  COMPLETED: "bg-emerald-50 text-emerald-700",
  CANCELLED: "bg-rose-50 text-rose-700"
};

export function BookingTable({ bookings }: { bookings: Booking[] }) {
  return (
    <div className="overflow-hidden rounded border border-line bg-white shadow-panel">
      <table className="w-full min-w-[760px] border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Service</th>
            <th className="px-4 py-3">Schedule</th>
            <th className="px-4 py-3">Employee</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {bookings.map((booking) => (
            <tr key={booking.id} className="hover:bg-slate-50">
              <td className="px-4 py-4">
                <span className="block font-medium">{booking.customer?.companyName ?? "Unassigned"}</span>
                <span className="block text-xs text-slate-500">{booking.customer?.email}</span>
              </td>
              <td className="px-4 py-4">{booking.serviceType}</td>
              <td className="px-4 py-4">{dateTime(booking.bookingDate)}</td>
              <td className="px-4 py-4">{booking.employee?.name ?? "Needs assignment"}</td>
              <td className="px-4 py-4">
                <span className={`rounded px-2 py-1 text-xs font-semibold ${statusClass[booking.status]}`}>
                  {booking.status.replace("_", " ")}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
