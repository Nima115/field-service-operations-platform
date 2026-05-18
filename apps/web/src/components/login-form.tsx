"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import { StatusMessage } from "./status-message";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@serviceflow.local");
  const [password, setPassword] = useState("Password123!");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const session = await login(email, password);
      router.push(session.user.role === "EMPLOYEE" ? "/employee" : session.user.role === "CUSTOMER" ? "/customer" : "/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      {error ? <StatusMessage tone="error" message={error} /> : null}
      <label className="block text-sm font-medium">
        Email
        <input className="focus-ring mt-1 h-11 w-full rounded border border-line px-3" value={email} onChange={(event) => setEmail(event.target.value)} />
      </label>
      <label className="block text-sm font-medium">
        Password
        <input className="focus-ring mt-1 h-11 w-full rounded border border-line px-3" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
      </label>
      <button disabled={loading} className="focus-ring h-11 w-full rounded bg-brand text-sm font-semibold text-white disabled:opacity-60">
        {loading ? "Signing in..." : "Login"}
      </button>
    </form>
  );
}
