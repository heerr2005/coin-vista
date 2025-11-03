import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpDown, Star, TrendingUp, TrendingDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  circulating_supply: number;
  market_cap_rank: number;
}

const fetchCoins = async (): Promise<Coin[]> => {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
  );
  if (!response.ok) throw new Error("Failed to fetch coins");
  return response.json();
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

const CoinTable = () => {
  const [watchlist, setWatchlist] = useState<Set<string>>(
    new Set(JSON.parse(localStorage.getItem("watchlist") || "[]"))
  );

  const { data: coins, isLoading } = useQuery({
    queryKey: ["coins"],
    queryFn: fetchCoins,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const toggleWatchlist = (coinId: string) => {
    const newWatchlist = new Set(watchlist);
    if (newWatchlist.has(coinId)) {
      newWatchlist.delete(coinId);
    } else {
      newWatchlist.add(coinId);
    }
    setWatchlist(newWatchlist);
    localStorage.setItem("watchlist", JSON.stringify([...newWatchlist]));
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(10)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left">
                <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground">
                  <Star className="h-3 w-3" />
                </Button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">#</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Name</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Price</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">24h %</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Market Cap</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Volume (24h)</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Supply</th>
            </tr>
          </thead>
          <tbody>
            {coins?.map((coin) => (
              <tr
                key={coin.id}
                className="border-b border-border/50 transition-colors hover:bg-muted/30"
              >
                <td className="px-4 py-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => toggleWatchlist(coin.id)}
                  >
                    <Star
                      className={cn(
                        "h-4 w-4 transition-colors",
                        watchlist.has(coin.id) ? "fill-primary text-primary" : "text-muted-foreground"
                      )}
                    />
                  </Button>
                </td>
                <td className="px-4 py-4 text-sm text-muted-foreground">{coin.market_cap_rank}</td>
                <td className="px-4 py-4">
                  <Link to={`/coin/${coin.id}`} className="flex items-center gap-3 group">
                    <img src={coin.image} alt={coin.name} className="h-8 w-8 rounded-full" />
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {coin.name}
                      </span>
                      <span className="text-xs text-muted-foreground uppercase">{coin.symbol}</span>
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-4 text-right font-mono text-sm font-medium text-foreground">
                  {formatPrice(coin.current_price)}
                </td>
                <td className="px-4 py-4 text-right">
                  <div
                    className={cn(
                      "inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium",
                      coin.price_change_percentage_24h > 0
                        ? "bg-success/10 text-success"
                        : "bg-destructive/10 text-destructive"
                    )}
                  >
                    {coin.price_change_percentage_24h > 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                  </div>
                </td>
                <td className="px-4 py-4 text-right font-mono text-sm text-foreground">
                  {formatMarketCap(coin.market_cap)}
                </td>
                <td className="px-4 py-4 text-right font-mono text-sm text-muted-foreground">
                  {formatMarketCap(coin.total_volume)}
                </td>
                <td className="px-4 py-4 text-right font-mono text-sm text-muted-foreground">
                  {coin.circulating_supply?.toLocaleString(undefined, { maximumFractionDigits: 0 })} {coin.symbol.toUpperCase()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CoinTable;
