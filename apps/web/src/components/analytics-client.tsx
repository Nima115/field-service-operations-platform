"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AnalyticsOverview, apiFetch, authToken } from "@/lib/api";
import { StatusMessage } from "./status-message";

export function AnalyticsClient() {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = authToken();
    if (!token) {
      setError("Login as admin to view analytics.");
      return;
    }
    apiFetch<AnalyticsOverview>("/analytics/overview", { token }).then(setOverview).catch((err) => setError(err instanceof Error ? err.message : "Unable to load analytics"));
  }, []);

  if (error) return <StatusMessage tone="error" message={error} />;

  return (
    <div className="rounded border border-line bg-white p-5 shadow-panel">
      <div className="mb-5 grid gap-3 md:grid-cols-3">
        <div className="rounded bg-slate-50 p-3"><p className="text-sm text-slate-500">Revenue</p><p className="text-xl font-semibold">{overview?.monthlyRevenue ?? 0}</p></div>
        <div className="rounded bg-slate-50 p-3"><p className="text-sm text-slate-500">Completed</p><p className="text-xl font-semibold">{overview?.completedBookings ?? 0}</p></div>
        <div className="rounded bg-slate-50 p-3"><p className="text-sm text-slate-500">Customers</p><p className="text-xl font-semibold">{overview?.customerGrowth ?? 0}</p></div>
      </div>
      <div className="h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={overview?.serviceTrends ?? []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="serviceType" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="bookings" fill="#1f7a6f" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
