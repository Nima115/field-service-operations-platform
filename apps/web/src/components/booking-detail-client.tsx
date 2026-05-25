"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarClock, FileText, Paperclip, UserRound } from "lucide-react";
import { apiFetch, authToken, Booking } from "@/lib/api";
import { dateTime, money } from "@/lib/format";
import { BookingActivityTimeline, BookingStatusBadge, EmptyState, LoadingState, OperationalBadges } from "./booking-operations";
import { StatusMessage } from "./status-message";

export function BookingDetailClient({ bookingId }: { bookingId: string }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = authToken();
    if (!token) {
      setLoading(false);
      setError("Login to view booking records.");
      return;
    }

    apiFetch<Booking[]>("/bookings", { token })
      .then(setBookings)
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load booking record"))
      .finally(() => setLoading(false));
  }, []);

  const booking = useMemo(() => bookings.find((item) => item.id === bookingId), [bookingId, bookings]);

  if (error) return <StatusMessage tone="error" message={error} />;
  if (loading) return <LoadingState label="Loading booking record" />;
  if (!booking) return <EmptyState title="Booking record unavailable" message="The booking may be outside the current user's operational scope or no longer active." />;

  return (
    <div className="space-y-5">
      <Link href="/admin" className="focus-ring inline-flex h-9 items-center gap-2 rounded border border-line px-3 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800">
        <ArrowLeft className="h-4 w-4" />
        Operations queue
      </Link>

      <section className="rounded border border-line bg-white p-5 shadow-panel dark:bg-slate-900">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand">Booking record</p>
            <h2 className="mt-2 text-2xl font-semibold">{booking.serviceType}</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{booking.customer?.companyName ?? "Customer"} - {booking.id}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <BookingStatusBadge status={booking.status} />
            <OperationalBadges booking={booking} />
          </div>
        </div>

        <dl className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded border border-line p-4">
            <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500"><CalendarClock className="h-4 w-4" /> Schedule</dt>
            <dd className="mt-2 text-sm font-medium">{dateTime(booking.bookingDate)}</dd>
          </div>
          <div className="rounded border border-line p-4">
            <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500"><UserRound className="h-4 w-4" /> Assignment</dt>
            <dd className="mt-2 text-sm font-medium">{booking.employee?.name ?? "Unassigned"}</dd>
          </div>
          <div className="rounded border border-line p-4">
            <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500"><FileText className="h-4 w-4" /> Invoices</dt>
            <dd className="mt-2 text-sm font-medium">{booking.invoices?.length ?? 0} linked invoice{booking.invoices?.length === 1 ? "" : "s"}</dd>
          </div>
        </dl>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <section className="rounded border border-line bg-white p-5 shadow-panel dark:bg-slate-900">
          <h3 className="text-lg font-semibold">Activity timeline</h3>
          <div className="mt-4">
            <BookingActivityTimeline booking={booking} />
          </div>
        </section>

        <aside className="space-y-5">
          <section className="rounded border border-line bg-white p-5 shadow-panel dark:bg-slate-900">
            <h3 className="text-lg font-semibold">Notes</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{booking.notes || "No internal notes recorded."}</p>
          </section>

          <section className="rounded border border-line bg-white p-5 shadow-panel dark:bg-slate-900">
            <h3 className="text-lg font-semibold">Invoice history</h3>
            <div className="mt-3 space-y-3">
              {!booking.invoices?.length ? <p className="text-sm text-slate-500 dark:text-slate-400">No invoices have been generated for this booking.</p> : null}
              {booking.invoices?.map((invoice) => (
                <div key={invoice.id} className="rounded border border-line p-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium">{invoice.id.slice(0, 8)}</span>
                    <span>{invoice.status}</span>
                  </div>
                  <p className="mt-1 text-slate-500 dark:text-slate-400">{money(Number(invoice.amount))}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded border border-line bg-white p-5 shadow-panel dark:bg-slate-900">
            <h3 className="flex items-center gap-2 text-lg font-semibold"><Paperclip className="h-5 w-5 text-brand" /> Files</h3>
            <div className="mt-3 space-y-2">
              {!booking.files?.length ? <p className="text-sm text-slate-500 dark:text-slate-400">No field files uploaded.</p> : null}
              {booking.files?.map((file) => (
                <p key={file.id} className="rounded border border-line px-3 py-2 text-sm">{file.filePath}</p>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
