import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";
import PageHeader from "../components/PageHeader";
import { useDepot } from "../context/DepotContext";

const DISCOM_OPTIONS = ["TPDDL", "BYPL", "BRPL", "NDMC", "MES"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+()\-\s]{7,15}$/;

function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-600">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

function Toggle({ checked, onChange, label, description }) {
  return (
    <label
      className="flex cursor-pointer items-start justify-between gap-4"
      onClick={(e) => {
        e.preventDefault();
        onChange(!checked);
      }}
    >
      <div>
        <span className="block text-sm font-medium text-slate-700">{label}</span>
        {description && <span className="mt-0.5 block text-xs text-slate-400">{description}</span>}
      </div>
      <span
        role="switch"
        aria-checked={checked}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
          checked ? "bg-indigo-700" : "bg-slate-200"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-1"
          }`}
        />
      </span>
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

  const handleTextChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleToggle = (field) => (value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
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
    if (form.notifyEmail && !EMAIL_RE.test((form.notifyEmailAddress ?? "").trim())) {
      setError("Enter a valid email address to receive email alerts.");
      return;
    }
    if (form.notifySms && !PHONE_RE.test((form.notifySmsNumber ?? "").trim())) {
      setError("Enter a valid phone number to receive SMS alerts.");
      return;
    }
    if (typeof form.notifyThresholdRupees !== "number" || form.notifyThresholdRupees < 0) {
      setError("Alert threshold must be a non-negative number.");
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

      <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-6">
        <Card className="p-6 sm:p-8">
          <p className="mb-5 font-semibold text-indigo-950">Depot profile</p>
          <div className="flex flex-col gap-5">
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
          </div>
        </Card>

        <Card className="p-6 sm:p-8">
          <p className="mb-1 font-semibold text-indigo-950">Notifications</p>
          <p className="mb-5 text-sm text-slate-500">Get alerted when a tariff change is detected, without having to check the app.</p>

          <div className="flex flex-col gap-5">
            <Toggle
              checked={!!form.notifyEmail}
              onChange={handleToggle("notifyEmail")}
              label="Email alerts"
              description="Send a summary to your inbox when a change is detected"
            />
            {form.notifyEmail && (
              <Field label="Email address">
                <input
                  type="email"
                  placeholder="rohit@example.com"
                  className={inputClass}
                  value={form.notifyEmailAddress ?? ""}
                  onChange={handleTextChange("notifyEmailAddress")}
                />
              </Field>
            )}

            <Toggle
              checked={!!form.notifySms}
              onChange={handleToggle("notifySms")}
              label="SMS alerts"
              description="Send a text message for urgent tariff changes"
            />
            {form.notifySms && (
              <Field label="Phone number">
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  className={inputClass}
                  value={form.notifySmsNumber ?? ""}
                  onChange={handleTextChange("notifySmsNumber")}
                />
              </Field>
            )}

            <Field
              label="Alert threshold"
              hint="Only notify me when the expected monthly cost changes by more than this amount"
            >
              <input
                type="number"
                min="0"
                step="500"
                className={inputClass}
                value={form.notifyThresholdRupees ?? 0}
                onChange={handleChange("notifyThresholdRupees")}
              />
            </Field>
          </div>
        </Card>

        {error && <p className="text-sm text-rose-600">{error}</p>}

        <div className="flex items-center gap-3">
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
    </div>
  );
}
