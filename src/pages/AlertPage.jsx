import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";
import PageHeader from "../components/PageHeader";
import { useDepot } from "../context/DepotContext";
import { formatSignedINR } from "../lib/format";

export default function AlertPage() {
  const { depot, changeHistory, resetToNormal, loading } = useDepot();
  const hasActiveAlert = depot.status === "active alert";
  const latestAlert = hasActiveAlert ? [...changeHistory].reverse()[0] : null;
  const isGoodNews = latestAlert?.impactAmount != null && latestAlert.impactAmount < 0;

  if (!hasActiveAlert || !latestAlert) {
    return (
      <div>
        <PageHeader title="Alert" subtitle="Tariff changes affecting your depot" />
        <Card className="flex flex-col items-center gap-3 px-8 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <ShieldCheck size={26} />
          </div>
          <p className="text-lg font-semibold text-indigo-950">No active alerts</p>
          <p className="max-w-md text-slate-500">
            Your TPDDL connection has no unresolved tariff changes right now. We'll flag it here
            the moment something changes.
          </p>
          <Link to="/">
            <Button variant="ghost">Back to depot overview</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Alert" subtitle="Tariff changes affecting your depot" />

      <Card className={`p-6 ring-1 sm:p-8 ${isGoodNews ? "border-emerald-200 ring-emerald-100" : "border-amber-200 ring-amber-100"}`}>
        <div className="flex items-start gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
              isGoodNews ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
            }`}
          >
            {isGoodNews ? <Sparkles size={22} /> : <AlertTriangle size={22} />}
          </div>
          <div>
            <p className={`text-sm font-medium ${isGoodNews ? "text-emerald-700" : "text-amber-700"}`}>
              {(latestAlert.type ?? "Tariff change").toUpperCase()}
            </p>
            <h2 className="mt-1 text-xl font-bold text-indigo-950">
              {latestAlert.headline ?? latestAlert.title}
            </h2>
          </div>
        </div>

        <p className="mt-5 leading-relaxed text-slate-600">{latestAlert.description}</p>

        {latestAlert.impactAmount != null && (
          <div
            className={`mt-5 inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold ${
              isGoodNews ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
            }`}
          >
            {formatSignedINR(latestAlert.impactAmount)} / month impact
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <Button variant="secondary" onClick={resetToNormal} disabled={loading}>
            Reset to normal
          </Button>
        </div>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link to="/cost-comparison">
          <Card className="flex items-center justify-between p-5 transition-shadow hover:shadow-[0_2px_28px_rgba(30,27,75,0.1)]">
            <div>
              <p className="font-semibold text-indigo-950">See the cost impact</p>
              <p className="text-sm text-slate-500">Full before/after breakdown</p>
            </div>
            <ArrowRight size={18} className="text-indigo-600" />
          </Card>
        </Link>
        <Link to="/history">
          <Card className="flex items-center justify-between p-5 transition-shadow hover:shadow-[0_2px_28px_rgba(30,27,75,0.1)]">
            <div>
              <p className="font-semibold text-indigo-950">Change history</p>
              <p className="text-sm text-slate-500">Past tariff and regulatory changes</p>
            </div>
            <ArrowRight size={18} className="text-indigo-600" />
          </Card>
        </Link>
      </div>
    </div>
  );
}
