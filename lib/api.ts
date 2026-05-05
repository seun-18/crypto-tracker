// Minimal CoinGecko wrapper for necessary endpoints
const COINGECKO = "https://api.coingecko.com/api/v3";

export async function fetchCoinsList(vs_currency = "usd", per_page = 100, page = 1) {
  const res = await fetch(`${COINGECKO}/coins/markets?vs_currency=${vs_currency}&order=market_cap_desc&per_page=${per_page}&page=${page}&sparkline=true&price_change_percentage=24h`);
  if (!res.ok) throw new Error("Failed fetching coins list");
  return res.json();
}

export async function fetchCoinById(id: string, vs_currency = "usd") {
  const res = await fetch(`${COINGECKO}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true`);
  if (!res.ok) throw new Error("Failed fetching coin");
  return res.json();
}

export async function fetchMarketChart(id: string, vs_currency = "usd", days = 7) {
  const res = await fetch(`${COINGECKO}/coins/${id}/market_chart?vs_currency=${vs_currency}&days=${days}`);
  if (!res.ok) throw new Error("Failed fetching market chart");
  return res.json();
}

export async function fetchSimplePrice(ids: string[], vs_currency = "usd") {
  const res = await fetch(`${COINGECKO}/simple/price?ids=${ids.join(",")}&vs_currencies=${vs_currency}&include_24hr_change=true&include_last_updated_at=true`);
  if (!res.ok) throw new Error("Failed simple price");
  return res.json();
}

export async function fetchFearGreedIndex() {
  // alternative.me
  const res = await fetch("https://api.alternative.me/fng/?limit=10");
  if (!res.ok) throw new Error("Failed fetching fear & greed");
  return res.json();
}