import { AppShell } from "@/components/app-shell";
import { CrmClient } from "@/components/crm-client";
import { PageHeading } from "@/components/page-heading";

export default function CrmPage() {
  return (
    <AppShell>
      <section className="p-5">
        <PageHeading
          eyebrow="CRM"
          title="Customer database"
          description="Review customer contact details, booking history, and internal account notes used by dispatch and finance."
        />
        <CrmClient />
      </section>
    </AppShell>
  );
}
