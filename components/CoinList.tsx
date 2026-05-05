import { useQuery } from "@tanstack/react-query";
import { fetchCoinsList } from "../lib/api";
import CoinCard from "./CoinCard";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function CoinList({ currency }: { currency: string }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const { data, error, isLoading } = useQuery(["coins", currency, page], () => fetchCoinsList(currency, 50, page), {
    keepPreviousData: true,
    staleTime: 10_000
  });

  if (isLoading) return <div>Loading coins...</div>;
  if (error) return <div>Failed to load coins</div>;

  // simple filter
  const list = data.filter((c: any) => c.name.toLowerCase().includes(query.toLowerCase()) || c.symbol.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <input value={query} onChange={(e) => setQuery(e.target.value)} className="flex-1 p-2 border rounded" placeholder="Search by name or symbol..." />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {list.map((coin: any) => (
          <CoinCard key={coin.id} coin={coin} currency={currency} />
        ))}
      </div>

      <div className="flex items-center justify-between mt-4">
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1 border rounded">Prev</button>
        <div>Page {page}</div>
        <button onClick={() => setPage((p) => p + 1)} className="px-3 py-1 border rounded">Next</button>
      </div>
    </div>
  );
}