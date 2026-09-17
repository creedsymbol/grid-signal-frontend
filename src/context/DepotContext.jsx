import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { api, MOCK } from "../lib/api";

const DepotContext = createContext(null);

function withTimestamp(obj) {
  return { ...obj, lastUpdated: new Date().toISOString() };
}

export function DepotProvider({ children }) {
  const [depot, setDepot] = useState(withTimestamp(MOCK.depot));
  const [costComparison, setCostComparison] = useState(withTimestamp(MOCK.costBaseline));
  const [changeHistory, setChangeHistory] = useState(MOCK.changeHistory);
  const [settings, setSettings] = useState(MOCK.settings);
  const [loading, setLoading] = useState(true);

  // Once a live call fails, stay on local mock state for the rest of the
  // session rather than mixing live and mock data across screens.
  const liveRef = useRef(true);

  const loadInitial = useCallback(async () => {
    setLoading(true);
    try {
      const [depotRes, costRes, historyRes, settingsRes] = await Promise.all([
        api.getDepot(),
        api.getCostComparison(),
        api.getChangeHistory(),
        api.getSettings(),
      ]);
      liveRef.current = true;
      setDepot(depotRes);
      setCostComparison(costRes);
      setChangeHistory(historyRes.events ?? historyRes);
      setSettings(settingsRes);
    } catch (err) {
      console.warn("GridSignal: live API unavailable, using demo data.", err);
      liveRef.current = false;
      setDepot(withTimestamp(MOCK.depot));
      setCostComparison(withTimestamp(MOCK.costBaseline));
      setChangeHistory(MOCK.changeHistory);
      setSettings(MOCK.settings);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  const simulateChange = useCallback(async () => {
    if (liveRef.current) {
      try {
        await api.simulateChange();
        const [depotRes, costRes, historyRes] = await Promise.all([
          api.getDepot(),
          api.getCostComparison(),
          api.getChangeHistory(),
        ]);
        setDepot(depotRes);
        setCostComparison(costRes);
        setChangeHistory(historyRes.events ?? historyRes);
        return;
      } catch (err) {
        console.warn("GridSignal: simulate-change failed against live API, switching to demo data.", err);
        liveRef.current = false;
      }
    }

    const now = new Date();
    const alert = {
      ...MOCK.simulatedAlert,
      id: `mock-${now.getTime()}`,
      date: now.toISOString().slice(0, 10),
    };
    setDepot((prev) => withTimestamp({ ...prev, status: "active alert" }));
    setCostComparison(withTimestamp(MOCK.costAfterAlert));
    setChangeHistory((prev) => [...prev, alert]);
  }, []);

  const resetToNormal = useCallback(async () => {
    if (liveRef.current) {
      try {
        await api.resetToNormal();
        const [depotRes, costRes] = await Promise.all([api.getDepot(), api.getCostComparison()]);
        setDepot(depotRes);
        setCostComparison(costRes);
        return;
      } catch (err) {
        console.warn("GridSignal: reset failed against live API, switching to demo data.", err);
        liveRef.current = false;
      }
    }

    setDepot((prev) => withTimestamp({ ...prev, status: "no active alert" }));
    setCostComparison(withTimestamp(MOCK.costBaseline));
  }, []);

  const updateSettings = useCallback(async (patch) => {
    if (liveRef.current) {
      try {
        const updated = await api.updateSettings(patch);
        setSettings(updated);
        return updated;
      } catch (err) {
        console.warn("GridSignal: settings update failed against live API, switching to demo data.", err);
        liveRef.current = false;
      }
    }

    let next;
    setSettings((prev) => {
      next = { ...prev, ...patch };
      return next;
    });
    return next;
  }, []);

  const value = {
    depot,
    costComparison,
    changeHistory,
    settings,
    loading,
    simulateChange,
    resetToNormal,
    updateSettings,
  };

  return <DepotContext.Provider value={value}>{children}</DepotContext.Provider>;
}

export function useDepot() {
  const ctx = useContext(DepotContext);
  if (!ctx) throw new Error("useDepot must be used within a DepotProvider");
  return ctx;
}
