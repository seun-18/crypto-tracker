import Link from "next/link";

export default function CoinCard({ coin, currency }: { coin: any; currency: string }) {
  const price = coin.current_price ?? coin?.price;
  const change = coin.price_change_percentage_24h ?? coin?.price_change_percentage_24h;
  return (
    <div className="p-4 border rounded bg-white dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <img src={coin.image} alt={coin.name} className="w-8 h-8" />
        <div className="flex-1">
          <Link href={`/coin/${coin.id}`} className="font-semibold">{coin.name}</Link>
          <div className="text-sm text-gray-500 dark:text-gray-400">{coin.symbol?.toUpperCase()}</div>
        </div>
        <div className="text-right">
          <div className="font-medium">{formatCurrency(price, currency)}</div>
          <div className={change >= 0 ? "text-green-500 text-sm" : "text-red-500 text-sm"}>
            {change ? change.toFixed(2) + "%" : "-"}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatCurrency(val: number | undefined, currency: string) {
  if (val == null) return "-";
  const locales: any = { usd: "en-US", eur: "de-DE", gbp: "en-GB" };
  const codes: any = { usd: "USD", eur: "EUR", gbp: "GBP" };
  return new Intl.NumberFormat(locales[currency] || "en-US", { style: "currency", currency: codes[currency] || "USD" }).format(val);
}