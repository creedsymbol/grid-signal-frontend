export const API_BASE = "https://grid-signal-backend-production.up.railway.app";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    ...options,
  });
  if (!res.ok) {
    throw new Error(`GridSignal API ${path} failed with status ${res.status}`);
  }
  return res.json();
}

export const api = {
  getDepot: () => request("/api/depot"),
  simulateChange: () => request("/api/simulate-change", { method: "POST" }),
  resetToNormal: () => request("/api/reset", { method: "POST" }),
  getCostComparison: () => request("/api/cost-comparison"),
  getCostTrend: () => request("/api/cost-trend"),
  getChangeHistory: () => request("/api/change-history"),
  getSettings: () => request("/api/settings"),
  updateSettings: (patch) =>
    request("/api/settings", { method: "PUT", body: JSON.stringify(patch) }),
};

// ---------------------------------------------------------------------------
// Mock data. Mirrors the live API's response shapes exactly, so every screen
// renders identically whether it's reading live data or this fallback.
// ---------------------------------------------------------------------------

export const MOCK = {
  depot: {
    name: "Bawana EV Charging Depot",
    location: "Bawana, North Delhi",
    discom: "TPDDL",
    vehicleCount: 60,
    vehicleType: "e-cargo three-wheelers",
    sanctionedLoadKw: 120,
    status: "no active alert",
  },

  costBaseline: {
    oldMonthlyCost: 245000,
    newMonthlyCost: 245000,
    difference: 0,
    currency: "INR",
    breakdown: [
      {
        component: "Energy charge",
        oldAmount: 196000,
        newAmount: 196000,
        change: 0,
        note: "No revision in effect",
      },
      {
        component: "Demand charge",
        oldAmount: 33000,
        newAmount: 33000,
        change: 0,
        note: "Unchanged — sanctioned load has not been revised",
      },
      {
        component: "PPAC (Power Purchase Adjustment Cost)",
        oldAmount: 16000,
        newAmount: 16000,
        change: 0,
        note: "No revision in effect",
      },
    ],
  },

  // Fixed monthly cost history. The current month is appended dynamically
  // (see pickMockCostTrend) so the trend chart reacts to simulate/reset.
  costTrendHistory: [
    { month: "2026-04", cost: 225000 },
    { month: "2026-05", cost: 227000 },
    { month: "2026-06", cost: 245000 },
    { month: "2026-07", cost: 245000 },
    { month: "2026-08", cost: 245000 },
  ],

  // Scenarios a simulated tariff change can pick from, mirroring the live
  // API's own scenario set exactly so mock and live behave identically.
  scenarios: [
    {
      title: "TPDDL PPAC Revised for October 2026",
      type: "PPAC revision",
      description:
        "TPDDL has revised the Power Purchase Adjustment Cost (PPAC) component of its commercial tariff, effective the October 2026 billing cycle. Combined with an energy charge revision, this is expected to raise your depot's monthly electricity cost — before the bill arrives.",
      costComparison: {
        oldMonthlyCost: 245000,
        newMonthlyCost: 285200,
        difference: 40200,
        currency: "INR",
        breakdown: [
          {
            component: "Energy charge",
            oldAmount: 196000,
            newAmount: 218100,
            change: 22100,
            note: "TPDDL revised the per-unit energy rate for commercial connections",
          },
          {
            component: "Demand charge",
            oldAmount: 33000,
            newAmount: 33000,
            change: 0,
            note: "Unchanged — sanctioned load has not been revised",
          },
          {
            component: "PPAC (Power Purchase Adjustment Cost)",
            oldAmount: 16000,
            newAmount: 34100,
            change: 18100,
            note: "PPAC revised upward for the next billing cycle",
          },
        ],
      },
    },
    {
      title: "TPDDL Revises Night-Time (Off-Peak) Tariff",
      type: "Time-of-Day tariff revision",
      description:
        "TPDDL has revised its Time-of-Day tariff structure, raising the off-peak (11 PM–6 AM) unit rate for commercial connections. Since your fleet charges overnight, this affects the bulk of your energy consumption.",
      costComparison: {
        oldMonthlyCost: 245000,
        newMonthlyCost: 260500,
        difference: 15500,
        currency: "INR",
        breakdown: [
          {
            component: "Energy charge",
            oldAmount: 196000,
            newAmount: 211500,
            change: 15500,
            note: "Off-peak (night) unit rate revised upward",
          },
          {
            component: "Demand charge",
            oldAmount: 33000,
            newAmount: 33000,
            change: 0,
            note: "Unchanged — sanctioned load has not been revised",
          },
          {
            component: "PPAC (Power Purchase Adjustment Cost)",
            oldAmount: 16000,
            newAmount: 16000,
            change: 0,
            note: "No revision in effect",
          },
        ],
      },
    },
    {
      title: "TPDDL Revises Demand Charges for Commercial Connections",
      type: "Demand charge revision",
      description:
        "TPDDL has increased the per-kW demand charge for commercial connections under its latest tariff order. Your sanctioned load of 120 kW means this adds directly to your fixed monthly cost, regardless of usage.",
      costComparison: {
        oldMonthlyCost: 245000,
        newMonthlyCost: 254800,
        difference: 9800,
        currency: "INR",
        breakdown: [
          {
            component: "Energy charge",
            oldAmount: 196000,
            newAmount: 196000,
            change: 0,
            note: "No revision in effect",
          },
          {
            component: "Demand charge",
            oldAmount: 33000,
            newAmount: 42800,
            change: 9800,
            note: "Per-kW demand charge revised upward for commercial connections",
          },
          {
            component: "PPAC (Power Purchase Adjustment Cost)",
            oldAmount: 16000,
            newAmount: 16000,
            change: 0,
            note: "No revision in effect",
          },
        ],
      },
    },
    {
      title: "DERC Revises Cross-Subsidy Surcharge",
      type: "Regulatory revision",
      description:
        "The Delhi Electricity Regulatory Commission revised the cross-subsidy surcharge applicable to commercial connections in its latest tariff order, adding a small increase across all TPDDL commercial bills.",
      costComparison: {
        oldMonthlyCost: 245000,
        newMonthlyCost: 251400,
        difference: 6400,
        currency: "INR",
        breakdown: [
          {
            component: "Energy charge",
            oldAmount: 196000,
            newAmount: 202400,
            change: 6400,
            note: "Cross-subsidy surcharge revised upward by DERC order",
          },
          {
            component: "Demand charge",
            oldAmount: 33000,
            newAmount: 33000,
            change: 0,
            note: "Unchanged — sanctioned load has not been revised",
          },
          {
            component: "PPAC (Power Purchase Adjustment Cost)",
            oldAmount: 16000,
            newAmount: 16000,
            change: 0,
            note: "No revision in effect",
          },
        ],
      },
    },
    {
      title: "TPDDL Introduces Off-Peak EV Charging Incentive",
      type: "Tariff incentive",
      description:
        "TPDDL has introduced a discounted off-peak tariff for registered EV charging connections, effective this billing cycle. Since your fleet charges overnight, this lowers your expected monthly cost.",
      costComparison: {
        oldMonthlyCost: 245000,
        newMonthlyCost: 233000,
        difference: -12000,
        currency: "INR",
        breakdown: [
          {
            component: "Energy charge",
            oldAmount: 196000,
            newAmount: 184000,
            change: -12000,
            note: "New off-peak EV charging incentive rate applied",
          },
          {
            component: "Demand charge",
            oldAmount: 33000,
            newAmount: 33000,
            change: 0,
            note: "Unchanged — sanctioned load has not been revised",
          },
          {
            component: "PPAC (Power Purchase Adjustment Cost)",
            oldAmount: 16000,
            newAmount: 16000,
            change: 0,
            note: "No revision in effect",
          },
        ],
      },
    },
  ],

  changeHistory: [
    {
      id: "chg-2026-06",
      date: "2026-06-01",
      title: "TPDDL PPAC revised, +₹18,000/month",
      type: "PPAC revision",
      impactAmount: 18000,
      impactDirection: "increase",
      currency: "INR",
      description:
        "TPDDL revised the Power Purchase Adjustment Cost (PPAC) component of its commercial tariff, adding roughly ₹18,000/month to depot charging costs.",
    },
    {
      id: "chg-2026-07",
      date: "2026-07-15",
      title: "DERC ruling: CPOs bear upstream infrastructure costs",
      type: "Regulatory ruling",
      impactAmount: null,
      impactDirection: "informational",
      currency: "INR",
      description:
        "The Delhi Electricity Regulatory Commission ruled that charge point operators bear the cost of upstream grid infrastructure upgrades serving North Delhi. No immediate tariff change, but it lays groundwork for future revisions.",
    },
  ],

  settings: {
    discom: "TPDDL",
    typicalMonthlyUsageKwh: 45000,
    peakDemandKw: 110,
    vehicleCount: 60,
    notifyEmail: false,
    notifyEmailAddress: "",
    notifySms: false,
    notifySmsNumber: "",
    notifyThresholdRupees: 5000,
  },
};

// Builds the mock cost-trend response, appending the current month computed
// from whatever cost comparison is active — mirrors the live API's behavior.
export function buildMockCostTrend(currentMonthlyCost) {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  return {
    months: [...MOCK.costTrendHistory, { month: currentMonth, cost: currentMonthlyCost }],
  };
}

let lastMockScenarioIndex = -1;

// Picks a random scenario, avoiding an immediate repeat — mirrors the live
// API's own pickScenario() so mock and live behave the same way.
export function pickMockScenario() {
  const scenarios = MOCK.scenarios;
  if (scenarios.length === 1) return scenarios[0];
  let index;
  do {
    index = Math.floor(Math.random() * scenarios.length);
  } while (index === lastMockScenarioIndex);
  lastMockScenarioIndex = index;
  return scenarios[index];
}
