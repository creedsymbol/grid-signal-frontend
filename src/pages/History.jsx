import { ArrowDown, ArrowUp, Info } from "lucide-react";
import Card from "../components/Card";
import PageHeader from "../components/PageHeader";
import { useDepot } from "../context/DepotContext";
import { formatFullDate, formatSignedINR } from "../lib/format";

function ImpactBadge({ direction, amount }) {
  if (direction === "informational" || amount == null) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
        <Info size={12} />
        Informational
      </span>
    );
  }

  const isIncrease = direction === "increase";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
        isIncrease ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"
      }`}
    >
      {isIncrease ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
      {formatSignedINR(amount)}/mo
    </span>
  );
}

export default function History() {
  const { changeHistory } = useDepot();
  const sorted = [...changeHistory].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div>
      <PageHeader title="Change history" subtitle="Past tariff and regulatory changes affecting your depot" />

      {sorted.length === 0 ? (
        <Card className="p-8 text-center text-slate-500">No change events recorded yet.</Card>
      ) : (
        <div className="flex flex-col gap-4">
          {sorted.map((event) => (
            <Card key={event.id} className="p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-400">{formatFullDate(event.date)}</p>
                  <p className="mt-0.5 font-semibold text-indigo-950">{event.title}</p>
                </div>
                <ImpactBadge direction={event.impactDirection} amount={event.impactAmount} />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{event.description}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
