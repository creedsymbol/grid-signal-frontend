const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatINR(amount) {
  if (amount === null || amount === undefined) return "—";
  return inrFormatter.format(amount);
}

export function formatSignedINR(amount) {
  if (amount === null || amount === undefined) return "—";
  const sign = amount > 0 ? "+" : amount < 0 ? "−" : "";
  return `${sign}${inrFormatter.format(Math.abs(amount))}`;
}

export function formatMonthYear(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}

export function formatFullDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

// "2026-04" -> "Apr 2026"
export function formatMonthLabel(yearMonth) {
  if (!yearMonth) return "";
  const [year, month] = yearMonth.split("-");
  const d = new Date(Number(year), Number(month) - 1, 1);
  return d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}
