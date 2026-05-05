import { useEffect, useRef } from "react";
import { fetchSimplePrice } from "../lib/api";

/**
 * Watches alerts saved in localStorage and triggers browser notifications
 * This component should be mounted at app root (e.g. in _app)
 */
export default function AlertWatcher({ interval = 5000 }: { interval?: number }) {
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const run = async () => {
      const raw = localStorage.getItem("alerts");
      if (!raw) return;
      const alerts = JSON.parse(raw);
      if (!alerts.length) return;

      // group ids to one call
      const ids = [...new Set(alerts.map((a: any) => a.coinId))];
      try {
        const prices = await fetchSimplePrice(ids, "usd"); // currency is stored per alert; for simplicity using usd
        let updated = false;
        const nextAlerts = alerts.map((a: any) => {
          const p = prices[a.coinId]?.usd;
          if (p == null) return a;
          const shouldTrigger = a.direction === "above" ? p >= a.target : p <= a.target;
          if (shouldTrigger && !a.triggered) {
            // browser notification
            if (Notification && Notification.permission === "granted") {
              new Notification(`Price alert: ${a.coinId}`, { body: `${a.coinId} is ${a.direction} ${a.target}. Current: ${p}` });
            } else {
              // fallback console
              console.log(`ALERT: ${a.coinId} ${p}`);
            }
            a.triggered = true;
            updated = true;
          }
          return a;
        });
        if (updated) localStorage.setItem("alerts", JSON.stringify(nextAlerts));
      } catch (e) {
        // ignore
      }
    };

    run();
    timerRef.current = window.setInterval(run, interval);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [interval]);

  return null;
}