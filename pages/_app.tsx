import "../styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import Header from "../components/Header";
import { useState } from "react";
import AlertWatcher from "../components/AlertWatcher";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const [currency, setCurrency] = useState<"usd" | "eur" | "gbp">("usd");

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class">
        <div className="min-h-screen">
          <Header currency={currency} setCurrency={setCurrency} />
          <AlertWatcher />
          <main className="container py-6">
            <Component {...pageProps} currency={currency} setCurrency={setCurrency} />
          </main>
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}