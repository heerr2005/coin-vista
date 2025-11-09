import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface GlobalData {
  data: {
    active_cryptocurrencies: number;
    markets: number;
    total_market_cap: { usd: number };
    total_volume: { usd: number };
    market_cap_percentage: { btc: number; eth: number };
    market_cap_change_percentage_24h_usd: number;
  };
}

const fetchGlobalData = async (): Promise<GlobalData> => {
  const response = await fetch("https://api.coingecko.com/api/v3/global");
  if (!response.ok) throw new Error("Failed to fetch global data");
  return response.json();
};

const fetchFearGreedIndex = async () => {
  try {
    const response = await fetch("https://api.alternative.me/fng/");
    if (!response.ok) throw new Error("Failed to fetch fear & greed");
    const data = await response.json();
    return data.data[0];
  } catch {
    return { value: "50", value_classification: "Neutral" };
  }
};

const MarketStats = () => {
  const { data: globalData } = useQuery({
    queryKey: ["global-data"],
    queryFn: fetchGlobalData,
    refetchInterval: 60000,
  });

  const { data: fearGreed } = useQuery({
    queryKey: ["fear-greed"],
    queryFn: fetchFearGreedIndex,
    refetchInterval: 60000,
  });

  const marketCap = globalData?.data?.total_market_cap?.usd;
  const volume = globalData?.data?.total_volume?.usd;
  const marketCapChange = globalData?.data?.market_cap_change_percentage_24h_usd;
  const btcDominance = globalData?.data?.market_cap_percentage?.btc;
  const fearGreedValue = parseInt(fearGreed?.value || "50");
  const fearGreedLabel = fearGreed?.value_classification || "Neutral";

  const formatNumber = (num: number | undefined) => {
    if (!num) return "$0";
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toFixed(2)}`;
  };

  const getFearGreedColor = (value: number) => {
    if (value < 25) return "text-destructive";
    if (value < 45) return "text-orange-500";
    if (value < 55) return "text-yellow-500";
    if (value < 75) return "text-success";
    return "text-success";
  };

  return (
    <div className="bg-muted/30 border-y border-border py-6 animate-fade-in">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {/* Market Cap */}
          <Card className="border-border/50 hover-scale">
            <CardContent className="p-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Activity className="h-3 w-3" />
                  <span>Market Cap</span>
                </div>
                <p className="text-lg font-bold font-mono">{formatNumber(marketCap)}</p>
                {marketCapChange !== undefined && (
                  <p className={cn(
                    "text-xs font-medium flex items-center gap-1",
                    marketCapChange >= 0 ? "text-success" : "text-destructive"
                  )}>
                    {marketCapChange >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {Math.abs(marketCapChange).toFixed(2)}%
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 24h Volume */}
          <Card className="border-border/50 hover-scale">
            <CardContent className="p-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">24h Volume</p>
                <p className="text-lg font-bold font-mono">{formatNumber(volume)}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </CardContent>
          </Card>

          {/* Fear & Greed */}
          <Card className="border-border/50 hover-scale">
            <CardContent className="p-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Fear & Greed</p>
                <p className={cn("text-lg font-bold font-mono", getFearGreedColor(fearGreedValue))}>
                  {fearGreedValue}
                </p>
                <p className="text-xs text-muted-foreground">{fearGreedLabel}</p>
              </div>
            </CardContent>
          </Card>

          {/* BTC Dominance */}
          <Card className="border-border/50 hover-scale">
            <CardContent className="p-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">BTC Dominance</p>
                <p className="text-lg font-bold font-mono">{btcDominance?.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">Market Share</p>
              </div>
            </CardContent>
          </Card>

          {/* Active Cryptos */}
          <Card className="border-border/50 hover-scale">
            <CardContent className="p-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Active Cryptos</p>
                <p className="text-lg font-bold font-mono">
                  {globalData?.data?.active_cryptocurrencies?.toLocaleString() || "0"}
                </p>
                <p className="text-xs text-muted-foreground">Tracked</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MarketStats;
