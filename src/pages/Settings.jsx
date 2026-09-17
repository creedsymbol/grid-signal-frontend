import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";
import PageHeader from "../components/PageHeader";
import { useDepot } from "../context/DepotContext";

const DISCOM_OPTIONS = ["TPDDL", "BYPL", "BRPL", "NDMC", "MES"];

function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-600">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-indigo-950 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100";

export default function Settings() {
  const { settings, updateSettings, loading } = useDepot();
  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleChange = (field) => (e) => {
    const raw = e.target.value;
    setForm((prev) => ({
      ...prev,
      [field]: field === "discom" ? raw : raw === "" ? "" : Number(raw),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.discom) {
      setError("Please select a DISCOM.");
      return;
    }
    if (typeof form.typicalMonthlyUsageKwh !== "number" || form.typicalMonthlyUsageKwh < 0) {
      setError("Typical monthly usage must be a non-negative number.");
      return;
    }
    if (typeof form.peakDemandKw !== "number" || form.peakDemandKw < 0) {
      setError("Peak demand must be a non-negative number.");
      return;
    }
    if (!Number.isInteger(form.vehicleCount) || form.vehicleCount < 0) {
      setError("Vehicle count must be a whole number.");
      return;
    }

    setSaving(true);
    try {
      await updateSettings(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader title="Depot settings" subtitle="Keep your depot profile up to date for accurate cost tracking" />

      <Card className="max-w-2xl p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Field label="DISCOM">
            <select className={inputClass} value={form.discom} onChange={handleChange("discom")}>
              {DISCOM_OPTIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Typical monthly usage" hint="Measured in kWh">
            <input
              type="number"
              min="0"
              className={inputClass}
              value={form.typicalMonthlyUsageKwh}
              onChange={handleChange("typicalMonthlyUsageKwh")}
            />
          </Field>

          <Field label="Peak demand" hint="Measured in kW">
            <input
              type="number"
              min="0"
              className={inputClass}
              value={form.peakDemandKw}
              onChange={handleChange("peakDemandKw")}
            />
          </Field>

          <Field label="Vehicle count" hint="Number of e-cargo three-wheelers charging at this depot">
            <input
              type="number"
              min="0"
              step="1"
              className={inputClass}
              value={form.vehicleCount}
              onChange={handleChange("vehicleCount")}
            />
          </Field>

          {error && <p className="text-sm text-rose-600">{error}</p>}

          <div className="mt-2 flex items-center gap-3">
            <Button type="submit" disabled={saving || loading}>
              {saving ? "Saving…" : "Save changes"}
            </Button>
            {saved && (
              <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600">
                <Check size={16} />
                Saved
              </span>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
