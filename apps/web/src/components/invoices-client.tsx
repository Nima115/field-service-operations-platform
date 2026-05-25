"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Download, FileClock, Plus, Send } from "lucide-react";
import { API_URL, DEMO_MODE, apiFetch, authToken, Booking, Invoice, InvoiceStatus } from "@/lib/api";
import { money } from "@/lib/format";
import { EmptyState, LoadingState } from "./booking-operations";
import { StatusMessage } from "./status-message";

const invoiceTone: Record<InvoiceStatus, string> = {
  DRAFT: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  SENT: "bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-200",
  PAID: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-200",
  OVERDUE: "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-200",
  VOID: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
};

function nextStatuses(status: InvoiceStatus): InvoiceStatus[] {
  if (status === "DRAFT") return ["SENT", "VOID"];
  if (status === "SENT") return ["PAID", "OVERDUE", "VOID"];
  if (status === "OVERDUE") return ["PAID", "VOID"];
  return [];
}

function InvoiceLifecycle({ status }: { status: InvoiceStatus }) {
  const steps: InvoiceStatus[] = ["DRAFT", "SENT", status === "OVERDUE" ? "OVERDUE" : "PAID"];
  return (
    <div className="flex items-center gap-2 text-xs font-semibold">
      {steps.map((step, index) => {
        const active = step === status || (status === "PAID" && step !== "OVERDUE") || (status === "SENT" && step === "DRAFT");
        return (
          <span key={`${step}-${index}`} className={`rounded px-2 py-1 ${active ? invoiceTone[step] : "bg-slate-50 text-slate-400 dark:bg-slate-800/60 dark:text-slate-500"}`}>
            {step}
          </span>
        );
      })}
    </div>
  );
}

export function InvoicesClient() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingId, setBookingId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    const token = authToken();
    if (!token) {
      setLoading(false);
      return setError("Login to view invoices.");
    }
    try {
      setLoading(true);
      const [invoiceRows, bookingRows] = await Promise.all([
        apiFetch<Invoice[]>("/invoices", { token }),
        apiFetch<Booking[]>("/bookings", { token })
      ]);
      setInvoices(invoiceRows);
      setBookings(bookingRows);
      if (!bookingId && bookingRows[0]) setBookingId(bookingRows[0].id);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load invoices");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function createInvoice(event: React.FormEvent) {
    event.preventDefault();
    const token = authToken();
    if (!token) return;
    await apiFetch("/invoices", {
      method: "POST",
      token,
      body: JSON.stringify({ bookingId, amount: Number(amount), status: "DRAFT" })
    });
    setAmount("");
    await load();
  }

  async function updateStatus(id: string, status: InvoiceStatus) {
    const token = authToken();
    if (!token) return;
    await apiFetch(`/invoices/${id}`, { method: "PATCH", token, body: JSON.stringify({ status }) });
    await load();
  }

  async function downloadPdf(id: string) {
    if (DEMO_MODE) {
      const invoice = invoices.find((item) => item.id === id);
      const blob = new Blob([
        `Demo invoice export\n\nInvoice: ${id}\nAmount: ${invoice ? money(Number(invoice.amount)) : "N/A"}\nStatus: ${invoice?.status ?? "N/A"}\n`
      ], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      return;
    }

    const token = authToken();
    if (!token) return;
    const response = await fetch(`${API_URL}/invoices/${id}/pdf`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) {
      setError("PDF export failed");
      return;
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  }

  return (
    <div className="space-y-5">
      {error ? <StatusMessage tone="error" message={error} /> : null}
      <form onSubmit={createInvoice} className="grid gap-3 rounded border border-line bg-white p-4 shadow-panel dark:bg-slate-900 md:grid-cols-[1fr_160px_170px]">
        <select className="focus-ring h-10 rounded border border-line bg-white px-3 text-sm dark:bg-slate-950" value={bookingId} onChange={(event) => setBookingId(event.target.value)}>
          {bookings.map((booking) => <option key={booking.id} value={booking.id}>{booking.serviceType} - {booking.customer?.companyName}</option>)}
        </select>
        <input required className="focus-ring h-10 rounded border border-line bg-white px-3 text-sm dark:bg-slate-950" placeholder="Amount" value={amount} onChange={(event) => setAmount(event.target.value)} />
        <button className="focus-ring inline-flex h-10 items-center justify-center gap-2 rounded bg-brand px-4 text-sm font-semibold text-white">
          <Plus className="h-4 w-4" /> Create draft
        </button>
      </form>

      {loading ? <LoadingState label="Loading invoice lifecycle" /> : null}
      {!loading && !invoices.length ? <EmptyState title="No invoices yet" message="Create a draft invoice from a booking to begin the finance workflow." /> : null}

      {!loading && invoices.length ? (
        <div className="overflow-hidden rounded border border-line bg-white shadow-panel dark:bg-slate-900">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-300">
              <tr>
                <th className="px-4 py-3">Invoice</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Lifecycle</th>
                <th className="px-4 py-3">Next action</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Export</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="px-4 py-4 font-medium">{invoice.id.slice(0, 8)}</td>
                  <td className="px-4 py-4">{invoice.booking?.customer?.companyName ?? "Customer"}</td>
                  <td className="px-4 py-4">{money(Number(invoice.amount))}</td>
                  <td className="px-4 py-4"><InvoiceLifecycle status={invoice.status} /></td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      {nextStatuses(invoice.status).map((status) => (
                        <button key={status} onClick={() => updateStatus(invoice.id, status)} className="focus-ring inline-flex h-8 items-center gap-1 rounded border border-line px-2 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800">
                          {status === "SENT" ? <Send className="h-3.5 w-3.5" /> : status === "PAID" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <FileClock className="h-3.5 w-3.5" />}
                          {status}
                        </button>
                      ))}
                      {!nextStatuses(invoice.status).length ? <span className="text-xs text-slate-500 dark:text-slate-400">Closed</span> : null}
                    </div>
                  </td>
                  <td className="px-4 py-4">{new Date(invoice.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-4">
                    <button onClick={() => downloadPdf(invoice.id)} className="focus-ring grid h-9 w-9 place-items-center rounded border border-line" aria-label="Download PDF">
                      <Download className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
