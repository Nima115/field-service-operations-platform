import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen bg-field lg:grid-cols-[1fr_520px]">
      <section className="hidden bg-[url('https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center lg:block" />
      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded bg-brand font-bold text-white">SF</span>
            <span className="text-lg font-semibold">ServiceFlow</span>
          </Link>
          <div className="rounded border border-line bg-white p-6 shadow-panel">
            <div className="mb-6 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded bg-slate-100 text-brand">
                <LockKeyhole className="h-5 w-5" />
              </span>
              <div>
                <h1 className="text-xl font-semibold">Sign in</h1>
                <p className="text-sm text-slate-500">Use your workspace credentials to access operations.</p>
              </div>
            </div>
            <LoginForm />
            <div className="mt-5 flex items-center justify-between text-sm">
              <Link href="/register" className="font-medium text-brand">Create account</Link>
              <Link href="/settings" className="font-medium text-slate-600">Reset password</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
