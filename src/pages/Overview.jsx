import { Link } from "react-router-dom";
import { ArrowRight, Battery, Building2, Truck, Zap } from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";
import StatusPill from "../components/StatusPill";
import HeroMetric from "../components/HeroMetric";
import TrendDelta from "../components/TrendDelta";
import { useDepot } from "../context/DepotContext";
import { formatINR, formatSignedINR } from "../lib/format";

function ProfileStat({ icon: Icon, label, value }) {
  return (
    <Card className="flex items-center gap-4 p-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-lg font-semibold text-indigo-950">{value}</p>
      </div>
    </Card>
  );
}

export default function Overview() {
  const { depot, costComparison, simulateChange, resetToNormal, loading } = useDepot();
  const hasActiveAlert = depot.status === "active alert";
  const isGoodNews = hasActiveAlert && costComparison.difference < 0;
  const trendDirection = costComparison.difference > 0 ? "up" : costComparison.difference < 0 ? "down" : "flat";

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-indigo-950">Welcome, Rohit</h1>
          <p className="mt-1 text-slate-500">{depot.name} · {depot.location}</p>
        </div>
        <StatusPill status={depot.status} />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <ProfileStat icon={Building2} label="DISCOM" value={depot.discom} />
        <ProfileStat icon={Truck} label="Vehicles charging" value={`${depot.vehicleCount} ${depot.vehicleType ?? ""}`} />
        <ProfileStat icon={Battery} label="Sanctioned load" value={`${depot.sanctionedLoadKw} kW`} />
      </div>

      <Card
        className={`mb-6 p-6 sm:p-8 ${
          hasActiveAlert ? (isGoodNews ? "border-emerald-200 ring-1 ring-emerald-100" : "border-amber-200 ring-1 ring-amber-100") : ""
        }`}
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <HeroMetric
            size="xl"
            label={hasActiveAlert ? "New expected monthly cost" : "Expected monthly cost"}
            value={formatINR(costComparison.newMonthlyCost)}
            deltaSlot={
              hasActiveAlert ? (
                <TrendDelta direction={trendDirection}>
                  {formatSignedINR(costComparison.difference)} vs last month
                </TrendDelta>
              ) : (
                <TrendDelta direction="flat">Steady vs last month</TrendDelta>
              )
            }
          />

          <div className="flex flex-col gap-3 sm:items-end">
            <Button onClick={simulateChange} disabled={loading}>
              <Zap size={16} />
              Simulate: New Tariff Change Detected
            </Button>
            {hasActiveAlert && (
              <Button variant="secondary" onClick={resetToNormal} disabled={loading}>
                Reset to normal
              </Button>
            )}
          </div>
        </div>

        {hasActiveAlert && (
          <div className={`mt-6 rounded-2xl p-4 text-sm ${isGoodNews ? "bg-emerald-50 text-emerald-900" : "bg-amber-50 text-amber-900"}`}>
            {isGoodNews
              ? "A new tariff change has been detected on your TPDDL connection — and it lowers your expected cost."
              : "A new tariff change has been detected on your TPDDL connection."}{" "}
            <Link to="/alert" className="font-semibold underline underline-offset-2">
              View the full alert
            </Link>
            .
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link to="/cost-comparison">
          <Card className="flex items-center justify-between p-5 transition-shadow hover:shadow-[0_2px_28px_rgba(30,27,75,0.1)]">
            <div>
              <p className="font-semibold text-indigo-950">Cost comparison</p>
              <p className="text-sm text-slate-500">See the before/after breakdown</p>
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
