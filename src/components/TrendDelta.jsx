import { Minus, TrendingDown, TrendingUp } from "lucide-react";

// direction: "up" (increase), "down" (decrease), "flat" (no change)
// tone: "bad" (red, e.g. cost increase) or "good" (green, e.g. cost decrease) — defaults sensibly from direction
export default function TrendDelta({ direction = "flat", children, tone }) {
  const resolvedTone = tone ?? (direction === "up" ? "bad" : direction === "down" ? "good" : "neutral");

  const colorClass =
    resolvedTone === "bad"
      ? "text-rose-600"
      : resolvedTone === "good"
        ? "text-emerald-600"
        : "text-slate-500";

  const Icon = direction === "up" ? TrendingUp : direction === "down" ? TrendingDown : Minus;

  return (
    <span className={`inline-flex items-center gap-1 text-sm font-medium ${colorClass}`}>
      <Icon size={15} />
      {children}
    </span>
  );
}
