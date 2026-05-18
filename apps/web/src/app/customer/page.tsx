import { AppShell } from "@/components/app-shell";
import { CustomerDashboardClient } from "@/components/customer-dashboard-client";
import { PageHeading } from "@/components/page-heading";

export default function CustomerDashboard() {
  return (
    <AppShell>
      <section className="p-5">
        <PageHeading
          eyebrow="Customer dashboard"
          title="Bookings and account activity"
          description="Customers can create service requests, follow status updates, view invoice history, and manage contact details."
        />
        <CustomerDashboardClient />
      </section>
    </AppShell>
  );
}
