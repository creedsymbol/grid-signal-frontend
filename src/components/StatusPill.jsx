import { AlertTriangle, CheckCircle2 } from "lucide-react";

export default function StatusPill({ status }) {
  const isActive = status === "active alert";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ${
        isActive ? "bg-amber-50 text-amber-800" : "bg-emerald-50 text-emerald-700"
      }`}
    >
      {isActive ? <AlertTriangle size={14} /> : <CheckCircle2 size={14} />}
      {isActive ? "Active alert" : "No active alert"}
    </span>
  );
}
