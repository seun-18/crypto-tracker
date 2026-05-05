import ReactApexChart from "react-apexcharts";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Chart({ series, currency }: { series: any[]; currency: string }) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // series is array of [timestamp, price]
  const prices = series.map((p: any[]) => ({ x: new Date(p[0]), y: p[1] }));

  const options: any = {
    chart: { type: "area", height: 320, toolbar: { show: false } },
    xaxis: { type: "datetime" },
    yaxis: { labels: { formatter: (val: number) => val.toFixed(2) } },
    stroke: { curve: "smooth" },
    theme: { mode: mounted && theme === "dark" ? "dark" : "light" }
  };

  return <ReactApexChart options={options} series={[{ name: `Price (${currency.toUpperCase()})`, data: prices }]} type="area" height={320} />;
}