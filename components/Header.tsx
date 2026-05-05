import Link from "next/link";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function Header({ currency, setCurrency }: { currency: string; setCurrency: (c: any) => void; }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="text-xl font-bold">
          CryptoTracker
        </Link>

        <div className="flex items-center gap-4">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="px-2 py-1 border rounded bg-white dark:bg-gray-700"
            aria-label="Currency"
          >
            <option value="usd">USD</option>
            <option value="eur">EUR</option>
            <option value="gbp">GBP</option>
          </select>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="px-3 py-1 border rounded bg-gray-100 dark:bg-gray-700"
            aria-label="Toggle theme"
          >
            {mounted && theme === "dark" ? "Light" : "Dark"}
          </button>

          <Link href="/portfolio" className="px-3 py-1 border rounded">Portfolio</Link>
        </div>
      </div>
    </header>
  );
}