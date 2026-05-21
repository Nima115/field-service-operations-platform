import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { clientCase } from "@/lib/business-case";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-field text-ink">
      <section className="relative min-h-[92vh] overflow-hidden bg-[url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center">
        <div className="absolute inset-0 bg-ink/70" />
        <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-between px-6 py-6">
          <nav className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded bg-brand font-bold">OP</span>
              <span className="text-lg font-semibold">Operations Platform</span>
            </div>
            <Link href="/login" className="focus-ring rounded bg-white px-4 py-2 text-sm font-semibold text-ink">
              Login
            </Link>
          </nav>
          <div className="max-w-3xl pb-20 text-white">
            <h1 className="text-5xl font-semibold tracking-normal md:text-7xl">Operations Platform</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85">
              A business operations platform modeled for {clientCase.client}, replacing spreadsheet-driven
              dispatch, fragmented customer records, and manual invoice follow-up with one secure workspace.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/admin"
                className="focus-ring inline-flex items-center gap-2 rounded bg-brand px-5 py-3 text-sm font-semibold text-white"
              >
                Open workspace <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/booking"
                className="focus-ring rounded border border-white/40 px-5 py-3 text-sm font-semibold text-white"
              >
                Create booking
              </Link>
            </div>
          </div>
          <div className="grid gap-3 pb-4 text-white md:grid-cols-3">
            {["Facilities-services case", "Role-based operations", "Booking-to-invoice workflow"].map((item) => (
              <div key={item} className="flex items-center gap-2 border-t border-white/25 pt-3 text-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-10 md:grid-cols-3">
        {[
          ["Business problem", clientCase.challenge],
          ["Solution build", clientCase.outcome],
          ["Business outcome", "Reduce coordination time, accelerate invoice turnaround, and give leadership reliable operating metrics."]
        ].map(([title, body]) => (
          <article key={title} className="rounded border border-line bg-white p-5 shadow-panel">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
          </article>
        ))}
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-12">
        <div className="rounded border border-line bg-white p-5 shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">Business case</p>
          <h2 className="mt-1 text-xl font-semibold">{clientCase.client}</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-4">
            {clientCase.metrics.map((metric) => (
              <div key={metric.label} className="border-t border-line pt-3">
                <p className="text-2xl font-semibold">{metric.value}</p>
                <p className="mt-1 text-sm text-slate-600">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
