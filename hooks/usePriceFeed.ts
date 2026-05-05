import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { fetchSimplePrice } from "../lib/api";

/**
 * Simple poller that updates simple price cache for given ids every interval (ms)
 */
export function usePriceFeed(ids: string[], vs_currency: string = "usd", interval = 5000) {
  const qc = useQueryClient();
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!ids?.length) return;
    let mounted = true;

    const run = async () => {
      try {
        const data = await fetchSimplePrice(ids, vs_currency);
        if (!mounted) return;
        // write to react-query cache so components can pick up instantly
        qc.setQueryData(["simple-price", ids.join(","), vs_currency], data);
      } catch (e) {
        // ignore for now
      }
    };

    run();
    timer.current = window.setInterval(run, interval);

    return () => {
      mounted = false;
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [ids.join(","), vs_currency, interval]);
}
