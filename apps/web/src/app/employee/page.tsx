import { AppShell } from "@/components/app-shell";
import { EmployeeDashboardClient } from "@/components/employee-dashboard-client";
import { PageHeading } from "@/components/page-heading";
import { clientCase } from "@/lib/business-case";

export default function EmployeeDashboard() {
  return (
    <AppShell>
      <section className="p-5">
        <PageHeading
          eyebrow="Employee dashboard"
          title="Assigned jobs"
          description={`Field workflow for ${clientCase.client}: employees review job context, add internal notes, upload work photos, and mark assigned bookings as completed.`}
        />
        <EmployeeDashboardClient />
      </section>
    </AppShell>
  );
}
