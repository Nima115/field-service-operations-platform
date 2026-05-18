"use client";

import { useEffect, useState } from "react";
import { Download, Plus } from "lucide-react";
import { API_URL, apiFetch, authToken, Booking, Invoice, InvoiceStatus } from "@/lib/api";
import { money } from "@/lib/format";
import { StatusMessage } from "./status-message";

export function InvoicesClient() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingId, setBookingId] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const token = authToken();
    if (!token) return setError("Login to view invoices.");
    try {
      const [invoiceRows, bookingRows] = await Promise.all([
        apiFetch<Invoice[]>("/invoices", { token }),
        apiFetch<Booking[]>("/bookings", { token })
      ]);
      setInvoices(invoiceRows);
      setBookings(bookingRows);
      if (bookingRows[0]) setBookingId(bookingRows[0].id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load invoices");
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
      body: JSON.stringify({ bookingId, amount: Number(amount), status: "SENT" })
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
      <form onSubmit={createInvoice} className="grid gap-3 rounded border border-line bg-white p-4 shadow-panel md:grid-cols-[1fr_160px_160px]">
        <select className="focus-ring h-10 rounded border border-line px-3 text-sm" value={bookingId} onChange={(event) => setBookingId(event.target.value)}>
          {bookings.map((booking) => <option key={booking.id} value={booking.id}>{booking.serviceType} - {booking.customer?.companyName}</option>)}
        </select>
        <input required className="focus-ring h-10 rounded border border-line px-3 text-sm" placeholder="Amount" value={amount} onChange={(event) => setAmount(event.target.value)} />
        <button className="focus-ring inline-flex h-10 items-center justify-center gap-2 rounded bg-brand px-4 text-sm font-semibold text-white">
          <Plus className="h-4 w-4" /> Generate
        </button>
      </form>
      <div className="overflow-hidden rounded border border-line bg-white shadow-panel">
        <table className="w-full min-w-[780px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Invoice</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
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
                <td className="px-4 py-4">
                  <select className="focus-ring h-9 rounded border border-line px-2" value={invoice.status} onChange={(event) => updateStatus(invoice.id, event.target.value as InvoiceStatus)}>
                    {["DRAFT", "SENT", "PAID", "OVERDUE", "VOID"].map((status) => <option key={status}>{status}</option>)}
                  </select>
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
    </div>
  );
}
