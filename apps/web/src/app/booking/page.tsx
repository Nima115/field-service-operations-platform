import { CalendarDays } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { BookingForm } from "@/components/booking-form";
import { PageHeading } from "@/components/page-heading";
import { clientCase } from "@/lib/business-case";

export default function BookingPage() {
  return (
    <AppShell>
      <section className="p-5">
        <PageHeading
          eyebrow="Booking"
          title="Create service booking"
          description={`Customer request intake for ${clientCase.client}: capture the requested service, preferred date, customer context, and internal notes before dispatch reviews the booking.`}
        />
        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <BookingForm />
          <aside className="rounded border border-line bg-white p-5 shadow-panel">
            <CalendarDays className="h-8 w-8 text-brand" />
            <h2 className="mt-4 text-lg font-semibold">Booking confirmation</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Confirmed bookings trigger customer email confirmation, admin visibility, and assignment notifications when an employee is selected. This directly addresses the old email-and-spreadsheet dispatch process.
            </p>
          </aside>
        </div>
      </section>
    </AppShell>
  );
}
