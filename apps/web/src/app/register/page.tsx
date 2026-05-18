import Link from "next/link";
import { RegisterForm } from "@/components/register-form";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-field px-6 py-12">
      <div className="w-full max-w-2xl rounded border border-line bg-white p-6 shadow-panel">
        <Link href="/" className="mb-6 inline-flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded bg-brand text-sm font-bold text-white">SF</span>
          <span className="font-semibold">ServiceFlow</span>
        </Link>
        <h1 className="text-2xl font-semibold">Create customer workspace</h1>
        <RegisterForm />
      </div>
    </main>
  );
}
