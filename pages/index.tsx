import CoinList from "../components/CoinList";
import { usePriceFeed } from "../hooks/usePriceFeed";
import { useQuery } from "@tanstack/react-query";
import { fetchFearGreedIndex } from "../lib/api";
import Link from "next/link";

export default function Home({ currency }: { currency: string; setCurrency?: any }) {
  // start feed for top few popular ids (for demo)
  usePriceFeed(["bitcoin", "ethereum", "ripple", "cardano"], currency, 5000);

  const { data: fng } = useQuery(["fng"], fetchFearGreedIndex, { refetchInterval: 60_000 });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Market</h1>
        <div className="text-sm text-gray-500">Live prices (polling)</div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <CoinList currency={currency} />
        </div>

        <aside className="space-y-4">
          <div className="p-4 border rounded bg-white dark:bg-gray-800 dark:border-gray-700">
            <h3 className="font-semibold">Fear & Greed Index</h3>
            <div className="mt-2 text-sm">
              {fng?.data?.[0] ? (
                <>
                  <div className="text-2xl font-bold">{fng.data[0].value} / 100</div>
                  <div className="text-gray-500">{fng.data[0].value_classification}</div>
                  <div className="text-xs text-gray-400 mt-2">Last updated: {new Date(parseInt(fng.data[0].timestamp) * 1000).toLocaleString()}</div>
                  <Link href="/fng" className="text-blue-500 text-sm mt-2 inline-block">View history</Link>
                </>
              ) : (
                <div>Loading...</div>
              )}
            </div>
          </div>

          <div className="p-4 border rounded bg-white dark:bg-gray-800 dark:border-gray-700">
            <h3 className="font-semibold">Quick Links</h3>
            <ul className="mt-2 space-y-1 text-sm">
              <li><Link href="/portfolio" className="text-blue-500">Portfolio Simulator</Link></li>
              <li><Link href="/alerts" className="text-blue-500">Price Alerts</Link></li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}