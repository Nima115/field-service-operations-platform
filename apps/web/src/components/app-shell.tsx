"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  BriefcaseBusiness,
  CalendarCheck,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  Users
} from "lucide-react";
import clsx from "clsx";
import { clearSession } from "@/lib/api";

const navItems = [
  { href: "/admin", label: "Admin", icon: LayoutDashboard },
  { href: "/employee", label: "Jobs", icon: BriefcaseBusiness },
  { href: "/customer", label: "Customer", icon: CalendarCheck },
  { href: "/booking", label: "Booking", icon: CalendarCheck },
  { href: "/crm", label: "CRM", icon: Users },
  { href: "/invoices", label: "Invoices", icon: FileText },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-field text-ink">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-line bg-white px-4 py-5 lg:block">
        <Link href="/" className="mb-8 flex items-center gap-3 px-2">
          <span className="grid h-9 w-9 place-items-center rounded bg-brand text-sm font-bold text-white">OP</span>
          <span>
            <span className="block text-base font-semibold">Operations Platform</span>
            <span className="block text-xs text-slate-500">Operations Suite</span>
          </span>
        </Link>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "focus-ring flex h-10 items-center gap-3 rounded px-3 text-sm font-medium",
                  active ? "bg-brand text-white" : "text-slate-600 hover:bg-slate-100 hover:text-ink"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-line bg-white/95 px-5 backdrop-blur">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand">Service operations workspace</p>
            <h1 className="text-lg font-semibold">Service operations command center</h1>
          </div>
          <button
            onClick={() => {
              clearSession();
              router.push("/login");
            }}
            className="focus-ring inline-flex h-9 items-center gap-2 rounded border border-line px-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </header>
        {children}
      </main>
    </div>
  );
}
