import { AlertTriangle, CalendarClock, CircleDollarSign, ClipboardList, UserX } from "lucide-react";
import { dateTime } from "@/lib/format";
import type { Booking } from "@/lib/api";

const statusClass = {
  PENDING: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-200",
  CONFIRMED: "bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-200",
  ASSIGNED: "bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-200",
  IN_PROGRESS: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-200",
  COMPLETED: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-200",
  CANCELLED: "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-200"
};

const operationalClass = {
  Delayed: "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-200",
  Unassigned: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  "Awaiting invoice": "bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-200"
};

export function bookingOperationalBadges(booking: Booking) {
  const badges: Array<keyof typeof operationalClass> = [];
  const scheduled = new Date(booking.bookingDate).getTime();
  const done = ["COMPLETED", "CANCELLED"].includes(booking.status);

  if (!booking.employee && !done) badges.push("Unassigned");
  if (scheduled < Date.now() && !done) badges.push("Delayed");
  if (booking.status === "COMPLETED" && !(booking.invoices ?? []).some((invoice) => invoice.status !== "VOID")) {
    badges.push("Awaiting invoice");
  }

  return badges;
}

export function BookingStatusBadge({ status }: { status: Booking["status"] }) {
  return <span className={`rounded px-2 py-1 text-xs font-semibold ${statusClass[status]}`}>{status.replace("_", " ")}</span>;
}

export function OperationalBadges({ booking }: { booking: Booking }) {
  const badges = bookingOperationalBadges(booking);
  if (!badges.length) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {badges.map((badge) => (
        <span key={badge} className={`rounded px-2 py-1 text-xs font-semibold ${operationalClass[badge]}`}>
          {badge}
        </span>
      ))}
    </div>
  );
}

export function BookingActivityTimeline({ booking }: { booking: Booking }) {
  const withDates = booking as Booking & { createdAt?: string; updatedAt?: string };
  const events = [
    { label: "Booking created", detail: booking.customer?.companyName ?? "Customer request", at: withDates.createdAt, icon: ClipboardList },
    booking.employee ? { label: "Admin assigned job", detail: booking.employee.name, at: withDates.updatedAt, icon: UserX } : null,
    { label: `Status ${booking.status.replace("_", " ").toLowerCase()}`, detail: booking.serviceType, at: withDates.updatedAt ?? booking.bookingDate, icon: CalendarClock },
    ...(booking.invoices ?? []).map((invoice) => ({ label: `Invoice ${invoice.status.toLowerCase()}`, detail: `Invoice ${invoice.id.slice(0, 8)}`, at: invoice.createdAt, icon: CircleDollarSign })),
    ...(booking.files ?? []).map((file) => ({ label: "Field file uploaded", detail: file.filePath, at: file.createdAt, icon: AlertTriangle }))
  ].filter(Boolean) as Array<{ label: string; detail: string; at?: string; icon: typeof ClipboardList }>;

  return (
    <div className="space-y-3">
      {events.map((event, index) => {
        const Icon = event.icon;
        return (
          <div key={`${event.label}-${index}`} className="flex gap-3">
            <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-200">
              <Icon className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold">{event.label}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{event.detail}</p>
              {event.at ? <p className="text-xs text-slate-500 dark:text-slate-400">{dateTime(event.at)}</p> : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded border border-dashed border-line bg-white p-6 text-center shadow-panel dark:bg-slate-900">
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{message}</p>
    </div>
  );
}

export function LoadingState({ label = "Loading workspace data" }: { label?: string }) {
  return (
    <div className="grid gap-3 rounded border border-line bg-white p-4 shadow-panel dark:bg-slate-900" aria-live="polite">
      <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{label}</p>
      <div className="grid gap-2">
        <span className="h-3 rounded bg-slate-100 dark:bg-slate-800" />
        <span className="h-3 w-2/3 rounded bg-slate-100 dark:bg-slate-800" />
      </div>
    </div>
  );
}
