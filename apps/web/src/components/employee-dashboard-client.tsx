"use client";

import { useEffect, useState } from "react";
import { Camera, CheckCircle2, ClipboardList } from "lucide-react";
import Link from "next/link";
import { API_URL, DEMO_MODE, apiFetch, authToken, Booking } from "@/lib/api";
import { dateTime } from "@/lib/format";
import { EmptyState, LoadingState } from "./booking-operations";
import { StatusMessage } from "./status-message";

export function EmployeeDashboardClient() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    const token = authToken();
    if (!token) { setLoading(false); return setError("Login as employee to view assigned jobs."); }
    try {
      setLoading(true);
      setBookings(await apiFetch<Booking[]>("/bookings", { token }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load jobs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function complete(id: string) {
    const token = authToken();
    if (!token) return;
    await apiFetch(`/bookings/${id}`, { method: "PATCH", token, body: JSON.stringify({ status: "COMPLETED" }) });
    await load();
  }

  async function updateNotes(id: string, notes: string) {
    const token = authToken();
    if (!token) return;
    await apiFetch(`/bookings/${id}`, { method: "PATCH", token, body: JSON.stringify({ notes }) });
    await load();
  }

  async function upload(id: string, file?: File) {
    if (DEMO_MODE) {
      if (file) setError(`Demo upload captured for ${id}: ${file.name}`);
      return;
    }

    const token = authToken();
    if (!token || !file) return;
    const body = new FormData();
    body.set("bookingId", id);
    body.set("file", file);
    const response = await fetch(`${API_URL}/upload`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body });
    if (!response.ok) setError("Upload failed");
    await load();
  }

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {error ? <div className="xl:col-span-3"><StatusMessage tone="error" message={error} /></div> : null}
      {loading ? <div className="xl:col-span-3"><LoadingState label="Loading assigned jobs" /></div> : null}
      {!loading && !bookings.length ? <div className="xl:col-span-3"><EmptyState title="No assigned jobs" message="New assignments will appear here when dispatch assigns work." /></div> : null}
      {bookings.map((booking) => (
        <article key={booking.id} className="rounded border border-line bg-white p-5 shadow-panel">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">
                <Link className="text-brand hover:underline" href={`/bookings/${booking.id}`}>{booking.serviceType}</Link>
              </h2>
              <p className="mt-1 text-sm text-slate-500">{booking.customer?.companyName}</p>
            </div>
            <span className="rounded bg-teal-50 px-2 py-1 text-xs font-semibold text-teal-700">{booking.status}</span>
          </div>
          <dl className="mt-5 space-y-3 text-sm">
            <div><dt className="text-slate-500">Schedule</dt><dd className="font-medium">{dateTime(booking.bookingDate)}</dd></div>
            <div>
              <dt className="text-slate-500">Notes</dt>
              <dd><textarea className="focus-ring mt-1 min-h-20 w-full rounded border border-line px-2 py-1" defaultValue={booking.notes ?? ""} onBlur={(event) => updateNotes(booking.id, event.target.value)} /></dd>
            </div>
          </dl>
          <div className="mt-5 flex gap-2">
            <button onClick={() => complete(booking.id)} className="focus-ring inline-flex h-9 items-center gap-2 rounded bg-brand px-3 text-sm font-semibold text-white">
              <CheckCircle2 className="h-4 w-4" /> Complete
            </button>
            <span className="inline-flex h-9 items-center gap-2 rounded border border-line px-3 text-sm font-semibold">
              <ClipboardList className="h-4 w-4" /> Notes
            </span>
            <label className="focus-ring grid h-9 w-9 cursor-pointer place-items-center rounded border border-line" aria-label="Upload photo">
              <Camera className="h-4 w-4" />
              <input className="hidden" type="file" onChange={(event) => upload(booking.id, event.target.files?.[0])} />
            </label>
          </div>
        </article>
      ))}
    </div>
  );
}


