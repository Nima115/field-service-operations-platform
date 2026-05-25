"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarCheck, CircleDollarSign, ClipboardCheck, SlidersHorizontal, Trash2, Users } from "lucide-react";
import { AnalyticsOverview, apiFetch, authToken, Booking, BookingStatus, User } from "@/lib/api";
import { dateTime, money } from "@/lib/format";
import { BookingActivityTimeline, BookingStatusBadge, EmptyState, LoadingState, OperationalBadges, bookingOperationalBadges } from "./booking-operations";
import { StatCard } from "./stat-card";
import { StatusMessage } from "./status-message";

type SortKey = "bookingDate" | "customer" | "status";
type AuditLog = {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  createdAt: string;
  actor?: { name: string } | null;
};

const statuses: BookingStatus[] = ["PENDING", "CONFIRMED", "ASSIGNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

export function AdminDashboardClient() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [employees, setEmployees] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [selectedId, setSelectedId] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | BookingStatus>("ALL");
  const [opsFilter, setOpsFilter] = useState("ALL");
  const [sortKey, setSortKey] = useState<SortKey>("bookingDate");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    const token = authToken();
    if (!token) {
      setLoading(false);
      return setError("Login as admin to manage operations.");
    }
    try {
      setLoading(true);
      const [bookingRows, employeeRows, analytics, logs] = await Promise.all([
        apiFetch<Booking[]>("/bookings", { token }),
        apiFetch<User[]>("/users?role=EMPLOYEE", { token }),
        apiFetch<AnalyticsOverview>("/analytics/overview", { token }),
        apiFetch<AuditLog[]>("/audit-logs", { token }).catch(() => [])
      ]);
      setBookings(bookingRows);
      setEmployees(employeeRows);
      setOverview(analytics);
      setAuditLogs(Array.isArray(logs) ? logs : []);
      setSelectedId((current) => current || bookingRows[0]?.id || "");
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const visibleBookings = useMemo(() => {
    return bookings
      .filter((booking) => statusFilter === "ALL" || booking.status === statusFilter)
      .filter((booking) => opsFilter === "ALL" || bookingOperationalBadges(booking).includes(opsFilter as never))
      .sort((a, b) => {
        if (sortKey === "customer") return (a.customer?.companyName ?? "").localeCompare(b.customer?.companyName ?? "");
        if (sortKey === "status") return a.status.localeCompare(b.status);
        return new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime();
      });
  }, [bookings, opsFilter, sortKey, statusFilter]);

  const selectedBooking = bookings.find((booking) => booking.id === selectedId) ?? visibleBookings[0];

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

      <div className="rounded border border-line bg-white p-4 shadow-panel dark:bg-slate-900">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <SlidersHorizontal className="h-4 w-4 text-brand" /> Filters and sorting
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <select className="focus-ring h-10 rounded border border-line bg-white px-3 text-sm dark:bg-slate-950" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as "ALL" | BookingStatus)}>
            <option value="ALL">All statuses</option>
            {statuses.map((status) => <option key={status}>{status}</option>)}
          </select>
          <select className="focus-ring h-10 rounded border border-line bg-white px-3 text-sm dark:bg-slate-950" value={opsFilter} onChange={(event) => setOpsFilter(event.target.value)}>
            <option value="ALL">All operational badges</option>
            <option>Delayed</option>
            <option>Unassigned</option>
            <option>Awaiting invoice</option>
          </select>
          <select className="focus-ring h-10 rounded border border-line bg-white px-3 text-sm dark:bg-slate-950" value={sortKey} onChange={(event) => setSortKey(event.target.value as SortKey)}>
            <option value="bookingDate">Newest schedule first</option>
            <option value="customer">Customer A-Z</option>
            <option value="status">Status A-Z</option>
          </select>
        </div>
      </div>

      {loading ? <LoadingState label="Loading bookings and operational activity" /> : null}
      {!loading && !visibleBookings.length ? <EmptyState title="No bookings match these filters" message="Adjust filters or create a new booking to populate the operations queue." /> : null}

      {!loading && visibleBookings.length ? (
        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="overflow-hidden rounded border border-line bg-white shadow-panel dark:bg-slate-900">
            <table className="w-full min-w-[980px] border-collapse text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                <tr>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Schedule</th>
                  <th className="px-4 py-3">Employee</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Operations</th>
                  <th className="px-4 py-3">Notes</th>
                  <th className="px-4 py-3">Remove</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {visibleBookings.map((booking) => (
                  <tr key={booking.id} className={selectedBooking?.id === booking.id ? "bg-teal-50/60 dark:bg-teal-950/30" : "hover:bg-slate-50 dark:hover:bg-slate-800/70"} onClick={() => setSelectedId(booking.id)}>
                    <td className="px-4 py-4 font-medium">{booking.customer?.companyName}</td>
                    <td className="px-4 py-4">{booking.serviceType}</td>
                    <td className="px-4 py-4">{dateTime(booking.bookingDate)}</td>
                    <td className="px-4 py-4" onClick={(event) => event.stopPropagation()}>
                      <select className="focus-ring h-9 rounded border border-line bg-white px-2 dark:bg-slate-950" value={booking.employee?.id ?? ""} onChange={(event) => patchBooking(booking.id, { employeeId: event.target.value || null, status: event.target.value ? "ASSIGNED" : booking.status })}>
                        <option value="">Unassigned</option>
                        {employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.name}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-4" onClick={(event) => event.stopPropagation()}>
                      <select className="focus-ring h-9 rounded border border-line bg-white px-2 dark:bg-slate-950" value={booking.status} onChange={(event) => patchBooking(booking.id, { status: event.target.value as BookingStatus })}>
                        {statuses.map((status) => <option key={status}>{status}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-4"><div className="space-y-2"><BookingStatusBadge status={booking.status} /><OperationalBadges booking={booking} /></div></td>
                    <td className="px-4 py-4" onClick={(event) => event.stopPropagation()}>
                      <input className="focus-ring h-9 rounded border border-line bg-white px-2 dark:bg-slate-950" defaultValue={booking.notes ?? ""} onBlur={(event) => patchBooking(booking.id, { notes: event.target.value })} />
                    </td>
                    <td className="px-4 py-4" onClick={(event) => event.stopPropagation()}>
                      <button onClick={() => deleteBooking(booking.id)} className="focus-ring grid h-9 w-9 place-items-center rounded border border-line text-danger" aria-label="Delete booking">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <aside className="space-y-4">
            {selectedBooking ? (
              <article className="rounded border border-line bg-white p-5 shadow-panel dark:bg-slate-900">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand">Booking detail</p>
                <h2 className="mt-2 text-lg font-semibold">{selectedBooking.serviceType}</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{selectedBooking.customer?.companyName} - {dateTime(selectedBooking.bookingDate)}</p>
                <div className="mt-4 flex flex-wrap gap-2"><BookingStatusBadge status={selectedBooking.status} /><OperationalBadges booking={selectedBooking} /></div>
                <div className="mt-5 border-t border-line pt-5"><BookingActivityTimeline booking={selectedBooking} /></div>
              </article>
            ) : null}
            <article className="rounded border border-line bg-white p-5 shadow-panel dark:bg-slate-900">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand">Audit logs</p>
              <div className="mt-4 space-y-3">
                {auditLogs.slice(0, 5).map((log) => (
                  <div key={log.id} className="border-b border-line pb-3 last:border-0 last:pb-0">
                    <p className="text-sm font-semibold">{log.action}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{log.actor?.name ?? "System"} - {log.entity} {log.entityId.slice(0, 8)}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{dateTime(log.createdAt)}</p>
                  </div>
                ))}
                {!auditLogs.length ? <p className="text-sm text-slate-500 dark:text-slate-400">No audit activity recorded yet.</p> : null}
              </div>
            </article>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
