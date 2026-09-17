import { NavLink } from "react-router-dom";
import { AlertTriangle, BarChart3, History, Home, Settings, Zap } from "lucide-react";
import { useDepot } from "../context/DepotContext";

const NAV_ITEMS = [
  { to: "/", icon: Home, label: "Depot overview" },
  { to: "/alert", icon: AlertTriangle, label: "Alert" },
  { to: "/cost-comparison", icon: BarChart3, label: "Cost comparison" },
  { to: "/history", icon: History, label: "Change history" },
  { to: "/settings", icon: Settings, label: "Depot settings" },
];

export default function Sidebar() {
  const { depot } = useDepot();
  const hasActiveAlert = depot.status === "active alert";

  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex w-20 flex-col items-center gap-2 border-r border-black/5 bg-white py-6">
      <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-700 text-white">
        <Zap size={20} strokeWidth={2.5} />
      </div>

      <nav className="flex flex-1 flex-col items-center gap-2">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            title={label}
            className={({ isActive }) =>
              `relative flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${
                isActive
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
              }`
            }
          >
            <Icon size={20} strokeWidth={2} />
            {to === "/alert" && hasActiveAlert && (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
