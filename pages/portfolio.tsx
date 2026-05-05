import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCoinsList } from "../lib/api";

export default function Portfolio({ currency }: { currency: string }) {
  const [holdings, setHoldings] = useState<Record<string, number>>({});
  useEffect(() => {
    const raw = localStorage.getItem("portfolio");
    if (raw) setHoldings(JSON.parse(raw));
  }, []);

  const save = (next: any) => {
    setHoldings(next);
    localStorage.setItem("portfolio", JSON.stringify(next));
  };

  const { data: coins } = useQuery(["coins-portfolio", currency], () => fetchCoinsList(currency, 100, 1), { enabled: !!currency });

  const totalValue = coins ? Object.entries(holdings).reduce((acc, [id, amount]) => {
    const coin = coins.find((c: any) => c.id === id);
    return acc + (coin ? coin.current_price * amount : 0);
  }, 0) : 0;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Portfolio Simulator</h1>
      <div className="p-4 border rounded bg-white dark:bg-gray-800 dark:border-gray-700">
        <div className="mb-3">Total simulated value: <strong>{new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(totalValue)}</strong></div>

        <div className="space-y-3">
          {coins?.slice(0, 12).map((c: any) => {
            const amt = holdings[c.id] || 0;
            return (
              <div key={c.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={c.image} alt={c.name} className="w-6 h-6" />
                  <div>
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-gray-500">{formatCurrency(c.current_price, currency)}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input type="number" min="0" step="any" value={amt} onChange={(e) => {
                    const val = Math.max(0, parseFloat(e.target.value || "0"));
                    save({ ...holdings, [c.id]: val });
                  }} className="w-24 p-1 border rounded bg-white dark:bg-gray-700" />
                  <div className="text-sm">{formatCurrency((amt || 0) * c.current_price, currency)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function formatCurrency(val: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(val);
}