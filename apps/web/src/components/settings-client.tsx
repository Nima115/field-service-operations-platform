"use client";

import { useEffect, useState } from "react";
import { Bell, Globe2, Moon, UserCog } from "lucide-react";
import { apiFetch, authToken, getSession, User } from "@/lib/api";
import { StatusMessage } from "./status-message";

export function SettingsClient() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const session = getSession();
    setUser(session?.user ?? null);
    setEmail(session?.user.email ?? "");
    const token = authToken();
    if (token) apiFetch<User>("/auth/me", { token }).then(setUser).catch(() => undefined);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  async function resetPassword(event: React.FormEvent) {
    event.preventDefault();
    await apiFetch("/auth/reset-password/confirm", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
    setPassword("");
    setMessage("Password updated.");
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {message ? <div className="xl:col-span-2"><StatusMessage tone="success" message={message} /></div> : null}
      <article className="rounded border border-line bg-white p-5 shadow-panel">
        <UserCog className="h-6 w-6 text-brand" />
        <h2 className="mt-4 text-lg font-semibold">Profile</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">{user ? `${user.name} - ${user.email} - ${user.role}` : "Login to view profile details."}</p>
        <form onSubmit={resetPassword} className="mt-4 grid gap-3">
          <input className="focus-ring h-10 rounded border border-line px-3 text-sm" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" />
          <input className="focus-ring h-10 rounded border border-line px-3 text-sm" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="New password" type="password" />
          <button className="focus-ring h-10 rounded bg-brand px-3 text-sm font-semibold text-white">Reset password</button>
        </form>
      </article>
      <article className="rounded border border-line bg-white p-5 shadow-panel">
        <Bell className="h-6 w-6 text-brand" />
        <h2 className="mt-4 text-lg font-semibold">Notifications</h2>
        <label className="mt-4 flex items-center gap-3 text-sm">
          <input type="checkbox" defaultChecked /> Booking updates
        </label>
        <label className="mt-2 flex items-center gap-3 text-sm">
          <input type="checkbox" defaultChecked /> Assignment alerts
        </label>
      </article>
      <article className="rounded border border-line bg-white p-5 shadow-panel">
        <Moon className="h-6 w-6 text-brand" />
        <h2 className="mt-4 text-lg font-semibold">Appearance</h2>
        <label className="mt-4 flex items-center gap-3 text-sm">
          <input type="checkbox" checked={dark} onChange={(event) => setDark(event.target.checked)} /> Dark mode
        </label>
      </article>
      <article className="rounded border border-line bg-white p-5 shadow-panel">
        <Globe2 className="h-6 w-6 text-brand" />
        <h2 className="mt-4 text-lg font-semibold">Language</h2>
        <select className="focus-ring mt-4 h-10 rounded border border-line px-3 text-sm">
          <option>English</option>
          <option>Swedish</option>
        </select>
      </article>
    </div>
  );
}
