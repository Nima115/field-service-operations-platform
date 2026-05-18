"use client";

import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { apiFetch, authToken, Customer, Service, getSession } from "@/lib/api";
import { StatusMessage } from "./status-message";

export function BookingForm() {
  const [services, setServices] = useState<Service[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    serviceId: "",
    serviceType: "Commercial Cleaning",
    customerId: "",
    date: "",
    time: "",
    notes: ""
  });

  useEffect(() => {
    const token = authToken();
    apiFetch<Service[]>("/services").then((items) => {
      setServices(items);
      if (items[0]) setForm((current) => ({ ...current, serviceId: items[0].id, serviceType: items[0].title }));
    });

    if (token && getSession()?.user.role !== "CUSTOMER") {
      apiFetch<Customer[]>("/customers", { token }).then(setCustomers).catch(() => setCustomers([]));
    }
  }, []);

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const token = authToken();
    if (!token) {
      setError("Please login before creating a booking.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      await apiFetch("/bookings", {
        method: "POST",
        token,
        body: JSON.stringify({
          customerId: form.customerId || undefined,
          serviceId: form.serviceId || undefined,
          serviceType: form.serviceType,
          bookingDate: new Date(`${form.date}T${form.time || "09:00"}`).toISOString(),
          notes: form.notes
        })
      });
      setMessage("Booking created and sent to operations.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="rounded border border-line bg-white p-5 shadow-panel" onSubmit={onSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        {error ? <div className="md:col-span-2"><StatusMessage tone="error" message={error} /></div> : null}
        {message ? <div className="md:col-span-2"><StatusMessage tone="success" message={message} /></div> : null}
        <label className="block text-sm font-medium">
          Service type
          <select
            className="focus-ring mt-1 h-11 w-full rounded border border-line px-3"
            value={form.serviceId}
            onChange={(event) => {
              const service = services.find((item) => item.id === event.target.value);
              update("serviceId", event.target.value);
              update("serviceType", service?.title ?? event.target.value);
            }}
          >
            {services.map((service) => (
              <option key={service.id} value={service.id}>{service.title}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium">
          Customer
          {customers.length ? (
            <select className="focus-ring mt-1 h-11 w-full rounded border border-line px-3" value={form.customerId} onChange={(event) => update("customerId", event.target.value)}>
              <option value="">Select customer</option>
              {customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.companyName}</option>)}
            </select>
          ) : (
            <input className="focus-ring mt-1 h-11 w-full rounded border border-line px-3" value="Current customer account" readOnly />
          )}
        </label>
        <label className="block text-sm font-medium">
          Date
          <input required className="focus-ring mt-1 h-11 w-full rounded border border-line px-3" type="date" value={form.date} onChange={(event) => update("date", event.target.value)} />
        </label>
        <label className="block text-sm font-medium">
          Time
          <input required className="focus-ring mt-1 h-11 w-full rounded border border-line px-3" type="time" value={form.time} onChange={(event) => update("time", event.target.value)} />
        </label>
        <label className="block text-sm font-medium md:col-span-2">
          Notes
          <textarea className="focus-ring mt-1 min-h-32 w-full rounded border border-line px-3 py-2" value={form.notes} onChange={(event) => update("notes", event.target.value)} />
        </label>
      </div>
      <button disabled={loading} className="focus-ring mt-5 inline-flex h-11 items-center gap-2 rounded bg-brand px-4 text-sm font-semibold text-white disabled:opacity-60">
        <Send className="h-4 w-4" />
        {loading ? "Creating..." : "Confirm booking"}
      </button>
    </form>
  );
}
