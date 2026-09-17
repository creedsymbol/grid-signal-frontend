# Grid Signal

A React + Tailwind frontend for **Grid Signal** — a tool that helps operations
managers running EV charging depots in Delhi track electricity tariff changes
and see the cost impact before the bill arrives.

Built for Rohit, who runs a depot in Bawana, North Delhi on a TPDDL commercial
connection, charging ~60 e-cargo three-wheelers overnight.

## Run

```bash
npm install
npm run dev       # http://localhost:5173
```

```bash
npm run build      # production build to dist/
npm run preview    # preview the production build locally
```

## Backend

Talks to the [Grid Signal API](https://grid-signal-backend-production.up.railway.app)
directly via `fetch`. If any call fails, the app falls back to hardcoded demo
data automatically (see `src/lib/api.js`) so every screen always renders.

## Screens

- **Depot overview** (`/`) — profile summary, expected monthly cost, and the
  "Simulate: New Tariff Change Detected" / "Reset to normal" controls.
- **Alert** (`/alert`) — the active tariff-change alert, or a calm empty state.
- **Cost comparison** (`/cost-comparison`) — before/after monthly cost, chart,
  and a breakdown by component. The most visually prominent screen.
- **Change history** (`/history`) — past tariff and regulatory change events.
- **Depot settings** (`/settings`) — DISCOM, typical usage, peak demand, and
  vehicle count.

## Deploying to Vercel

The repo includes `vercel.json` with an SPA rewrite so client-side routes
(`/alert`, `/cost-comparison`, etc.) resolve correctly on refresh.
