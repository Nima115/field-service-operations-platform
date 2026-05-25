"use client";

import { useEffect, useState } from "react";
import { CalendarPlus, FileText, MessageSquareText } from "lucide-react";
import Link from "next/link";
import { apiFetch, authToken, Booking, Invoice, Notification } from "@/lib/api";
import { BookingTable } from "./booking-table";
import { StatCard } from "./stat-card";
import { EmptyState, LoadingState } from "./booking-operations";
import { StatusMessage } from "./status-message";

export function CustomerDashboardClient() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    const token = authToken();
    if (!token) { setLoading(false); return setError("Login as customer to view account activity."); }
    try {
      setLoading(true);
      const [bookingRows, invoiceRows, notificationRows] = await Promise.all([
        apiFetch<Booking[]>("/bookings", { token }),
        apiFetch<Invoice[]>("/invoices", { token }),
        apiFetch<Notification[]>("/notifications", { token })
      ]);
      setBookings(bookingRows);
      setInvoices(invoiceRows);
      setNotifications(notificationRows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load customer dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function markRead(id: string) {
    const token = authToken();
    if (!token) return;
    await apiFetch(`/notifications/${id}/read`, { method: "PATCH", token });
    await load();
  }

  return (
    <div className="space-y-6">
      {error ? <StatusMessage tone="error" message={error} /> : null}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Upcoming bookings" value={String(bookings.length)} detail="Scheduled and in-progress requests" icon={CalendarPlus} />
        <StatCard label="Open invoices" value={String(invoices.filter((invoice) => invoice.status !== "PAID").length)} detail="Invoices waiting for payment" icon={FileText} />
        <StatCard label="Unread updates" value={String(notifications.filter((item) => !item.readStatus).length)} detail="Booking confirmations and notes" icon={MessageSquareText} />
      </div>
      <div className="flex justify-end">
        <Link href="/booking" className="focus-ring rounded bg-brand px-4 py-2 text-sm font-semibold text-white">New booking</Link>
      </div>
      {loading ? <LoadingState label="Loading customer activity" /> : <BookingTable bookings={bookings} />}
      <div className="rounded border border-line bg-white p-5 shadow-panel">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <div className="mt-3 space-y-2">
          {!loading && !notifications.length ? <EmptyState title="No notifications" message="Booking updates and invoice messages will appear here." /> : null}
          {notifications.map((notification) => (
            <button key={notification.id} onClick={() => markRead(notification.id)} className="focus-ring block w-full rounded border border-line px-3 py-2 text-left text-sm hover:bg-slate-50">
              <span className="font-medium">{notification.message}</span>
              <span className="ml-2 text-xs text-slate-500">{notification.readStatus ? "Read" : "Unread"}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}


