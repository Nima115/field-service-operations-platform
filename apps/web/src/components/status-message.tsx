export function StatusMessage({ message, tone = "info" }: { message: string; tone?: "info" | "error" | "success" }) {
  const className =
    tone === "error"
      ? "border-rose-200 bg-rose-50 text-rose-700"
      : tone === "success"
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : "border-line bg-slate-50 text-slate-600";

  return <p className={`rounded border px-3 py-2 text-sm ${className}`}>{message}</p>;
}
