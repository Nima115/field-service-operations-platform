"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/lib/api";
import { StatusMessage } from "./status-message";

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", companyName: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await register(form);
      router.push("/customer");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
      {error ? <div className="md:col-span-2"><StatusMessage tone="error" message={error} /></div> : null}
      {[
        ["name", "Name"],
        ["companyName", "Company name"],
        ["email", "Email"],
        ["phone", "Phone"]
      ].map(([field, label]) => (
        <label key={field} className="block text-sm font-medium">
          {label}
          <input className="focus-ring mt-1 h-11 w-full rounded border border-line px-3" value={form[field as keyof typeof form]} onChange={(event) => update(field as keyof typeof form, event.target.value)} />
        </label>
      ))}
      <label className="block text-sm font-medium md:col-span-2">
        Password
        <input className="focus-ring mt-1 h-11 w-full rounded border border-line px-3" type="password" value={form.password} onChange={(event) => update("password", event.target.value)} />
      </label>
      <button disabled={loading} className="focus-ring h-11 rounded bg-brand text-sm font-semibold text-white disabled:opacity-60 md:col-span-2">
        {loading ? "Creating account..." : "Register"}
      </button>
    </form>
  );
}
