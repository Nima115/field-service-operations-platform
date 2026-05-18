import { AppShell } from "@/components/app-shell";
import { InvoicesClient } from "@/components/invoices-client";
import { PageHeading } from "@/components/page-heading";

export default function InvoicesPage() {
  return (
    <AppShell>
      <section className="p-5">
        <PageHeading
          eyebrow="Invoices"
          title="Invoice history"
          description="Generate invoices from completed work, track paid and unpaid revenue, and export customer-ready PDF files."
        />
        <InvoicesClient />
      </section>
    </AppShell>
  );
}
