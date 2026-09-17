import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Card from "../components/Card";
import PageHeader from "../components/PageHeader";
import HeroMetric from "../components/HeroMetric";
import TrendDelta from "../components/TrendDelta";
import { useDepot } from "../context/DepotContext";
import { formatINR, formatSignedINR } from "../lib/format";

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-black/5 bg-white px-3 py-2 shadow-lg">
      <p className="text-xs text-slate-500">{payload[0].payload.name}</p>
      <p className="text-sm font-semibold text-indigo-950">{formatINR(payload[0].value)}</p>
    </div>
  );
}

function BreakdownRow({ item }) {
  const direction = item.change > 0 ? "up" : item.change < 0 ? "down" : "flat";

  return (
    <div className="flex flex-col gap-2 border-b border-black/5 py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-semibold text-indigo-950">{item.component}</p>
        {item.note && <p className="mt-0.5 text-sm text-slate-500">{item.note}</p>}
      </div>
      <div className="flex items-center gap-3 sm:justify-end">
        <span className="text-sm text-slate-400">{formatINR(item.oldAmount)}</span>
        <span className="text-slate-300">→</span>
        <span className="text-sm font-medium text-indigo-950">{formatINR(item.newAmount)}</span>
        <TrendDelta direction={direction}>
          {item.change === 0 ? "No change" : formatSignedINR(item.change)}
        </TrendDelta>
      </div>
    </div>
  );
}

export default function CostComparison() {
  const { costComparison } = useDepot();
  const hasChange = costComparison.difference !== 0;
  const trendDirection = costComparison.difference > 0 ? "up" : costComparison.difference < 0 ? "down" : "flat";

  const chartData = [
    { name: "Last month", amount: costComparison.oldMonthlyCost },
    { name: "This month", amount: costComparison.newMonthlyCost },
  ];

  return (
    <div>
      <PageHeader title="Cost comparison" subtitle="What your next TPDDL bill is expected to look like" />

      <Card className="mb-6 p-6 sm:p-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
          <div className="lg:w-72 lg:shrink-0">
            <HeroMetric
              size="xl"
              label={hasChange ? "New expected monthly cost" : "Expected monthly cost"}
              value={formatINR(costComparison.newMonthlyCost)}
              deltaSlot={
                hasChange ? (
                  <TrendDelta direction={trendDirection}>
                    {formatSignedINR(costComparison.difference)} vs {formatINR(costComparison.oldMonthlyCost)} last month
                  </TrendDelta>
                ) : (
                  <TrendDelta direction="flat">No change vs {formatINR(costComparison.oldMonthlyCost)} last month</TrendDelta>
                )
              }
            />
          </div>

          <div className="h-56 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }} barCategoryGap="35%">
                <CartesianGrid vertical={false} stroke="#eef0f4" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 13 }} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                  width={48}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "#f8fafc" }} />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]} maxBarSize={72}>
                  <Cell fill="#c7d2fe" />
                  <Cell fill="#4338ca" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      <Card className="p-6 sm:p-8">
        <p className="mb-2 font-semibold text-indigo-950">Breakdown by component</p>
        <div>
          {costComparison.breakdown.map((item) => (
            <BreakdownRow key={item.component} item={item} />
          ))}
        </div>
      </Card>
    </div>
  );
}
