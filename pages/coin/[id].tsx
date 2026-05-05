import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { fetchCoinById, fetchMarketChart } from "../../lib/api";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { usePriceFeed } from "../../hooks/usePriceFeed";
const Chart = dynamic(() => import("../../components/Chart"), { ssr: false });

export default function CoinPage({ currency }: { currency: string }) {
  const router = useRouter();
  const { id } = router.query as { id?: string };
  const { data: coin, isLoading } = useQuery(["coin", id, currency], () => fetchCoinById(id as string, currency), { enabled: !!id });
  const { data: chart } = useQuery(["chart", id, currency], () => fetchMarketChart(id as string, currency, 30), { enabled: !!id });

  // live feed for this coin
  usePriceFeed(id ? [id] : [], currency, 5000);

  if (isLoading || !coin) return <div>Loading...</div>;

  const price = coin.market_data?.current_price?.[currency] ?? 0;
  const change = coin.market_data?.price_change_percentage_24h;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <img src={coin.image.thumb} alt={coin.name} />
        <div>
          <h1 className="text-2xl font-bold">{coin.name} <span className="text-sm text-gray-500">({coin.symbol.toUpperCase()})</span></h1>
          <div className="text-lg">{formatCurrency(price, currency)} <span className={change >= 0 ? "text-green-500" : "text-red-500"}>{change?.toFixed(2)}%</span></div>
        </div>
      </div>

      <div className="p-4 border rounded bg-white dark:bg-gray-800 dark:border-gray-700">
        <h2 className="font-semibold mb-3">Price (30d)</h2>
        {chart ? <Chart series={chart.prices} currency={currency} /> : <div>Loading chart...</div>}
      </div>

      <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: coin.description?.en?.split(". ").slice(0, 3).join(". ") + "." }} />
    </div>
  );
}

function formatCurrency(val: number, currency: string) {
  const codes: any = { usd: "USD", eur: "EUR", gbp: "GBP" };
  return new Intl.NumberFormat("en-US", { style: "currency", currency: codes[currency] || "USD" }).format(val);
}