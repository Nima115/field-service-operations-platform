import { AppShell } from "@/components/app-shell";
import { AnalyticsClient } from "@/components/analytics-client";
import { PageHeading } from "@/components/page-heading";
import { clientCase } from "@/lib/business-case";

export default function AnalyticsPage() {
  return (
    <AppShell>
      <section className="p-5">
        <PageHeading
          eyebrow="Analytics"
          title="Revenue and service trends"
          description={`Leadership reporting for ${clientCase.client}: track monthly revenue, completed bookings, customer growth, and demand by service type.`}
        />
        <AnalyticsClient />
      </section>
    </AppShell>
  );
}
