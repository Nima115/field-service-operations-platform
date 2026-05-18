import { AppShell } from "@/components/app-shell";
import { AdminDashboardClient } from "@/components/admin-dashboard-client";
import { PageHeading } from "@/components/page-heading";
import { clientCase } from "@/lib/business-case";

export default function AdminDashboard() {
  return (
    <AppShell>
      <section className="p-5">
        <PageHeading
          eyebrow="Admin dashboard"
          title={`${clientCase.client} operating picture`}
          description="Built for the operations manager to replace spreadsheet dispatch with live booking visibility, employee assignment, customer context, and revenue indicators."
        />
        <AdminDashboardClient />
        <div className="mt-6 rounded border border-line bg-white p-5 shadow-panel">
          <h2 className="text-lg font-semibold">Business case workflow</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-5">
            {clientCase.workflows.map((workflow, index) => (
              <div key={workflow} className="rounded border border-line bg-slate-50 p-3 text-sm">
                <span className="text-xs font-semibold text-brand">Step {index + 1}</span>
                <p className="mt-2 font-medium">{workflow}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
