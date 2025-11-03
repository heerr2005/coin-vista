import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ExternalLink, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/Header";
import { cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";

interface CoinDetail {
  id: string;
  symbol: string;
  name: string;
  image: { large: string };
  market_data: {
    current_price: { usd: number };
    price_change_percentage_24h: number;
    market_cap: { usd: number };
    total_volume: { usd: number };
    circulating_supply: number;
    max_supply: number;
    market_cap_rank: number;
  };
  description: { en: string };
  links: {
    homepage: string[];
    blockchain_site: string[];
  };
}

const fetchCoinDetails = async (id: string): Promise<CoinDetail> => {
  const response = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`);
  if (!response.ok) throw new Error("Failed to fetch coin details");
  return response.json();
};

const fetchChartData = async (id: string, days: number) => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`
  );
  if (!response.ok) throw new Error("Failed to fetch chart data");
  const data = await response.json();
  return data.prices.map(([timestamp, price]: [number, number]) => ({
    timestamp,
    price,
    date: new Date(timestamp).toLocaleDateString(),
  }));
};

const formatPrice = (price: number) => {
  if (price < 1) return `$${price.toFixed(6)}`;
  if (price < 100) return `$${price.toFixed(4)}`;
  return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatMarketCap = (value: number) => {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toLocaleString()}`;
};

const CoinDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [chartDays, setChartDays] = useState(7);

  const { data: coin, isLoading } = useQuery({
    queryKey: ["coin", id],
    queryFn: () => fetchCoinDetails(id!),
    enabled: !!id,
  });

  const { data: chartData } = useQuery({
    queryKey: ["chart", id, chartDays],
    queryFn: () => fetchChartData(id!, chartDays),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8 space-y-8">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!coin) return null;

  const priceChange = coin.market_data.price_change_percentage_24h;
  const isPositive = priceChange > 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-8 space-y-8">
        <Link to="/">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Markets
          </Button>
        </Link>

        <div className="flex items-center gap-4">
          <img src={coin.image.large} alt={coin.name} className="h-16 w-16 rounded-full" />
          <div>
            <h1 className="text-4xl font-bold text-foreground">{coin.name}</h1>
            <p className="text-lg text-muted-foreground uppercase">{coin.symbol}</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Price</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="text-2xl font-bold font-mono">
                  {formatPrice(coin.market_data.current_price.usd)}
                </p>
                <div
                  className={cn(
                    "inline-flex items-center gap-1 text-sm font-medium",
                    isPositive ? "text-success" : "text-destructive"
                  )}
                >
                  {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {Math.abs(priceChange).toFixed(2)}%
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Market Cap</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold font-mono">
                {formatMarketCap(coin.market_data.market_cap.usd)}
              </p>
              <p className="text-sm text-muted-foreground">Rank #{coin.market_data.market_cap_rank}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Volume (24h)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold font-mono">
                {formatMarketCap(coin.market_data.total_volume.usd)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Circulating Supply</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold font-mono">
                {coin.market_data.circulating_supply?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
              {coin.market_data.max_supply && (
                <p className="text-sm text-muted-foreground">
                  Max: {coin.market_data.max_supply.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Price Chart</CardTitle>
              <div className="flex gap-2">
                {[
                  { label: "1D", days: 1 },
                  { label: "7D", days: 7 },
                  { label: "1M", days: 30 },
                  { label: "1Y", days: 365 },
                ].map((option) => (
                  <Button
                    key={option.days}
                    variant={chartDays === option.days ? "default" : "outline"}
                    size="sm"
                    onClick={() => setChartDays(option.days)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => formatMarketCap(value)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => formatPrice(value)}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {coin.description.en && (
          <Card>
            <CardHeader>
              <CardTitle>About {coin.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="prose prose-invert max-w-none text-muted-foreground"
                dangerouslySetInnerHTML={{
                  __html: coin.description.en.split(". ").slice(0, 3).join(". ") + ".",
                }}
              />
            </CardContent>
          </Card>
        )}

        {coin.links.homepage[0] && (
          <Card>
            <CardHeader>
              <CardTitle>Links</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-3">
              {coin.links.homepage[0] && (
                <a href={coin.links.homepage[0]} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="gap-2">
                    Official Website
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              )}
              {coin.links.blockchain_site[0] && (
                <a href={coin.links.blockchain_site[0]} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="gap-2">
                    Explorer
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CoinDetails;
