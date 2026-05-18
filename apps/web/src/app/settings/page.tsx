import { AppShell } from "@/components/app-shell";
import { PageHeading } from "@/components/page-heading";
import { SettingsClient } from "@/components/settings-client";

export default function SettingsPage() {
  return (
    <AppShell>
      <section className="p-5">
        <PageHeading
          eyebrow="Settings"
          title="Profile and workspace preferences"
          description="Manage profile data, notification preferences, dark mode, language, and integration settings."
        />
        <SettingsClient />
      </section>
    </AppShell>
  );
}
