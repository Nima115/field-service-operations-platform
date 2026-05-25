import { AppShell } from "@/components/app-shell";
import { BookingDetailClient } from "@/components/booking-detail-client";
import { PageHeading } from "@/components/page-heading";

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <AppShell>
      <section className="p-5">
        <PageHeading
          eyebrow="Operations"
          title="Booking record"
          description="Single-job operational context for dispatch review, customer history, invoice follow-up, and field activity."
        />
        <BookingDetailClient bookingId={id} />
      </section>
    </AppShell>
  );
}
