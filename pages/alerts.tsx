import { useEffect, useState } from "react";

type Alert = { id: string; coinId: string; target: number; direction: "above" | "below"; currency: string; triggered?: boolean };

function getAlerts(): Alert[] {
  try {
    const raw = localStorage.getItem("alerts");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function Alerts({ currency }: { currency: string }) {
  const [alerts, setAlerts] = useState<Alert[]>(getAlerts);
  const [coinId, setCoinId] = useState("bitcoin");
  const [target, setTarget] = useState<number>(0);
  const [direction, setDirection] = useState<"above" | "below">("above");

  useEffect(() => {
    localStorage.setItem("alerts", JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    // ask for permission for notifications
    if (Notification && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  function addAlert() {
    const a: Alert = { id: Date.now().toString(), coinId, target, direction, currency };
    setAlerts((s) => [...s, a]);
  }

  function removeAlert(id: string) {
    setAlerts((s) => s.filter((x) => x.id !== id));
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Price Alerts</h1>

      <div className="p-4 border rounded bg-white dark:bg-gray-800 dark:border-gray-700">
        <div className="flex gap-2 items-center">
          <input value={coinId} onChange={(e) => setCoinId(e.target.value)} className="p-2 border rounded flex-1" />
          <input value={target} onChange={(e) => setTarget(parseFloat(e.target.value || "0"))} type="number" className="p-2 w-28 border rounded" />
          <select value={direction} onChange={(e) => setDirection(e.target.value as any)} className="p-2 border rounded">
            <option value="above">Above</option>
            <option value="below">Below</option>
          </select>
          <button onClick={addAlert} className="px-3 py-1 border rounded">Add</button>
        </div>

        <div className="mt-4 space-y-2">
          {alerts.map((a) => (
            <div key={a.id} className="flex items-center justify-between p-2 border rounded">
              <div>
                <div className="font-medium">{a.coinId}</div>
                <div className="text-sm text-gray-500">{a.direction} {a.target} {a.currency.toUpperCase()}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => removeAlert(a.id)} className="px-2 py-1 border rounded">Remove</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-sm text-gray-500">Note: Alerts are checked in the client while this page (or the app) is open. For persistent server-side alerts, integrate a backend worker and push notifications or emails.</p>
    </div>
  );
}