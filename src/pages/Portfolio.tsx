import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface PortfolioItem {
  coinId: string;
  quantity: number;
  buyPrice: number;
}

const fetchCoinPrice = async (coinId: string) => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`
  );
  if (!response.ok) throw new Error("Failed to fetch price");
  const data = await response.json();
  return data[coinId].usd;
};

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(() => {
    const saved = localStorage.getItem("portfolio");
    return saved ? JSON.parse(saved) : [];
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCoin, setNewCoin] = useState({ coinId: "", quantity: "", buyPrice: "" });

  useEffect(() => {
    localStorage.setItem("portfolio", JSON.stringify(portfolio));
  }, [portfolio]);

  const { data: prices } = useQuery({
    queryKey: ["portfolio-prices", portfolio.map((p) => p.coinId)],
    queryFn: async () => {
      const pricePromises = portfolio.map((item) => fetchCoinPrice(item.coinId));
      const prices = await Promise.all(pricePromises);
      return portfolio.reduce((acc, item, index) => {
        acc[item.coinId] = prices[index];
        return acc;
      }, {} as Record<string, number>);
    },
    enabled: portfolio.length > 0,
    refetchInterval: 30000,
  });

  const addToPortfolio = () => {
    if (newCoin.coinId && newCoin.quantity && newCoin.buyPrice) {
      setPortfolio([
        ...portfolio,
        {
          coinId: newCoin.coinId.toLowerCase(),
          quantity: parseFloat(newCoin.quantity),
          buyPrice: parseFloat(newCoin.buyPrice),
        },
      ]);
      setNewCoin({ coinId: "", quantity: "", buyPrice: "" });
      setIsAddDialogOpen(false);
    }
  };

  const removeFromPortfolio = (index: number) => {
    setPortfolio(portfolio.filter((_, i) => i !== index));
  };

  const totalValue = portfolio.reduce((sum, item) => {
    const currentPrice = prices?.[item.coinId] || 0;
    return sum + item.quantity * currentPrice;
  }, 0);

  const totalCost = portfolio.reduce((sum, item) => sum + item.quantity * item.buyPrice, 0);
  const totalProfitLoss = totalValue - totalCost;
  const totalProfitLossPercent = totalCost > 0 ? (totalProfitLoss / totalCost) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Portfolio</h1>
            <p className="text-muted-foreground mt-2">Track your crypto investments</p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Coin
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add to Portfolio</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="coinId">Coin ID (e.g., bitcoin)</Label>
                  <Input
                    id="coinId"
                    value={newCoin.coinId}
                    onChange={(e) => setNewCoin({ ...newCoin, coinId: e.target.value })}
                    placeholder="bitcoin"
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="any"
                    value={newCoin.quantity}
                    onChange={(e) => setNewCoin({ ...newCoin, quantity: e.target.value })}
                    placeholder="0.5"
                  />
                </div>
                <div>
                  <Label htmlFor="buyPrice">Buy Price (USD)</Label>
                  <Input
                    id="buyPrice"
                    type="number"
                    step="any"
                    value={newCoin.buyPrice}
                    onChange={(e) => setNewCoin({ ...newCoin, buyPrice: e.target.value })}
                    placeholder="50000"
                  />
                </div>
                <Button onClick={addToPortfolio} className="w-full">
                  Add to Portfolio
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold font-mono">
                ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Cost
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold font-mono">
                ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Profit/Loss
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p
                  className={cn(
                    "text-3xl font-bold font-mono",
                    totalProfitLoss >= 0 ? "text-success" : "text-destructive"
                  )}
                >
                  ${Math.abs(totalProfitLoss).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <div
                  className={cn(
                    "inline-flex items-center gap-1 text-sm font-medium",
                    totalProfitLoss >= 0 ? "text-success" : "text-destructive"
                  )}
                >
                  {totalProfitLoss >= 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {Math.abs(totalProfitLossPercent).toFixed(2)}%
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {portfolio.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <p className="text-muted-foreground mb-4">Your portfolio is empty</p>
              <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Your First Coin
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">
                        Coin
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground">
                        Buy Price
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground">
                        Current Price
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground">
                        Value
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground">
                        Profit/Loss
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolio.map((item, index) => {
                      const currentPrice = prices?.[item.coinId] || 0;
                      const value = item.quantity * currentPrice;
                      const cost = item.quantity * item.buyPrice;
                      const profitLoss = value - cost;
                      const profitLossPercent = cost > 0 ? (profitLoss / cost) * 100 : 0;

                      return (
                        <tr key={index} className="border-b border-border/50">
                          <td className="px-6 py-4 font-medium text-foreground capitalize">
                            {item.coinId}
                          </td>
                          <td className="px-6 py-4 text-right font-mono text-sm">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 text-right font-mono text-sm">
                            ${item.buyPrice.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-right font-mono text-sm">
                            ${currentPrice.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-right font-mono text-sm font-medium">
                            ${value.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div
                              className={cn(
                                "inline-flex flex-col items-end",
                                profitLoss >= 0 ? "text-success" : "text-destructive"
                              )}
                            >
                              <span className="font-mono text-sm font-medium">
                                ${Math.abs(profitLoss).toFixed(2)}
                              </span>
                              <span className="text-xs">
                                {profitLoss >= 0 ? "+" : "-"}
                                {Math.abs(profitLossPercent).toFixed(2)}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromPortfolio(index)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
