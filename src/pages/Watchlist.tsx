import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Star, TrendingUp, TrendingDown } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
}

const fetchWatchlistCoins = async (coinIds: string[]): Promise<Coin[]> => {
  if (coinIds.length === 0) return [];
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds.join(",")}`
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

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    const saved = localStorage.getItem("watchlist");
    return saved ? JSON.parse(saved) : [];
  });

  const { data: coins, isLoading } = useQuery({
    queryKey: ["watchlist", watchlist],
    queryFn: () => fetchWatchlistCoins(watchlist),
    enabled: watchlist.length > 0,
    refetchInterval: 30000,
  });

  const removeFromWatchlist = (coinId: string) => {
    const newWatchlist = watchlist.filter((id) => id !== coinId);
    setWatchlist(newWatchlist);
    localStorage.setItem("watchlist", JSON.stringify(newWatchlist));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-8 space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Watchlist</h1>
          <p className="text-muted-foreground mt-2">Keep track of your favorite cryptocurrencies</p>
        </div>

        {watchlist.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Star className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Your watchlist is empty</p>
              <Link to="/">
                <Button>Browse Markets</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {coins?.map((coin) => (
              <Card key={coin.id} className="relative overflow-hidden transition-all hover:shadow-glow">
                <CardContent className="p-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-4 right-4 h-8 w-8 p-0"
                    onClick={() => removeFromWatchlist(coin.id)}
                  >
                    <Star className="h-4 w-4 fill-primary text-primary" />
                  </Button>

                  <Link to={`/coin/${coin.id}`} className="block">
                    <div className="flex items-center gap-3 mb-4">
                      <img src={coin.image} alt={coin.name} className="h-12 w-12 rounded-full" />
                      <div>
                        <h3 className="font-bold text-foreground">{coin.name}</h3>
                        <p className="text-sm text-muted-foreground uppercase">{coin.symbol}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Price</p>
                        <p className="text-2xl font-bold font-mono">{formatPrice(coin.current_price)}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">24h Change</p>
                          <div
                            className={cn(
                              "inline-flex items-center gap-1 text-sm font-medium",
                              coin.price_change_percentage_24h > 0 ? "text-success" : "text-destructive"
                            )}
                          >
                            {coin.price_change_percentage_24h > 0 ? (
                              <TrendingUp className="h-4 w-4" />
                            ) : (
                              <TrendingDown className="h-4 w-4" />
                            )}
                            {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-muted-foreground mb-1">Market Cap</p>
                          <p className="font-mono text-sm">{formatMarketCap(coin.market_cap)}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;
