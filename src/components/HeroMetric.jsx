export default function HeroMetric({ label, value, deltaSlot, size = "lg" }) {
  const valueSize = size === "xl" ? "text-5xl" : "text-4xl";

  return (
    <div>
      <p className="text-sm font-medium text-slate-500 mb-2">{label}</p>
      <p className={`${valueSize} font-bold text-indigo-950 tracking-tight leading-none`}>{value}</p>
      {deltaSlot && <div className="mt-3">{deltaSlot}</div>}
    </div>
  );
}
