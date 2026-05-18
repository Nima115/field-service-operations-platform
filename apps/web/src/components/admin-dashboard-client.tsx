"use client";

import { useEffect, useState } from "react";
import { CalendarCheck, CircleDollarSign, ClipboardCheck, Trash2, Users } from "lucide-react";
import { AnalyticsOverview, apiFetch, authToken, Booking, BookingStatus, User } from "@/lib/api";
import { money } from "@/lib/format";
import { StatCard } from "./stat-card";
import { StatusMessage } from "./status-message";

const statuses: BookingStatus[] = ["PENDING", "CONFIRMED", "ASSIGNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

export function AdminDashboardClient() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [employees, setEmployees] = useState<User[]>([]);
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [error, setError] = useState("");

  async function load() {
    const token = authToken();
    if (!token) return setError("Login as admin to manage operations.");
    try {
      const [bookingRows, employeeRows, analytics] = await Promise.all([
        apiFetch<Booking[]>("/bookings", { token }),
        apiFetch<User[]>("/users?role=EMPLOYEE", { token }),
        apiFetch<AnalyticsOverview>("/analytics/overview", { token })
      ]);
      setBookings(bookingRows);
      setEmployees(employeeRows);
      setOverview(analytics);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load dashboard");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function patchBooking(id: string, data: Partial<{ employeeId: string | null; status: BookingStatus; notes: string }>) {
    const token = authToken();
    if (!token) return;
    await apiFetch(`/bookings/${id}`, { method: "PATCH", token, body: JSON.stringify(data) });
    await load();
  }

  async function deleteBooking(id: string) {
    const token = authToken();
    if (!token) return;
    await apiFetch(`/bookings/${id}`, { method: "DELETE", token });
    await load();
  }

  return (
    <div className="space-y-6">
      {error ? <StatusMessage tone="error" message={error} /> : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Monthly revenue" value={money(overview?.monthlyRevenue ?? 0)} detail="Paid invoice revenue" icon={CircleDollarSign} />
        <StatCard label="Open bookings" value={String(bookings.filter((booking) => !["COMPLETED", "CANCELLED"].includes(booking.status)).length)} detail="Active operational work" icon={CalendarCheck} />
        <StatCard label="Completed jobs" value={String(overview?.completedBookings ?? 0)} detail="Completed booking count" icon={ClipboardCheck} />
        <StatCard label="Customers" value={String(overview?.customerGrowth ?? 0)} detail="CRM accounts" icon={Users} />
      </div>
      <div className="overflow-hidden rounded border border-line bg-white shadow-panel">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Employee</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Notes</th>
              <th className="px-4 py-3">Remove</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td className="px-4 py-4">{booking.customer?.companyName}</td>
                <td className="px-4 py-4">{booking.serviceType}</td>
                <td className="px-4 py-4">
                  <select className="focus-ring h-9 rounded border border-line px-2" value={booking.employee?.id ?? ""} onChange={(event) => patchBooking(booking.id, { employeeId: event.target.value || null, status: event.target.value ? "ASSIGNED" : booking.status })}>
                    <option value="">Unassigned</option>
                    {employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.name}</option>)}
                  </select>
                </td>
                <td className="px-4 py-4">
                  <select className="focus-ring h-9 rounded border border-line px-2" value={booking.status} onChange={(event) => patchBooking(booking.id, { status: event.target.value as BookingStatus })}>
                    {statuses.map((status) => <option key={status}>{status}</option>)}
                  </select>
                </td>
                <td className="px-4 py-4">
                  <input className="focus-ring h-9 rounded border border-line px-2" defaultValue={booking.notes ?? ""} onBlur={(event) => patchBooking(booking.id, { notes: event.target.value })} />
                </td>
                <td className="px-4 py-4">
                  <button onClick={() => deleteBooking(booking.id)} className="focus-ring grid h-9 w-9 place-items-center rounded border border-line text-danger" aria-label="Delete booking">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
