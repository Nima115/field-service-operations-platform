"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, Plus, StickyNote } from "lucide-react";
import { apiFetch, authToken, Customer } from "@/lib/api";
import { StatusMessage } from "./status-message";

export function CrmClient() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ companyName: "", email: "", phone: "", notes: "" });

  async function load() {
    const token = authToken();
    if (!token) return setError("Login as admin or employee to view CRM records.");
    try {
      setCustomers(await apiFetch<Customer[]>("/customers", { token }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load customers");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function createCustomer(event: React.FormEvent) {
    event.preventDefault();
    const token = authToken();
    if (!token) return;
    await apiFetch<Customer>("/customers", { method: "POST", token, body: JSON.stringify(form) });
    setForm({ companyName: "", email: "", phone: "", notes: "" });
    await load();
  }

  return (
    <div className="space-y-5">
      {error ? <StatusMessage tone="error" message={error} /> : null}
      <form onSubmit={createCustomer} className="grid gap-3 rounded border border-line bg-white p-4 shadow-panel md:grid-cols-5">
        <input className="focus-ring h-10 rounded border border-line px-3 text-sm" placeholder="Company" value={form.companyName} onChange={(event) => setForm({ ...form, companyName: event.target.value })} />
        <input className="focus-ring h-10 rounded border border-line px-3 text-sm" placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        <input className="focus-ring h-10 rounded border border-line px-3 text-sm" placeholder="Phone" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
        <input className="focus-ring h-10 rounded border border-line px-3 text-sm" placeholder="Notes" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
        <button className="focus-ring inline-flex h-10 items-center justify-center gap-2 rounded bg-brand px-3 text-sm font-semibold text-white">
          <Plus className="h-4 w-4" /> Add
        </button>
      </form>
      <div className="grid gap-4 xl:grid-cols-3">
        {customers.map((customer) => (
          <article key={customer.id} className="rounded border border-line bg-white p-5 shadow-panel">
            <h2 className="text-lg font-semibold">{customer.companyName}</h2>
            <div className="mt-4 space-y-3 text-sm">
              <p className="flex items-center gap-2 text-slate-600"><Mail className="h-4 w-4" /> {customer.email}</p>
              <p className="flex items-center gap-2 text-slate-600"><Phone className="h-4 w-4" /> {customer.phone ?? "No phone"}</p>
              <p className="flex items-center gap-2 text-slate-600"><StickyNote className="h-4 w-4" /> {customer.notes ?? "No internal notes"}</p>
            </div>
            <p className="mt-5 rounded bg-slate-50 px-3 py-2 text-sm font-medium">{customer.bookings?.length ?? 0} bookings on record</p>
          </article>
        ))}
      </div>
    </div>
  );
}
