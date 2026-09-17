export const API_BASE = "https://grid-signal-backend-production.up.railway.app";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
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

  costAfterAlert: {
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

  simulatedAlert: {
    title: "TPDDL PPAC Revised for October 2026",
    type: "PPAC revision",
    headline: "TPDDL PPAC Revised for October 2026",
    description:
      "TPDDL has revised the Power Purchase Adjustment Cost (PPAC) component of its commercial tariff, effective the October 2026 billing cycle. Combined with an energy charge revision, this is expected to raise your depot's monthly electricity cost by approximately ₹40,200 — before the bill arrives.",
    impactAmount: 40200,
    impactDirection: "increase",
    currency: "INR",
  },

  settings: {
    discom: "TPDDL",
    typicalMonthlyUsageKwh: 45000,
    peakDemandKw: 110,
    vehicleCount: 60,
  },
};
